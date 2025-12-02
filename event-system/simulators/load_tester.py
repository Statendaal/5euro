#!/usr/bin/env python3
"""
High-Throughput Load Tester for Event Systems.

Compares PostgreSQL vs NATS JetStream performance.
"""
import asyncio
import logging
import time
import statistics
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime
import sys
sys.path.insert(0, '.')

from simulators.case_generator import CaseGenerator
from nats.publisher import NatsEventPublisher
from postgres.publisher import PostgresEventPublisher

logger = logging.getLogger(__name__)


@dataclass
class LoadTestResult:
    """Results from a load test run."""
    backend: str
    total_cases: int
    total_events: int
    duration_seconds: float
    cases_per_second: float
    events_per_second: float
    latencies_ms: List[float]
    p50_latency_ms: float
    p95_latency_ms: float
    p99_latency_ms: float
    errors: int


class LoadTester:
    """
    High-throughput load tester for event systems.
    """

    def __init__(self, generator: CaseGenerator):
        self.generator = generator

    async def test_nats(
        self,
        num_cases: int,
        concurrent: int = 100
    ) -> LoadTestResult:
        """
        Test NATS JetStream performance.

        Args:
            num_cases: Number of cases to generate
            concurrent: Number of concurrent publishers

        Returns:
            LoadTestResult
        """
        print(f"\n{'='*80}")
        print(f"NATS JetStream Load Test")
        print(f"{'='*80}")
        print(f"Cases: {num_cases:,}")
        print(f"Concurrent: {concurrent}")
        print()

        publisher = NatsEventPublisher()
        await publisher.connect()

        # Generate all cases upfront
        print("Generating test cases...")
        all_events = []
        for i in range(num_cases):
            case_id = f"load-test-nats-{i+1:06d}"
            events = self.generator.generate_full_case_flow(case_id)
            all_events.extend(events)

        total_events = len(all_events)
        print(f"Generated {num_cases:,} cases = {total_events:,} events")
        print()

        # Publish with concurrency control
        print("Publishing events...")
        start_time = time.time()

        latencies = []
        errors = 0

        semaphore = asyncio.Semaphore(concurrent)

        async def publish_event(event):
            """Publish single event with timing."""
            async with semaphore:
                event_start = time.time()
                try:
                    await publisher.publish(event, timeout=10.0)
                    latency_ms = (time.time() - event_start) * 1000
                    latencies.append(latency_ms)
                except Exception as e:
                    nonlocal errors
                    errors += 1
                    logger.error(f"Publish error: {e}")

        # Publish all events concurrently
        tasks = [publish_event(event) for event in all_events]
        await asyncio.gather(*tasks)

        duration = time.time() - start_time

        await publisher.close()

        # Calculate statistics
        result = LoadTestResult(
            backend="NATS JetStream",
            total_cases=num_cases,
            total_events=total_events,
            duration_seconds=duration,
            cases_per_second=num_cases / duration,
            events_per_second=total_events / duration,
            latencies_ms=latencies,
            p50_latency_ms=statistics.median(latencies) if latencies else 0,
            p95_latency_ms=statistics.quantiles(latencies, n=20)[18] if latencies else 0,
            p99_latency_ms=statistics.quantiles(latencies, n=100)[98] if latencies else 0,
            errors=errors
        )

        self._print_results(result)
        return result

    def test_postgres(
        self,
        num_cases: int,
        batch_size: int = 10
    ) -> LoadTestResult:
        """
        Test PostgreSQL performance.

        Args:
            num_cases: Number of cases to generate
            batch_size: Batch size for publishing

        Returns:
            LoadTestResult
        """
        print(f"\n{'='*80}")
        print(f"PostgreSQL Event Store Load Test")
        print(f"{'='*80}")
        print(f"Cases: {num_cases:,}")
        print(f"Batch size: {batch_size}")
        print()

        connection_string = "postgresql://marc@localhost/schulden"
        publisher = PostgresEventPublisher(connection_string)

        # Generate all cases upfront
        print("Generating test cases...")
        all_cases = []
        for i in range(num_cases):
            case_id = f"load-test-pg-{i+1:06d}"
            events = self.generator.generate_full_case_flow(case_id)
            all_cases.append((case_id, events))

        total_events = sum(len(events) for _, events in all_cases)
        print(f"Generated {num_cases:,} cases = {total_events:,} events")
        print()

        # Publish events
        print("Publishing events...")
        start_time = time.time()

        latencies = []
        errors = 0

        for case_id, events in all_cases:
            for event in events:
                event_start = time.time()
                try:
                    publisher.publish(
                        stream_id=case_id,
                        stream_type="case",
                        event=event,
                        use_outbox=False  # Skip outbox for speed
                    )
                    latency_ms = (time.time() - event_start) * 1000
                    latencies.append(latency_ms)
                except Exception as e:
                    errors += 1
                    logger.error(f"Publish error: {e}")

        duration = time.time() - start_time

        publisher.close()

        # Calculate statistics
        result = LoadTestResult(
            backend="PostgreSQL 18",
            total_cases=num_cases,
            total_events=total_events,
            duration_seconds=duration,
            cases_per_second=num_cases / duration,
            events_per_second=total_events / duration,
            latencies_ms=latencies,
            p50_latency_ms=statistics.median(latencies) if latencies else 0,
            p95_latency_ms=statistics.quantiles(latencies, n=20)[18] if latencies else 0,
            p99_latency_ms=statistics.quantiles(latencies, n=100)[98] if latencies else 0,
            errors=errors
        )

        self._print_results(result)
        return result

    def _print_results(self, result: LoadTestResult):
        """Print test results."""
        print(f"\n{'='*80}")
        print(f"{result.backend} - Results")
        print(f"{'='*80}")
        print()
        print(f"📊 Throughput:")
        print(f"   Cases/sec:  {result.cases_per_second:>12,.1f}")
        print(f"   Events/sec: {result.events_per_second:>12,.1f}")
        print()
        print(f"⏱️  Latency (ms):")
        print(f"   p50:        {result.p50_latency_ms:>12.2f}")
        print(f"   p95:        {result.p95_latency_ms:>12.2f}")
        print(f"   p99:        {result.p99_latency_ms:>12.2f}")
        print()
        print(f"📈 Volume:")
        print(f"   Total cases:  {result.total_cases:>12,}")
        print(f"   Total events: {result.total_events:>12,}")
        print(f"   Duration:     {result.duration_seconds:>12.2f}s")
        print(f"   Errors:       {result.errors:>12,}")
        print()

    def compare_results(self, results: List[LoadTestResult]):
        """Compare multiple test results."""
        print(f"\n{'='*80}")
        print("Performance Comparison")
        print(f"{'='*80}")
        print()

        # Create comparison table
        print(f"{'Backend':<20} {'Events/sec':>15} {'p50 (ms)':>12} {'p99 (ms)':>12} {'Errors':>10}")
        print(f"{'-'*20} {'-'*15} {'-'*12} {'-'*12} {'-'*10}")

        for result in results:
            print(
                f"{result.backend:<20} "
                f"{result.events_per_second:>15,.1f} "
                f"{result.p50_latency_ms:>12.2f} "
                f"{result.p99_latency_ms:>12.2f} "
                f"{result.errors:>10,}"
            )

        print()

        # Calculate speedup
        if len(results) == 2:
            speedup = results[0].events_per_second / results[1].events_per_second
            faster = results[0].backend if speedup > 1 else results[1].backend
            speedup = max(speedup, 1/speedup)

            print(f"🏆 Winner: {faster}")
            print(f"   {speedup:.1f}x faster throughput")
            print()


