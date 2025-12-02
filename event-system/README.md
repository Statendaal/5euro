# Event-Based Case Processing System

Event-gedreven systeem voor het simuleren en verwerken van schuldhulp casussen met twee implementaties:
1. **PostgreSQL 18** - Database-gebaseerde event store
2. **NATS JetStream** - Message streaming platform

## Architectuur

```
┌─────────────────────────────────────────────────────────────┐
│                    Case Simulator                            │
│  Genereert realistische schuldhulp cases op basis van CBS   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │    Event Producer     │
         │  - PublishCase        │
         │  - PublishAnalysis    │
         │  - PublishDecision    │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────────┐
│  PostgreSQL   │         │  NATS JetStream  │
│  Event Store  │         │  Event Streams   │
├───────────────┤         ├──────────────────┤
│ events        │         │ cases.intake     │
│ event_log     │         │ cases.analysis   │
│ subscriptions │         │ cases.decision   │
└───────┬───────┘         └────────┬─────────┘
        │                          │
        └────────────┬─────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Event Consumers     │
         │  - IntakeProcessor    │
         │  - AnalysisProcessor  │
         │  - DecisionProcessor  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Business Logic      │
         │  - ML Model           │
         │  - Rules Engine       │
         │  - Workflow           │
         └───────────────────────┘
```

## Event Types

### 1. CaseIntakeEvent
Nieuwe schuldhulp case is binnengekomen

```json
{
  "event_id": "uuid",
  "event_type": "case.intake",
  "timestamp": "2025-11-09T10:30:00Z",
  "data": {
    "case_id": "uuid",
    "citizen_bsn": "123456789",
    "debt_amount": 1250.50,
    "debt_type": "cak_eigen_bijdrage",
    "organization": "CAK",
    "intake_channel": "online|phone|walk_in",
    "priority": "low|normal|high|urgent"
  }
}
```

### 2. CaseAnalysisEvent
Case is geanalyseerd door ML model

```json
{
  "event_id": "uuid",
  "event_type": "case.analysis",
  "timestamp": "2025-11-09T10:31:00Z",
  "correlation_id": "case_id",
  "data": {
    "case_id": "uuid",
    "risk_score": 75,
    "success_probability": 0.65,
    "recommended_action": "payment_plan",
    "estimated_savings": 5200.00,
    "analysis_confidence": 0.92
  }
}
```

### 3. CaseDecisionEvent
Beslissing genomen over case

```json
{
  "event_id": "uuid",
  "event_type": "case.decision",
  "timestamp": "2025-11-09T10:32:00Z",
  "correlation_id": "case_id",
  "data": {
    "case_id": "uuid",
    "decision": "forgive|payment_plan|collect|refer_assistance",
    "decided_by": "system|caseworker_id",
    "reason": "text",
    "next_steps": ["action1", "action2"]
  }
}
```

### 4. CaseCompletedEvent
Case is afgerond

```json
{
  "event_id": "uuid",
  "event_type": "case.completed",
  "timestamp": "2025-11-09T11:00:00Z",
  "correlation_id": "case_id",
  "data": {
    "case_id": "uuid",
    "outcome": "resolved|withdrawn|escalated",
    "duration_seconds": 1800,
    "total_savings": 5200.00
  }
}
```

## Directory Structure

```
event-system/
├── README.md                  # This file
├── requirements.txt           # Python dependencies
├── docker-compose.yml         # NATS server + monitoring
├── shared/                    # Shared code
│   ├── __init__.py
│   ├── events.py             # Event models (Pydantic)
│   ├── metrics.py            # Prometheus metrics
│   └── config.py             # Configuration
├── postgres/                  # PostgreSQL implementation
│   ├── __init__.py
│   ├── schema.sql            # Event store schema
│   ├── event_store.py        # Event store implementation
│   ├── publisher.py          # Event publisher
│   ├── consumer.py           # Event consumer
│   └── outbox.py             # Transactional outbox pattern
├── nats/                      # NATS JetStream implementation
│   ├── __init__.py
│   ├── setup_streams.py      # Stream configuration
│   ├── publisher.py          # Event publisher
│   └── consumer.py           # Event consumer
├── simulators/                # Case simulators
│   ├── __init__.py
│   ├── case_generator.py     # Generate realistic cases
│   ├── load_tester.py        # Performance testing
│   └── chaos.py              # Chaos testing
└── examples/                  # Example usage
    ├── postgres_demo.py
    ├── nats_demo.py
    └── comparison.py
```

## Features

