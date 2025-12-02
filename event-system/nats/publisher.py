"""
NATS JetStream Event Publisher.
"""
import asyncio
import json
import logging
from typing import Optional
from datetime import datetime
from nats.aio.client import Client as NATS
from nats.js import JetStreamContext
from nats.errors import TimeoutError as NATSTimeoutError

from shared.events import BaseEvent, serialize_event

logger = logging.getLogger(__name__)


class NatsEventPublisher:
    """
    High-performance event publisher using NATS JetStream.

    Features:
    - Async/await for high throughput
    - At-least-once delivery
    - Automatic retries
    - Message deduplication
    """

    def __init__(self, nats_url: str = "nats://localhost:4222"):
        self.nats_url = nats_url
        self.nc: Optional[NATS] = None
        self.js: Optional[JetStreamContext] = None
        self._connected = False

    async def connect(self):
        """Connect to NATS server."""
        if self._connected:
            return

        self.nc = NATS()
        await self.nc.connect(self.nats_url)
        self.js = self.nc.jetstream()
        self._connected = True
        logger.info(f"Connected to NATS at {self.nats_url}")

    async def publish(
        self,
        event: BaseEvent,
        timeout: float = 5.0,
        headers: Optional[dict] = None
    ) -> str:
        """
        Publish event to appropriate subject.

        Args:
            event: Event to publish
            timeout: Publish timeout in seconds
            headers: Optional message headers

        Returns:
            Message sequence number
        """
        if not self._connected:
            await self.connect()

        # Map event type to NATS subject
        subject = self._get_subject(event.event_type)

        # Serialize event
        event_data = serialize_event(event)
        message = json.dumps(event_data).encode()

        # Add headers
        msg_headers = headers or {}
        msg_headers.update({
            'event-id': event.event_id,
            'event-type': event.event_type,
            'timestamp': event.timestamp.isoformat(),
        })

        if event.correlation_id:
            msg_headers['correlation-id'] = event.correlation_id

        try:
            # Publish to JetStream
            ack = await self.js.publish(
                subject,
                message,
                headers=msg_headers,
                timeout=timeout
            )

            logger.debug(
                f"Published {event.event_type} to {subject}, "
                f"seq={ack.seq}, stream={ack.stream}"
            )

            return str(ack.seq)

        except NATSTimeoutError:
            logger.error(f"Timeout publishing event {event.event_id}")
            raise
        except Exception as e:
            logger.error(f"Failed to publish event: {e}")
            raise

    async def publish_batch(
        self,
        events: list[BaseEvent],
        timeout: float = 10.0
    ) -> list[str]:
        """
        Publish multiple events efficiently.

        Args:
            events: List of events to publish
            timeout: Total timeout for batch

        Returns:
            List of sequence numbers
        """
        if not self._connected:
            await self.connect()

        tasks = [self.publish(event, timeout=timeout) for event in events]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Check for errors
        errors = [r for r in results if isinstance(r, Exception)]
        if errors:
            logger.warning(f"Batch publish had {len(errors)} errors")

        # Return successful sequence numbers
        return [r for r in results if not isinstance(r, Exception)]

    def _get_subject(self, event_type: str) -> str:
        """Map event type to NATS subject."""
        # Convert event type to subject
        # case.intake -> cases.intake
        parts = event_type.split('.')
        if len(parts) >= 2:
            category = parts[0] + 's'  # case -> cases
            action = '.'.join(parts[1:])
            return f"{category}.{action}"

        return f"events.{event_type}"

    async def close(self):
        """Close NATS connection."""
        if self.nc and self._connected:
            await self.nc.close()
            self._connected = False
            logger.info("NATS connection closed")

    async def __aenter__(self):
        """Async context manager entry."""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()


async def main():
    """Demo usage."""
    from simulators.case_generator import CaseGenerator

    generator = CaseGenerator()
    publisher = NatsEventPublisher()

    try:
        await publisher.connect()

        # Generate and publish a case
        case_id = "nats-demo-001"
        events = generator.generate_full_case_flow(case_id)

        print(f"Publishing {len(events)} events...")

        start = asyncio.get_event_loop().time()

        for event in events:
            seq = await publisher.publish(event)
            print(f"  ✓ {event.event_type} -> seq {seq}")

        elapsed = asyncio.get_event_loop().time() - start

        print(f"\nPublished {len(events)} events in {elapsed:.3f}s")
        print(f"Throughput: {len(events)/elapsed:.1f} events/sec")

    finally:
        await publisher.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
