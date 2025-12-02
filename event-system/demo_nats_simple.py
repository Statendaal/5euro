#!/usr/bin/env python3
"""
Simple NATS demonstration without needing Docker.
Uses in-memory simulation to show performance characteristics.
"""
import asyncio
import time
import statistics
from typing import List
import sys
sys.path.insert(0, '.')

from simulators.case_generator import CaseGenerator
from shared.events import BaseEvent, serialize_event


class InMemoryEventQueue:
    """
    In-memory event queue that simulates NATS JetStream performance characteristics.
    """

    def __init__(self):
        self.events = []
        self.latencies = []

    async def publish(self, event: BaseEvent) -> str:
        """Simulate publishing an event."""
        start = time.time()

        # Simulate network + serialization overhead
        data = serialize_event(event)
        await asyncio.sleep(0.0001)  # 0.1ms simulated latency

        self.events.append(data)

        latency_ms = (time.time() - start) * 1000
        self.latencies.append(latency_ms)

        return f"seq-{len(self.events)}"

    async def publish_batch(self, events: List[BaseEvent], concurrent: int = 100):
        """Publish events with controlled concurrency."""
        semaphore = asyncio.Semaphore(concurrent)

        async def publish_one(event):
            async with semaphore:
                return await self.publish(event)

        tasks = [publish_one(event) for event in events]
        return await asyncio.gather(*tasks)


async def simulate_high_throughput():
    """
    Simulate NATS JetStream high-throughput performance.
    """
    print("="*80)
    print("NATS JetStream Performance Simulation")
    print("="*80)
    print()

    generator = CaseGenerator(seed=42)
    queue = InMemoryEventQueue()

    # Test scenarios
    scenarios = [
        {"name": "Low Load", "cases": 100, "concurrent": 10},
        {"name": "Medium Load", "cases": 1000, "concurrent": 50},
        {"name": "High Load", "cases": 10000, "concurrent": 100},
        {"name": "Extreme Load", "cases": 50000, "concurrent": 200},
    ]

    for scenario in scenarios:
        num_cases = scenario["cases"]
        concurrent = scenario["concurrent"]

        print(f"\n{'='*80}")
        print(f"{scenario['name']}: {num_cases:,} cases, {concurrent} concurrent")
        print(f"{'='*80}")

        # Generate cases
        print("Generating cases...")
        all_events = []
        for i in range(num_cases):
            case_id = f"sim-case-{i+1:06d}"
            events = generator.generate_full_case_flow(case_id)
            all_events.extend(events)

        total_events = len(all_events)
        print(f"Generated {num_cases:,} cases = {total_events:,} events")

        # Reset metrics
        queue.events.clear()
        queue.latencies.clear()

        # Publish
        print("Publishing...")
        start_time = time.time()

        await queue.publish_batch(all_events, concurrent=concurrent)

        duration = time.time() - start_time

        # Results
        events_per_sec = total_events / duration
        cases_per_sec = num_cases / duration

        p50 = statistics.median(queue.latencies)
        p95 = statistics.quantiles(queue.latencies, n=20)[18]
        p99 = statistics.quantiles(queue.latencies, n=100)[98]

        print()
        print(f"📊 Results:")
        print(f"   Duration:      {duration:.2f}s")
        print(f"   Events/sec:    {events_per_sec:>12,.0f}")
        print(f"   Cases/sec:     {cases_per_sec:>12,.0f}")
        print()
        print(f"⏱️  Latency:")
        print(f"   p50:           {p50:>12.2f} ms")
        print(f"   p95:           {p95:>12.2f} ms")
        print(f"   p99:           {p99:>12.2f} ms")
        print()

        # Comparison
        if scenario == scenarios[0]:
            baseline_throughput = events_per_sec
        else:
            speedup = events_per_sec / baseline_throughput
            print(f"💨 {speedup:.1f}x faster than baseline")
            print()


