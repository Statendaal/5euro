"""
FastAPI server for event system performance simulations.
Provides endpoints to run PostgreSQL and NATS JetStream simulations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, Dict, Any, List
import asyncio
import time
from datetime import datetime

# Import our event system components
import sys
sys.path.insert(0, '/Users/marc/Projecten/svb-cak/event-system')

from simulators.case_generator import CaseGenerator
from postgres.event_store import PostgresEventStore
from postgres.publisher import PostgresEventPublisher

app = FastAPI(
    title="Event System Simulation API",
    description="Performance benchmarking for PostgreSQL and NATS JetStream event processing",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    """Request model for event simulation"""
    system: Literal["postgres", "nats"] = Field(
        ...,
        description="System to test: postgres or nats"
    )
    num_cases: int = Field(
        ...,
        gt=0,
        le=10000,
        description="Number of cases to simulate (1-10000)"
    )
    concurrent: int = Field(
        default=10,
        gt=0,
        le=200,
        description="Concurrent processing limit (1-200)"
    )


class SimulationResponse(BaseModel):
    """Response model for simulation results"""
    system: str
    num_cases: int
    num_events: int
    duration_seconds: float
    events_per_second: float
    cases_per_second: float
    latency_p50_ms: float
    latency_p95_ms: float
    latency_p99_ms: float
    timestamp: str
    metadata: Dict[str, Any]


@app.get("/")
def root():
    """API status and info"""
    return {
        "service": "Event System Simulation API",
        "version": "1.0.0",
        "status": "online",
        "systems": ["postgres", "nats"],
        "max_cases": 10000,
        "endpoints": {
            "/simulate": "Run a simulation",
            "/health": "Health check"
        }
    }


@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Run an event processing simulation.

    - **system**: postgres or nats
    - **num_cases**: Number of cases to process (1-10000)
    - **concurrent**: Concurrent processing limit (1-200)
    """
    try:
        if request.system == "postgres":
            return await simulate_postgres(request.num_cases, request.concurrent)
        elif request.system == "nats":
            return await simulate_nats(request.num_cases, request.concurrent)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown system: {request.system}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        )


async def simulate_postgres(num_cases: int, concurrent: int) -> SimulationResponse:
    """Run PostgreSQL event sourcing simulation"""
    start_time = time.time()
    latencies = []

    # Initialize
    generator = CaseGenerator()
    connection_string = "dbname=schulden user=postgres password=postgres host=localhost"
    publisher = PostgresEventPublisher(connection_string)

    # Generate cases
    cases = [generator.generate_full_case_flow(f"sim-{i:06d}") for i in range(num_cases)]
    total_events = sum(len(case) for case in cases)

    # Process cases with concurrency control
    semaphore = asyncio.Semaphore(concurrent)

    async def process_case(case_id, case_events):
        async with semaphore:
            case_start = time.time()
            for event in case_events:
                publisher.publish(
                    stream_id=case_id,
                    stream_type="case",
                    event=event
                )
            case_duration = (time.time() - case_start) * 1000  # ms
            latencies.append(case_duration)

    # Process all cases
    await asyncio.gather(*[process_case(f"sim-{i:06d}", case) for i, case in enumerate(cases)])

    # Calculate metrics
    duration = time.time() - start_time
    events_per_sec = total_events / duration if duration > 0 else 0
    cases_per_sec = num_cases / duration if duration > 0 else 0

    # Calculate latency percentiles
    latencies.sort()
    p50 = latencies[int(len(latencies) * 0.50)] if latencies else 0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0

    # Close connections
    publisher.close()

    return SimulationResponse(
        system="postgresql",
        num_cases=num_cases,
        num_events=total_events,
        duration_seconds=round(duration, 3),
        events_per_second=round(events_per_sec, 1),
        cases_per_second=round(cases_per_sec, 1),
        latency_p50_ms=round(p50, 2),
        latency_p95_ms=round(p95, 2),
        latency_p99_ms=round(p99, 2),
        timestamp=datetime.now().isoformat(),
        metadata={
            "concurrent_limit": concurrent,
            "avg_events_per_case": round(total_events / num_cases, 1),
            "database": "PostgreSQL 18"
        }
    )


async def simulate_nats(num_cases: int, concurrent: int) -> SimulationResponse:
    """
    Run NATS JetStream simulation (in-memory projection).
    This simulates NATS performance based on published benchmarks.
    """
    start_time = time.time()

    # Generate cases
    generator = CaseGenerator()
    cases = [generator.generate_full_case_flow(f"sim-{i:06d}") for i in range(num_cases)]
    total_events = sum(len(case) for case in cases)

    # Simulate NATS processing with realistic timing
    # NATS can handle 200K-1M+ events/sec depending on configuration
    # We simulate based on concurrent workers
    base_throughput = 200000  # events/sec for single publisher
    concurrent_multiplier = min(concurrent / 10, 5.0)  # scales up to 5x with more workers
    effective_throughput = base_throughput * concurrent_multiplier

    # Simulate processing time
    estimated_duration = total_events / effective_throughput

    # Add small overhead for case generation and coordination
    overhead = 0.01 * num_cases / 1000  # 10ms per 1000 cases
    simulated_duration = estimated_duration + overhead

    # Simulate realistic latencies based on NATS benchmarks
    # NATS has very low latency (sub-millisecond to few ms)
    latency_base = 0.5  # 0.5ms base latency
    latency_per_event = 0.001 * (total_events / num_cases)  # increases with batch size

    p50_latency = latency_base + latency_per_event * 0.8
    p95_latency = latency_base + latency_per_event * 1.5
    p99_latency = latency_base + latency_per_event * 2.0

    # Actually wait for the simulated duration (scaled down for demo)
    await asyncio.sleep(min(simulated_duration, 5.0))  # cap at 5s for demo

    actual_duration = time.time() - start_time
    events_per_sec = total_events / actual_duration if actual_duration > 0 else 0
    cases_per_sec = num_cases / actual_duration if actual_duration > 0 else 0

    return SimulationResponse(
        system="nats_jetstream",
        num_cases=num_cases,
        num_events=total_events,
        duration_seconds=round(actual_duration, 3),
        events_per_second=round(events_per_sec, 1),
        cases_per_second=round(cases_per_sec, 1),
        latency_p50_ms=round(p50_latency, 2),
        latency_p95_ms=round(p95_latency, 2),
        latency_p99_ms=round(p99_latency, 2),
        timestamp=datetime.now().isoformat(),
        metadata={
            "concurrent_limit": concurrent,
            "avg_events_per_case": round(total_events / num_cases, 1),
            "simulation_mode": "projection",
            "note": "Simulated based on NATS benchmarks (200K-1M+ events/sec)"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
