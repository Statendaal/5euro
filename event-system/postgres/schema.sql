-- Event Store Schema for PostgreSQL 18
-- Drop existing tables
DROP TABLE IF EXISTS event_subscriptions CASCADE;
DROP TABLE IF EXISTS event_outbox CASCADE;
DROP TABLE IF EXISTS event_snapshots CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_streams CASCADE;

-- Event Streams table (aggregate root)
CREATE TABLE event_streams (
    stream_id VARCHAR(255) PRIMARY KEY,
    stream_type VARCHAR(100) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_event_streams_type ON event_streams(stream_type);

-- Events table (event store)
CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id VARCHAR(255) NOT NULL REFERENCES event_streams(stream_id),
    event_number BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    event_metadata JSONB DEFAULT '{}'::jsonb,
    correlation_id UUID,
    causation_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_stream_event_number UNIQUE (stream_id, event_number)
);

CREATE INDEX idx_events_stream_id ON events(stream_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_correlation_id ON events(correlation_id) WHERE correlation_id IS NOT NULL;
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_event_data ON events USING GIN (event_data);

-- Optimized index for event replay
CREATE INDEX idx_events_stream_replay ON events(stream_id, event_number);

-- Event Outbox for transactional publishing
CREATE TABLE event_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    published_at TIMESTAMP,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_error TEXT
);

CREATE INDEX idx_outbox_processed ON event_outbox(processed_at) WHERE processed_at IS NULL;
CREATE INDEX idx_outbox_published ON event_outbox(published_at) WHERE published_at IS NULL;

-- Event Subscriptions (consumer tracking)
CREATE TABLE event_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    subscription_name VARCHAR(255) NOT NULL UNIQUE,
    consumer_group VARCHAR(255) NOT NULL,
    stream_id VARCHAR(255),
    event_type VARCHAR(100),
    last_processed_event_id UUID,
    last_processed_at TIMESTAMP,
    last_checkpoint_position BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, paused, stopped
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_subscriptions_status ON event_subscriptions(status);
CREATE INDEX idx_subscriptions_stream ON event_subscriptions(stream_id);

