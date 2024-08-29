import logging
import os
from concurrent import futures

from google.api_core import exceptions
from google.cloud import pubsub_v1

from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PubSubMessenger:
    def __init__(self):
        self.project_id = settings.PUBSUB_PROJECT_ID
        self.topic_id = settings.PUBSUB_TOPIC_NAME
        emulator_host = settings.PUBSUB_EMULATOR_HOST

        if emulator_host:
            logger.info(f"Using Pub/Sub emulator at {emulator_host}")
            os.environ["PUBSUB_EMULATOR_HOST"] = emulator_host
            self.publisher = pubsub_v1.PublisherClient()
        else:
            self.publisher = pubsub_v1.PublisherClient()

        self.topic_path = self.publisher.topic_path(self.project_id, self.topic_id)
        logger.info(f"Initialized PubSubMessenger with topic path: {self.topic_path}")
        self._create_topic()

    def _create_topic(self):
        try:
            self.publisher.create_topic(request={"name": self.topic_path})
            logger.info(f"Topic created: {self.topic_path}")
        except exceptions.AlreadyExists:
            logger.info(f"Topic already exists: {self.topic_path}")
        except Exception as e:
            logger.error(f"Error creating topic: {str(e)}")
            raise

    def publish_message(self, message: str):
        data = message.encode("utf-8")
        try:
            truncated_message = message[:200]
            logger.info(f"Attempting to publish message: {truncated_message}")
            future = self.publisher.publish(self.topic_path, data)
            message_id = future.result(timeout=5)  # Reduced timeout to 5 seconds
            logger.info(f"Published message with ID: {message_id}")
            return f"success: message ID {message_id}"
        except futures.TimeoutError:
            logger.error("Publish timed out")
            return "error: publish timed out"
        except exceptions.NotFound:
            logger.error(f"Topic {self.topic_path} not found")
            return "error: topic not found"
        except exceptions.PermissionDenied:
            logger.error("Permission denied to publish to topic")
            return "error: permission denied"
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return f"error: {str(e)}"
