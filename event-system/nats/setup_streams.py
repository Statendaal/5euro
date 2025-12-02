"""
Setup NATS JetStream streams for case processing.
"""
import asyncio
import logging
from nats.aio.client import Client as NATS
from nats.js import JetStreamContext
from nats.js.api import StreamConfig, RetentionPolicy, StorageType, ConsumerConfig, AckPolicy

logger = logging.getLogger(__name__)


async def setup_jetstream_streams(nats_url: str = "nats://localhost:4222"):
    """
    Setup JetStream streams for case events.

    Streams:
    - CASES_INTAKE - Case intake events
    - CASES_ANALYSIS - Case analysis events
    - CASES_DECISION - Case decision events
    - CASES_ACTIONS - Payment plans, forgiveness, etc.
    - CASES_COMPLETION - Case completion events
    - CASES_ALL - All case events (catch-all)
    """
    nc = NATS()

    try:
        await nc.connect(nats_url)
        js = nc.jetstream()

        logger.info("Setting up JetStream streams...")

        # Stream configurations
        streams = [
            {
                "name": "CASES_INTAKE",
                "subjects": ["cases.intake"],
                "description": "Case intake events",
                "max_age": 30 * 24 * 60 * 60 * 1000000000,  # 30 days in nanoseconds
                "max_msgs": 1000000,
                "max_bytes": 1024 * 1024 * 1024,  # 1GB
            },
            {
                "name": "CASES_ANALYSIS",
                "subjects": ["cases.analysis"],
                "description": "Case analysis events",
                "max_age": 30 * 24 * 60 * 60 * 1000000000,
                "max_msgs": 1000000,
                "max_bytes": 1024 * 1024 * 1024,
            },
            {
                "name": "CASES_DECISION",
                "subjects": ["cases.decision"],
                "description": "Case decision events",
                "max_age": 30 * 24 * 60 * 60 * 1000000000,
                "max_msgs": 1000000,
                "max_bytes": 1024 * 1024 * 1024,
            },
            {
                "name": "CASES_ACTIONS",
                "subjects": ["cases.payment_plan", "cases.forgiven"],
                "description": "Case action events",
                "max_age": 30 * 24 * 60 * 60 * 1000000000,
                "max_msgs": 1000000,
                "max_bytes": 1024 * 1024 * 1024,
            },
            {
                "name": "CASES_COMPLETION",
                "subjects": ["cases.completed"],
                "description": "Case completion events",
                "max_age": 90 * 24 * 60 * 60 * 1000000000,  # 90 days
                "max_msgs": 1000000,
                "max_bytes": 2 * 1024 * 1024 * 1024,  # 2GB
            },
            {
                "name": "CASES_ALL",
                "subjects": ["cases.>"],  # Wildcard for all case events
                "description": "All case events (aggregated)",
                "max_age": 365 * 24 * 60 * 60 * 1000000000,  # 1 year
                "max_msgs": 10000000,
                "max_bytes": 10 * 1024 * 1024 * 1024,  # 10GB
                "retention": RetentionPolicy.INTEREST,  # Keep while consumers interested
            },
        ]

        for stream_def in streams:
            stream_name = stream_def["name"]

            try:
                # Try to get existing stream
                stream_info = await js.stream_info(stream_name)
                logger.info(f"Stream {stream_name} already exists: {stream_info.config.subjects}")

            except Exception:
                # Stream doesn't exist, create it
                config = StreamConfig(
                    name=stream_name,
                    subjects=stream_def["subjects"],
                    description=stream_def.get("description", ""),
                    max_age=stream_def.get("max_age", 0),
                    max_msgs=stream_def.get("max_msgs", -1),
                    max_bytes=stream_def.get("max_bytes", -1),
                    retention=stream_def.get("retention", RetentionPolicy.LIMITS),
                    storage=StorageType.FILE,
                    num_replicas=1,
                )

                await js.add_stream(config)
                logger.info(f"✅ Created stream: {stream_name} with subjects {stream_def['subjects']}")

        # Create consumers for each stream
        consumers = [
            {
                "stream": "CASES_INTAKE",
                "name": "intake-processor",
                "description": "Processes intake events",
                "ack_policy": AckPolicy.EXPLICIT,
                "max_deliver": 3,
            },
            {
                "stream": "CASES_ANALYSIS",
                "name": "analysis-processor",
                "description": "Processes analysis events",
                "ack_policy": AckPolicy.EXPLICIT,
                "max_deliver": 3,
            },
            {
                "stream": "CASES_DECISION",
                "name": "decision-processor",
                "description": "Processes decision events",
                "ack_policy": AckPolicy.EXPLICIT,
                "max_deliver": 3,
            },
            {
                "stream": "CASES_ALL",
                "name": "metrics-collector",
                "description": "Collects metrics from all events",
                "ack_policy": AckPolicy.EXPLICIT,
                "max_deliver": 5,
            },
        ]

        for consumer_def in consumers:
            stream_name = consumer_def["stream"]
            consumer_name = consumer_def["name"]

            try:
                config = ConsumerConfig(
                    durable_name=consumer_name,
                    description=consumer_def.get("description", ""),
                    ack_policy=consumer_def.get("ack_policy", AckPolicy.EXPLICIT),
                    max_deliver=consumer_def.get("max_deliver", 3),
                    ack_wait=30 * 1000000000,  # 30 seconds in nanoseconds
                )

                await js.add_consumer(stream_name, config)
                logger.info(f"✅ Created consumer: {consumer_name} on stream {stream_name}")

            except Exception as e:
                if "already exists" in str(e).lower():
                    logger.info(f"Consumer {consumer_name} already exists on {stream_name}")
                else:
                    logger.error(f"Failed to create consumer {consumer_name}: {e}")

        logger.info("✅ JetStream setup complete!")

        # Print summary
        print("\n" + "="*80)
        print("NATS JetStream Streams Setup Complete")
        print("="*80)
        print(f"\nStreams created: {len(streams)}")
        for s in streams:
            print(f"  - {s['name']}: {s['subjects']}")

        print(f"\nConsumers created: {len(consumers)}")
        for c in consumers:
            print(f"  - {c['name']} on {c['stream']}")

        print("\nMonitoring:")
        print("  - NATS monitoring: http://localhost:8222")
        print("  - Metrics: http://localhost:7777/metrics")
        print("  - Prometheus: http://localhost:9090")
        print("  - Grafana: http://localhost:3000 (admin/admin)")
        print()

    finally:
        await nc.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(setup_jetstream_streams())