async def run_benchmarks():
    """Run complete benchmark suite."""
    generator = CaseGenerator(seed=42)
    tester = LoadTester(generator)

    results = []

    # Test different scenarios
    scenarios = [
        {"name": "Small Load (100 cases)", "cases": 100, "pg": True, "nats": True},
        {"name": "Medium Load (1,000 cases)", "cases": 1000, "pg": True, "nats": True},
        {"name": "Large Load (10,000 cases)", "cases": 10000, "pg": False, "nats": True},
        {"name": "Extra Large (50,000 cases)", "cases": 50000, "pg": False, "nats": True},
    ]

    for scenario in scenarios:
        print(f"\n\n{'#'*80}")
        print(f"# {scenario['name']}")
        print(f"{'#'*80}\n")

        scenario_results = []

        # Test NATS
        if scenario["nats"]:
            try:
                nats_result = await tester.test_nats(
                    num_cases=scenario["cases"],
                    concurrent=100
                )
                scenario_results.append(nats_result)
            except Exception as e:
                print(f"❌ NATS test failed: {e}")

        # Test PostgreSQL
        if scenario["pg"]:
            try:
                pg_result = tester.test_postgres(
                    num_cases=scenario["cases"],
                    batch_size=10
                )
                scenario_results.append(pg_result)
            except Exception as e:
                print(f"❌ PostgreSQL test failed: {e}")

        # Compare
        if len(scenario_results) > 1:
            tester.compare_results(scenario_results)

        results.extend(scenario_results)

        # Cooldown between scenarios
        if scenario != scenarios[-1]:
            print("\n⏸️  Cooling down for 5 seconds...")
            await asyncio.sleep(5)

    # Final summary
    print(f"\n\n{'='*80}")
    print("FINAL SUMMARY")
    print(f"{'='*80}\n")

    tester.compare_results(results)

    print("\n✅ Benchmark suite completed!\n")


async def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="Event System Load Tester")
    parser.add_argument("--backend", choices=["postgres", "nats", "both"], default="both")
    parser.add_argument("--cases", type=int, default=1000, help="Number of cases")
    parser.add_argument("--concurrent", type=int, default=100, help="Concurrent publishers (NATS)")
    parser.add_argument("--benchmark", action="store_true", help="Run full benchmark suite")

    args = parser.parse_args()

    if args.benchmark:
        await run_benchmarks()
        return

    generator = CaseGenerator(seed=42)
    tester = LoadTester(generator)

    results = []

    if args.backend in ["nats", "both"]:
        nats_result = await tester.test_nats(args.cases, args.concurrent)
        results.append(nats_result)

    if args.backend in ["postgres", "both"]:
        pg_result = tester.test_postgres(args.cases)
        results.append(pg_result)

    if len(results) > 1:
        tester.compare_results(results)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.WARNING,  # Reduce noise during benchmarks
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nBenchmark interrupted by user")
        sys.exit(0)