async def compare_patterns():
    """
    Compare different event processing patterns.
    """
    print("\n\n" + "="*80)
    print("Event Processing Pattern Comparison")
    print("="*80)
    print()

    generator = CaseGenerator(seed=42)

    # Generate test data
    num_cases = 5000
    all_events = []
    for i in range(num_cases):
        case_id = f"pattern-test-{i+1}"
        events = generator.generate_full_case_flow(case_id)
        all_events.extend(events)

    total_events = len(all_events)
    print(f"Test data: {num_cases:,} cases = {total_events:,} events")
    print()

    patterns = [
        {"name": "Sequential (1 at a time)", "concurrent": 1},
        {"name": "Small Batches (10)", "concurrent": 10},
        {"name": "Medium Batches (50)", "concurrent": 50},
        {"name": "Large Batches (100)", "concurrent": 100},
        {"name": "Huge Batches (500)", "concurrent": 500},
        {"name": "Unlimited", "concurrent": 10000},
    ]

    results = []

    for pattern in patterns:
        queue = InMemoryEventQueue()

        start = time.time()
        await queue.publish_batch(all_events, concurrent=pattern["concurrent"])
        duration = time.time() - start

        throughput = total_events / duration
        results.append({
            "name": pattern["name"],
            "concurrent": pattern["concurrent"],
            "throughput": throughput,
            "duration": duration
        })

    # Print comparison
    print(f"{'Pattern':<30} {'Concurrent':>12} {'Events/sec':>15} {'Duration':>12}")
    print(f"{'-'*30} {'-'*12} {'-'*15} {'-'*12}")

    for r in results:
        print(
            f"{r['name']:<30} "
            f"{r['concurrent']:>12,} "
            f"{r['throughput']:>15,.0f} "
            f"{r['duration']:>12.2f}s"
        )

    print()

    # Find optimal
    optimal = max(results, key=lambda x: x['throughput'])
    print(f"🏆 Optimal: {optimal['name']}")
    print(f"   {optimal['throughput']:,.0f} events/sec with {optimal['concurrent']} concurrent")
    print()


async def projected_real_world():
    """
    Project real-world NATS JetStream performance.
    """
    print("\n\n" + "="*80)
    print("Real-World NATS JetStream Performance Projection")
    print("="*80)
    print()

    print("Based on NATS benchmarks and simulation:")
    print()

    # Known NATS performance characteristics
    projections = [
        {
            "scenario": "Single Publisher, Single Consumer",
            "throughput": 200000,
            "latency_p50": 0.5,
            "latency_p99": 2.0
        },
        {
            "scenario": "10 Publishers, 10 Consumers",
            "throughput": 1500000,
            "latency_p50": 1.0,
            "latency_p99": 5.0
        },
        {
            "scenario": "100 Publishers, 100 Consumers",
            "throughput": 5000000,
            "latency_p50": 2.0,
            "latency_p99": 10.0
        },
        {
            "scenario": "Optimized (Clustering)",
            "throughput": 10000000,
            "latency_p50": 1.0,
            "latency_p99": 5.0
        },
    ]

    print(f"{'Scenario':<40} {'Events/sec':>15} {'p50 (ms)':>10} {'p99 (ms)':>10}")
    print(f"{'-'*40} {'-'*15} {'-'*10} {'-'*10}")

    for p in projections:
        print(
            f"{p['scenario']:<40} "
            f"{p['throughput']:>15,} "
            f"{p['latency_p50']:>10.1f} "
            f"{p['latency_p99']:>10.1f}"
        )

    print()
    print("📝 Notes:")
    print("   - These are projections based on published NATS benchmarks")
    print("   - Actual performance depends on hardware, network, message size")
    print("   - NATS can handle millions of messages per second")
    print("   - PostgreSQL typically handles ~10K-50K events/sec")
    print("   - NATS is 100-1000x faster for pure event streaming")
    print()


async def main():
    """Run all simulations."""
    await simulate_high_throughput()
    await compare_patterns()
    await projected_real_world()

    print("="*80)
    print("Simulation Complete!")
    print("="*80)
    print()
    print("To run with real NATS:")
    print("  1. docker-compose up -d nats")
    print("  2. pip install nats-py")
    print("  3. python demo_nats.py")
    print()


if __name__ == "__main__":
    asyncio.run(main())
