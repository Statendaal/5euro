"""
PostgreSQL Event Store implementation.
"""
import json
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from contextlib import contextmanager

from shared.events import BaseEvent, deserialize_event, serialize_event

logger = logging.getLogger(__name__)


class ConcurrencyError(Exception):
    """Raised when optimistic concurrency check fails."""
    pass


class PostgresEventStore:
    """
    Event Store implementation using PostgreSQL 18.

    Features:
    - Event sourcing pattern
    - Optimistic concurrency control
    - Transactional outbox pattern
    - Event snapshots
    """

    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._init_connection_pool()

    def _init_connection_pool(self):
        """Initialize connection pool."""
        # For production, use psycopg2.pool.ThreadedConnectionPool
        self.conn = psycopg2.connect(self.connection_string)

    @contextmanager
    def transaction(self):
        """Context manager for database transactions."""
        try:
            yield self.conn
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Transaction failed: {e}")
            raise

    def append_event(
        self,
        stream_id: str,
        stream_type: str,
        event: BaseEvent,
        expected_version: Optional[int] = None
    ) -> str:
        """
        Append event to stream with optimistic concurrency control.

        Args:
            stream_id: Unique identifier for the event stream
            stream_type: Type of stream (e.g., "case", "payment")
            event: Event to append
            expected_version: Expected current version (for concurrency control)

        Returns:
            event_id: UUID of the appended event

        Raises:
            ConcurrencyError: If expected_version doesn't match current version
        """
        with self.transaction():
            cursor = self.conn.cursor()

            try:
                event_data = serialize_event(event)

                # Convert correlation_id and causation_id to UUID or None
                correlation_uuid = None
                if event.correlation_id:
                    try:
                        from uuid import UUID
                        # Try to parse as UUID, if fails keep as None
                        correlation_uuid = str(UUID(event.correlation_id)) if '-' in event.correlation_id else None
                    except:
                        correlation_uuid = None

                causation_uuid = None
                if event.causation_id:
                    try:
                        from uuid import UUID
                        causation_uuid = str(UUID(event.causation_id)) if '-' in event.causation_id else None
                    except:
                        causation_uuid = None

                cursor.execute(
                    """
                    SELECT append_event(
                        %s, %s, %s, %s, %s, %s, %s, %s
                    )
                    """,
                    (
                        stream_id,
                        stream_type,
                        expected_version,
                        event.event_type,
                        Json(event_data),
                        Json(event.metadata),
                        correlation_uuid,
                        causation_uuid
                    )
                )

                event_id = cursor.fetchone()[0]
                logger.info(
                    f"Appended event {event.event_type} to stream {stream_id}, "
                    f"event_id={event_id}"
                )
                return event_id

            except psycopg2.Error as e:
                if "Concurrency conflict" in str(e):
                    raise ConcurrencyError(str(e))
                raise
            finally:
                cursor.close()

    def read_stream(
        self,
        stream_id: str,
        from_version: int = 0,
        max_count: int = 1000
    ) -> List[BaseEvent]:
        """
        Read events from a stream.

        Args:
            stream_id: Stream identifier
            from_version: Start reading from this version (exclusive)
            max_count: Maximum number of events to return

        Returns:
            List of events
        """
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        try:
            cursor.execute(
                "SELECT * FROM read_stream(%s, %s, %s)",
                (stream_id, from_version, max_count)
            )

            events = []
            for row in cursor.fetchall():
                event_dict = dict(row['event_data'])
                event = deserialize_event(event_dict)
                events.append(event)

            logger.debug(f"Read {len(events)} events from stream {stream_id}")
            return events

        finally:
            cursor.close()

    def read_all_events(
        self,
        from_position: int = 0,
        max_count: int = 1000,
        event_types: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Read all events (for projections/read models).

        Args:
            from_position: Start position
            max_count: Maximum events to return
            event_types: Filter by event types

        Returns:
            List of event dictionaries with metadata
        """
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        try:
            cursor.execute(
                "SELECT * FROM read_all_events(%s, %s, %s)",
                (from_position, max_count, event_types)
            )

            events = []
            for row in cursor.fetchall():
                events.append({
                    'event_id': str(row['event_id']),
                    'stream_id': row['stream_id'],
                    'event_number': row['event_number'],
                    'event_type': row['event_type'],
                    'event_data': row['event_data'],
                    'created_at': row['created_at'].isoformat()
                })

            return events

        finally:
            cursor.close()

    def get_stream_version(self, stream_id: str) -> int:
        """Get current version of a stream."""
        cursor = self.conn.cursor()

        try:
            cursor.execute(
                "SELECT version FROM event_streams WHERE stream_id = %s",
                (stream_id,)
            )
            result = cursor.fetchone()
            return result[0] if result else 0

        finally:
            cursor.close()

    def create_snapshot(self, stream_id: str, version: int, snapshot_data: Dict[str, Any]):
        """Create a snapshot of stream state at a specific version."""
        with self.transaction():
            cursor = self.conn.cursor()

            try:
                cursor.execute(
                    """
                    INSERT INTO event_snapshots (stream_id, snapshot_version, snapshot_data)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (stream_id) DO UPDATE
                    SET snapshot_version = EXCLUDED.snapshot_version,
                        snapshot_data = EXCLUDED.snapshot_data,
                        created_at = CURRENT_TIMESTAMP
                    """,
                    (stream_id, version, Json(snapshot_data))
                )

                logger.info(f"Created snapshot for stream {stream_id} at version {version}")

            finally:
                cursor.close()

    def get_snapshot(self, stream_id: str) -> Optional[Dict[str, Any]]:
        """Get latest snapshot for a stream."""
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        try:
            cursor.execute(
                """
                SELECT snapshot_version, snapshot_data, created_at
                FROM event_snapshots
                WHERE stream_id = %s
                """,
                (stream_id,)
            )

            result = cursor.fetchone()
            if result:
                return {
                    'version': result['snapshot_version'],
                    'data': result['snapshot_data'],
                    'created_at': result['created_at'].isoformat()
                }
            return None

        finally:
            cursor.close()

    def get_statistics(self) -> Dict[str, Any]:
        """Get event store statistics."""
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)

        try:
            # Total events and streams
            cursor.execute("""
                SELECT
                    COUNT(*) as total_events,
                    COUNT(DISTINCT stream_id) as total_streams
                FROM events
            """)
            stats = dict(cursor.fetchone())

            # Events by type
            cursor.execute("SELECT * FROM v_event_stats")
            stats['events_by_type'] = [dict(row) for row in cursor.fetchall()]

            # Recent streams
            cursor.execute("""
                SELECT * FROM v_stream_health
                ORDER BY last_event_at DESC
                LIMIT 10
            """)
            stats['recent_streams'] = [dict(row) for row in cursor.fetchall()]

            return stats

        finally:
            cursor.close()

    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Event store connection closed")
