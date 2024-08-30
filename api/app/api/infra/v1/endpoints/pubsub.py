from core.pubsub import PubSubMessenger
from fastapi import Depends, FastAPI

from app.core.dependencies import get_pubsub_messenger

app = FastAPI()


@app.post("/publish")
def publish(message: str, messenger: PubSubMessenger = Depends(get_pubsub_messenger)):
    message_id = messenger.publish_message(message)
    return {"message_id": message_id}