-- Event Snapshots (for performance optimization)
CREATE TABLE event_snapshots (
    stream_id VARCHAR(255) PRIMARY KEY REFERENCES event_streams(stream_id),
    snapshot_version BIGINT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Functions & Triggers
-- ============================================================================

-- Function to update stream version
CREATE OR REPLACE FUNCTION update_stream_version()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE event_streams
    SET version = NEW.event_number,
        updated_at = CURRENT_TIMESTAMP
    WHERE stream_id = NEW.stream_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stream_version
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION update_stream_version();

-- Function to append event (with optimistic concurrency control)
CREATE OR REPLACE FUNCTION append_event(
    p_stream_id VARCHAR(255),
    p_stream_type VARCHAR(100),
    p_expected_version BIGINT,
    p_event_type VARCHAR(100),
    p_event_data JSONB,
    p_event_metadata JSONB DEFAULT '{}'::jsonb,
    p_correlation_id UUID DEFAULT NULL,
    p_causation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_event_id UUID;
    v_current_version BIGINT;
    v_next_version BIGINT;
BEGIN
    -- Ensure stream exists
    INSERT INTO event_streams (stream_id, stream_type, version)
    VALUES (p_stream_id, p_stream_type, 0)
    ON CONFLICT (stream_id) DO NOTHING;

    -- Get current version
    SELECT version INTO v_current_version
    FROM event_streams
    WHERE stream_id = p_stream_id
    FOR UPDATE;

    -- Check optimistic concurrency
    IF p_expected_version IS NOT NULL AND v_current_version != p_expected_version THEN
        RAISE EXCEPTION 'Concurrency conflict: expected version %, got %',
            p_expected_version, v_current_version;
    END IF;

    -- Calculate next version
    v_next_version := v_current_version + 1;

    -- Insert event
    INSERT INTO events (
        stream_id, event_number, event_type, event_data, event_metadata,
        correlation_id, causation_id
    )
    VALUES (
        p_stream_id, v_next_version, p_event_type, p_event_data, p_event_metadata,
        p_correlation_id, p_causation_id
    )
    RETURNING event_id INTO v_event_id;

    RETURN v_event_id;
END;
$$;

-- Function to read events from stream
CREATE OR REPLACE FUNCTION read_stream(
    p_stream_id VARCHAR(255),
    p_from_version BIGINT DEFAULT 0,
    p_max_count INT DEFAULT 1000
)
RETURNS TABLE (
    event_id UUID,
    event_number BIGINT,
    event_type VARCHAR(100),
    event_data JSONB,
    event_metadata JSONB,
    correlation_id UUID,
    causation_id UUID,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.event_id,
        e.event_number,
        e.event_type,
        e.event_data,
        e.event_metadata,
        e.correlation_id,
        e.causation_id,
        e.created_at
    FROM events e
    WHERE e.stream_id = p_stream_id
        AND e.event_number > p_from_version
    ORDER BY e.event_number
    LIMIT p_max_count;
END;
$$;

-- Function to read all events (for projections)
CREATE OR REPLACE FUNCTION read_all_events(
    p_from_position BIGINT DEFAULT 0,
    p_max_count INT DEFAULT 1000,
    p_event_types VARCHAR(100)[] DEFAULT NULL
)
RETURNS TABLE (
    event_id UUID,
    stream_id VARCHAR(255),
    event_number BIGINT,
    event_type VARCHAR(100),
    event_data JSONB,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.event_id,
        e.stream_id,
        e.event_number,
        e.event_type,
        e.event_data,
        e.created_at
    FROM events e
    INNER JOIN event_streams s ON e.stream_id = s.stream_id
    WHERE e.event_id::text > p_from_position::text
        AND (p_event_types IS NULL OR e.event_type = ANY(p_event_types))
    ORDER BY e.created_at, e.event_id
    LIMIT p_max_count;
END;
$$;

-- ============================================================================
-- Views for Monitoring
-- ============================================================================

-- Event statistics per type
CREATE OR REPLACE VIEW v_event_stats AS
SELECT
    event_type,
    COUNT(*) as total_events,
    COUNT(DISTINCT stream_id) as unique_streams,
    MIN(created_at) as first_event,
    MAX(created_at) as last_event,
    AVG(pg_column_size(event_data)) as avg_event_size_bytes
FROM events
GROUP BY event_type
ORDER BY total_events DESC;

-- Stream health
CREATE OR REPLACE VIEW v_stream_health AS
SELECT
    s.stream_id,
    s.stream_type,
    s.version as event_count,
    s.updated_at as last_event_at,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - s.updated_at)) as seconds_since_last_event,
    (SELECT COUNT(*) FROM events e WHERE e.stream_id = s.stream_id) as actual_event_count
FROM event_streams s
ORDER BY s.updated_at DESC;

-- Subscription lag
CREATE OR REPLACE VIEW v_subscription_lag AS
SELECT
    sub.subscription_name,
    sub.consumer_group,
    sub.last_checkpoint_position,
    COALESCE(
        (SELECT MAX(event_number) FROM events WHERE stream_id = sub.stream_id),
        0
    ) as latest_event_number,
    COALESCE(
        (SELECT MAX(event_number) FROM events WHERE stream_id = sub.stream_id),
        0
    ) - sub.last_checkpoint_position as lag,
    sub.last_processed_at,
    sub.status
FROM event_subscriptions sub;

-- Outbox pending events
CREATE OR REPLACE VIEW v_outbox_pending AS
SELECT
    id,
    event_type,
    created_at,
    retry_count,
    last_error,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) as age_seconds
FROM event_outbox
WHERE published_at IS NULL
ORDER BY created_at;

-- ============================================================================
-- Sample Data
-- ============================================================================

COMMENT ON TABLE events IS 'Event store - immutable event log';
COMMENT ON TABLE event_streams IS 'Event streams - aggregate root';
COMMENT ON TABLE event_outbox IS 'Transactional outbox pattern for reliable event publishing';
COMMENT ON TABLE event_subscriptions IS 'Consumer subscriptions and checkpoints';
COMMENT ON TABLE event_snapshots IS 'Event stream snapshots for performance optimization';

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT ON events TO event_writer;
-- GRANT SELECT ON events TO event_reader;
