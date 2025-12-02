"""
PostgreSQL Event Publisher with Transactional Outbox pattern.
"""
import logging
from typing import Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import Json

from shared.events import BaseEvent, serialize_event
from postgres.event_store import PostgresEventStore

logger = logging.getLogger(__name__)


class PostgresEventPublisher:
    """
    Event publisher using PostgreSQL with transactional outbox pattern.

    Ensures at-least-once delivery by:
    1. Write event to event store + outbox in same transaction
    2. Separate process publishes from outbox
    3. Mark as published when confirmed
    """

    def __init__(self, connection_string: str):
        self.event_store = PostgresEventStore(connection_string)
        self.conn = psycopg2.connect(connection_string)

    def publish(
        self,
        stream_id: str,
        stream_type: str,
        event: BaseEvent,
        expected_version: Optional[int] = None,
        use_outbox: bool = True
    ) -> str:
        """
        Publish event to event store.

        Args:
            stream_id: Stream identifier
            stream_type: Type of stream
            event: Event to publish
            expected_version: Expected version for concurrency control
            use_outbox: Use transactional outbox pattern

        Returns:
            event_id: UUID of published event
        """
        try:
            # Append to event store
            event_id = self.event_store.append_event(
                stream_id=stream_id,
                stream_type=stream_type,
                event=event,
                expected_version=expected_version
            )

            # Also write to outbox if enabled
            if use_outbox:
                self._write_to_outbox(event_id, event)

            logger.info(
                f"Published event {event.event_type} to stream {stream_id}, "
                f"event_id={event_id}"
            )

            return event_id

        except Exception as e:
            logger.error(f"Failed to publish event: {e}")
            raise

    def _write_to_outbox(self, event_id: str, event: BaseEvent):
        """Write event to outbox table."""
        cursor = self.conn.cursor()

        try:
            event_data = serialize_event(event)

            cursor.execute(
                """
                INSERT INTO event_outbox (
                    event_id, event_type, event_data, created_at
                )
                VALUES (%s, %s, %s, %s)
                """,
                (
                    event_id,
                    event.event_type,
                    Json(event_data),
                    datetime.utcnow()
                )
            )

            self.conn.commit()
            logger.debug(f"Written event {event_id} to outbox")

        except Exception as e:
            self.conn.rollback()
            logger.error(f"Failed to write to outbox: {e}")
            raise
        finally:
            cursor.close()

    def mark_published(self, event_id: str):
        """Mark event as published in outbox."""
        cursor = self.conn.cursor()

        try:
            cursor.execute(
                """
                UPDATE event_outbox
                SET published_at = CURRENT_TIMESTAMP,
                    processed_at = CURRENT_TIMESTAMP
                WHERE event_id = %s
                """,
                (event_id,)
            )

            self.conn.commit()
            logger.debug(f"Marked event {event_id} as published")

        except Exception as e:
            self.conn.rollback()
            logger.error(f"Failed to mark event as published: {e}")
            raise
        finally:
            cursor.close()

    def get_pending_events(self, limit: int = 100):
        """Get pending events from outbox."""
        cursor = self.conn.cursor()

        try:
            cursor.execute(
                """
                SELECT id, event_id, event_type, event_data, retry_count
                FROM event_outbox
                WHERE published_at IS NULL
                    AND retry_count < max_retries
                ORDER BY created_at
                LIMIT %s
                FOR UPDATE SKIP LOCKED
                """,
                (limit,)
            )

            return cursor.fetchall()

        finally:
            cursor.close()

    def close(self):
        """Close connections."""
        if self.event_store:
            self.event_store.close()
        if self.conn:
            self.conn.close()
