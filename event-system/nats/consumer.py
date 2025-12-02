"""
NATS JetStream Event Consumer.
"""
import asyncio
import json
import logging
from typing import Callable, Optional
from nats.aio.client import Client as NATS
from nats.js import JetStreamContext
from nats.js.api import ConsumerConfig

from shared.events import deserialize_event, BaseEvent

logger = logging.getLogger(__name__)


class NatsEventConsumer:
    """
    High-performance event consumer using NATS JetStream.

    Features:
    - Async/await for high throughput
    - Automatic acknowledgment
    - Error handling with retries
    - Consumer groups
    """

    def __init__(
        self,
        nats_url: str = "nats://localhost:4222",
        consumer_name: str = "default-consumer"
    ):
        self.nats_url = nats_url
        self.consumer_name = consumer_name
        self.nc: Optional[NATS] = None
        self.js: Optional[JetStreamContext] = None
        self._connected = False
        self._subscriptions = []

    async def connect(self):
        """Connect to NATS server."""
        if self._connected:
            return

        self.nc = NATS()
        await self.nc.connect(self.nats_url)
        self.js = self.nc.jetstream()
        self._connected = True
        logger.info(f"Consumer {self.consumer_name} connected to NATS at {self.nats_url}")

    async def subscribe(
        self,
        stream_name: str,
        subject: str,
        handler: Callable[[BaseEvent], asyncio.Future],
        durable_name: Optional[str] = None,
        max_concurrent: int = 10
    ):
        """
        Subscribe to events from a stream.

        Args:
            stream_name: Name of the stream
            subject: Subject filter
            handler: Async function to process events
            durable_name: Durable consumer name
            max_concurrent: Max concurrent message processing
        """
        if not self._connected:
            await self.connect()

        durable = durable_name or f"{self.consumer_name}-{stream_name}"

        async def message_handler(msg):
            """Handle incoming message."""
            try:
                # Deserialize event
                data = json.loads(msg.data.decode())
                event = deserialize_event(data)

                # Process event
                await handler(event)

                # Acknowledge
                await msg.ack()

                logger.debug(f"Processed {event.event_type} from {subject}")

            except Exception as e:
                logger.error(f"Error processing message: {e}")
                # Negative acknowledgment (will be redelivered)
                await msg.nak(delay=5)  # Retry after 5 seconds

        # Create pull subscription
        psub = await self.js.pull_subscribe(
            subject,
            durable=durable,
            stream=stream_name
        )

        self._subscriptions.append(psub)

        logger.info(
            f"Subscribed to {subject} on stream {stream_name} "
            f"(durable: {durable})"
        )

        # Start consuming messages
        asyncio.create_task(
            self._consume_messages(psub, message_handler, max_concurrent)
        )

    async def _consume_messages(
        self,
        subscription,
        handler: Callable,
        max_concurrent: int
    ):
        """
        Consume messages from subscription with concurrency limit.

        Args:
            subscription: Pull subscription
            handler: Message handler
            max_concurrent: Max concurrent processing
        """
        semaphore = asyncio.Semaphore(max_concurrent)

        while True:
            try:
                async with semaphore:
                    # Fetch messages in batches
                    messages = await subscription.fetch(batch=max_concurrent, timeout=1.0)

                    # Process messages concurrently
                    tasks = [handler(msg) for msg in messages]
                    if tasks:
                        await asyncio.gather(*tasks, return_exceptions=True)

            except TimeoutError:
                # No messages available, continue
                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"Error fetching messages: {e}")
                await asyncio.sleep(1.0)

    async def close(self):
        """Close NATS connection."""
        if self.nc and self._connected:
            # Drain subscriptions
            for sub in self._subscriptions:
                try:
                    await sub.unsubscribe()
                except Exception as e:
                    logger.warning(f"Error unsubscribing: {e}")

            await self.nc.close()
            self._connected = False
            logger.info(f"Consumer {self.consumer_name} closed")

    async def __aenter__(self):
        """Async context manager entry."""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()


async def main():
    """Demo consumer."""

    # Event handler
    async def process_event(event: BaseEvent):
        print(f"📥 Received: {event.event_type} (id: {event.event_id})")
        # Simulate processing
        await asyncio.sleep(0.01)

    consumer = NatsEventConsumer(consumer_name="demo-consumer")

    try:
        await consumer.connect()

        # Subscribe to all case events
        await consumer.subscribe(
            stream_name="CASES_ALL",
            subject="cases.>",
            handler=process_event,
            durable_name="demo-all-cases",
            max_concurrent=50
        )

        print("Consumer started. Press Ctrl+C to stop...")

        # Keep running
        while True:
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        print("\nStopping consumer...")
    finally:
        await consumer.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