### PostgreSQL Event Store
- ✅ ACID transactions
- ✅ Event versioning
- ✅ Optimistic concurrency control
- ✅ Event sourcing pattern
- ✅ Transactional outbox pattern
- ✅ Point-in-time recovery
- ✅ Built-in audit trail

### NATS JetStream
- ✅ High throughput (millions/sec)
- ✅ At-least-once delivery
- ✅ Stream persistence
- ✅ Consumer groups
- ✅ Message replay
- ✅ Geographic distribution
- ✅ Lightweight & fast

## Performance Comparison

| Metric | PostgreSQL | NATS JetStream |
|--------|-----------|----------------|
| Throughput | ~10K events/sec | ~1M events/sec |
| Latency (p99) | ~50ms | ~5ms |
| Storage | Relational DB | Log-based |
| Queries | SQL (complex) | Key-value (simple) |
| Transactions | Full ACID | At-least-once |
| Scaling | Vertical | Horizontal |

## Use Cases

### PostgreSQL Best For:
- Complex queries over event history
- Regulatory compliance (audit trail)
- Strong consistency requirements
- Integration with existing PostgreSQL infrastructure
- Event sourcing + CQRS

### NATS Best For:
- High throughput scenarios
- Real-time processing
- Microservices communication
- Geographic distribution
- IoT/sensor data

## Installation

### Prerequisites
```bash
# PostgreSQL 18 already installed
brew services start postgresql@18

# Install NATS server
brew install nats-server

# Python 3.13+ with venv
python3 -m venv venv
source venv/bin/activate
```

### Dependencies
```bash
pip install -r requirements.txt
```

### Setup PostgreSQL
```bash
psql -d schulden -f postgres/schema.sql
```

### Setup NATS JetStream
```bash
# Start NATS server with JetStream
nats-server -js

# Configure streams
python nats/setup_streams.py
```

## Quick Start

### PostgreSQL Example
```python
from postgres.publisher import PostgresEventPublisher
from shared.events import CaseIntakeEvent

# Create publisher
publisher = PostgresEventPublisher("postgresql://localhost/schulden")

# Publish event
event = CaseIntakeEvent(
    case_id="123",
    citizen_bsn="987654321",
    debt_amount=500.00,
    debt_type="parkeerboete"
)

publisher.publish(event)
```

### NATS Example
```python
from nats.publisher import NatsEventPublisher
from shared.events import CaseIntakeEvent

# Create publisher
publisher = await NatsEventPublisher.create("nats://localhost:4222")

# Publish event
event = CaseIntakeEvent(
    case_id="123",
    citizen_bsn="987654321",
    debt_amount=500.00,
    debt_type="parkeerboete"
)

await publisher.publish(event)
```

## Simulation

### Generate Test Cases
```bash
# Generate 1000 cases with PostgreSQL
python simulators/case_generator.py --backend postgres --count 1000

# Generate 10000 cases with NATS
python simulators/case_generator.py --backend nats --count 10000
```

### Load Testing
```bash
# Test PostgreSQL throughput
python simulators/load_tester.py --backend postgres --rate 100/sec --duration 60s

# Test NATS throughput
python simulators/load_tester.py --backend nats --rate 10000/sec --duration 60s
```

### Chaos Testing
```bash
# Introduce random failures
python simulators/chaos.py --backend both --scenario network_partition
```

## Monitoring

### Metrics (Prometheus)
```
# Events published
event_published_total{backend="postgres|nats", event_type="case.intake"}

# Events processed
event_processed_total{backend="postgres|nats", event_type="case.intake", status="success|failed"}

# Processing latency
event_processing_duration_seconds{backend="postgres|nats", event_type="case.intake"}

# Queue depth
event_queue_depth{backend="postgres|nats"}
```

### Dashboard
Access Grafana dashboard at http://localhost:3000

## Event Patterns Implemented

1. **Event Sourcing** - Complete event history as source of truth
2. **CQRS** - Separate read/write models
3. **Saga Pattern** - Long-running business transactions
4. **Outbox Pattern** - Reliable event publishing (PostgreSQL)
5. **Competing Consumers** - Parallel event processing
6. **Event Replay** - Reprocess historical events
7. **Dead Letter Queue** - Handle failed events

## Testing

```bash
# Run unit tests
pytest tests/

# Run integration tests
pytest tests/integration/

# Run performance tests
pytest tests/performance/ --benchmark
```

## Next Steps

1. Add event versioning & schema evolution
2. Implement event replay UI
3. Add OpenTelemetry distributed tracing
4. Create Kubernetes deployment
5. Add event-driven workflows (Temporal/Cadence)
6. Implement CDC (Change Data Capture) for PostgreSQL
