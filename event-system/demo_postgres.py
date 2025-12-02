#!/usr/bin/env python3
"""
PostgreSQL Event System Demo

Demonstrates:
- Event sourcing with PostgreSQL 18
- Case generation and processing
- Event store operations
- Statistics and monitoring
"""
import logging
import sys
import time
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, '.')

from postgres.event_store import PostgresEventStore
from postgres.publisher import PostgresEventPublisher
from simulators.case_generator import CaseGenerator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Run PostgreSQL event system demo."""

    print("=" * 80)
    print("PostgreSQL 18 Event System Demo")
    print("=" * 80)
    print()

    # Connection string
    connection_string = "postgresql://marc@localhost/schulden"

    # Initialize components
    print("🔧 Initializing event store...")
    event_store = PostgresEventStore(connection_string)
    publisher = PostgresEventPublisher(connection_string)
    generator = CaseGenerator(seed=42)

    print("✅ Event store initialized")
    print()

    # Generate and publish cases
    num_cases = 10
    print(f"📝 Generating {num_cases} realistic cases...")
    print()

    start_time = time.time()
    published_cases = []

    for i in range(num_cases):
        case_id = f"demo-case-{i+1:03d}"

        # Generate full case flow
        events = generator.generate_full_case_flow(case_id)

        print(f"Case {i+1}/{num_cases}: {case_id}")
        print(f"  Events: {len(events)}")

        # Publish all events to event store
        for event in events:
            event_id = publisher.publish(
                stream_id=case_id,
                stream_type="case",
                event=event,
                use_outbox=True
            )

            print(f"    ✓ {event.event_type}")

        published_cases.append({
            'case_id': case_id,
            'events': events
        })

        print()

    elapsed = time.time() - start_time
    print(f"✅ Published {num_cases} cases in {elapsed:.2f}s")
    print(f"   Throughput: {num_cases/elapsed:.1f} cases/sec")
    print()

    # Demonstrate reading events
    print("📖 Reading events from stream...")
    print()

    sample_case = published_cases[0]
    case_id = sample_case['case_id']

    events = event_store.read_stream(case_id)

    print(f"Stream: {case_id}")
    print(f"Events: {len(events)}")
    print()

    for i, event in enumerate(events, 1):
        print(f"  {i}. {event.event_type}")
        print(f"     Timestamp: {event.timestamp}")
        if hasattr(event.data, 'case_id'):
            print(f"     Case ID: {event.data.case_id}")
    print()

    # Get stream version
    version = event_store.get_stream_version(case_id)
    print(f"Stream version: {version}")
    print()

    # Read all events (for projections)
    print("📊 Reading all events (projection example)...")
    all_events = event_store.read_all_events(max_count=50)

    event_types = {}
    for event_dict in all_events:
        event_type = event_dict['event_type']
        event_types[event_type] = event_types.get(event_type, 0) + 1

    print(f"Total events: {len(all_events)}")
    print("Event type distribution:")
    for event_type, count in sorted(event_types.items()):
        print(f"  {event_type}: {count}")
    print()

    # Get statistics
    print("📈 Event Store Statistics:")
    print()

    stats = event_store.get_statistics()

    print(f"Total events: {stats['total_events']}")
    print(f"Total streams: {stats['total_streams']}")
    print()

    print("Events by type:")
    for event_stat in stats['events_by_type'][:5]:
        print(f"  {event_stat['event_type']}: {event_stat['total_events']} events")
    print()

    print("Recent streams:")
    for stream in stats['recent_streams'][:5]:
        print(f"  {stream['stream_id']}: {stream['event_count']} events, "
              f"last event {stream['seconds_since_last_event']:.0f}s ago")
    print()

    # Demonstrate snapshot
    print("💾 Creating snapshot...")
    snapshot_data = {
        'case_status': 'completed',
        'total_events': len(events),
        'last_action': events[-1].event_type if events else None,
        'snapshot_time': datetime.utcnow().isoformat()
    }

    event_store.create_snapshot(case_id, version, snapshot_data)
    print(f"✅ Snapshot created for {case_id} at version {version}")
    print()

    # Retrieve snapshot
    snapshot = event_store.get_snapshot(case_id)
    if snapshot:
        print(f"Retrieved snapshot:")
        print(f"  Version: {snapshot['version']}")
        print(f"  Data: {snapshot['data']}")
    print()

    # Demonstrate event replay
    print("🔄 Event Replay Example:")
    print(f"Reading events from version 0 to {version}...")
    print()

    replay_events = event_store.read_stream(case_id, from_version=0)

    # Rebuild state from events
    case_state = {
        'status': 'new',
        'events_processed': 0
    }

    for event in replay_events:
        case_state['events_processed'] += 1

        if event.event_type == 'case.intake':
            case_state['status'] = 'intake'
            case_state['debt_amount'] = event.data.debt_amount
        elif event.event_type == 'case.analysis':
            case_state['status'] = 'analyzed'
            case_state['risk_score'] = event.data.risk_score
        elif event.event_type == 'case.decision':
            case_state['status'] = 'decided'
            case_state['decision'] = event.data.decision
        elif event.event_type == 'case.completed':
            case_state['status'] = 'completed'
            case_state['outcome'] = event.data.outcome

    print("Rebuilt case state from events:")
    for key, value in case_state.items():
        print(f"  {key}: {value}")
    print()

    # Performance metrics
    print("⚡ Performance Summary:")
    print(f"  Cases processed: {num_cases}")
    print(f"  Total events: {stats['total_events']}")
    print(f"  Processing time: {elapsed:.2f}s")
    print(f"  Events/second: {stats['total_events']/elapsed:.1f}")
    print()

    # Cleanup
    print("🧹 Cleaning up...")
    event_store.close()
    publisher.close()
    print("✅ Done!")
    print()

    print("=" * 80)
    print("Demo completed successfully! 🎉")
    print("=" * 80)
    print()
    print("Next steps:")
    print("  - Check PostgreSQL: psql -d schulden")
    print("  - View events: SELECT * FROM events LIMIT 10;")
    print("  - View statistics: SELECT * FROM v_event_stats;")
    print("  - View streams: SELECT * FROM v_stream_health;")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nDemo interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Demo failed: {e}", exc_info=True)
        sys.exit(1)
