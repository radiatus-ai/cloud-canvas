import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional

from config import config
from google.cloud import storage
from google.cloud.exceptions import NotFound

logger = logging.getLogger(__name__)

class GCSService:
    def __init__(self):
        self.client = storage.Client(project=config.PROJECT_ID)
        self.bucket_name = config.BUCKET_NAME
        self.bucket = self.client.get_bucket(self.bucket_name)


    def read_json_file(self, file_name: str) -> Optional[List[Any]]:
        try:
            blob = self.bucket.blob(file_name)
            if not blob.exists():
                logger.warning(f"File '{file_name}' does not exist in bucket '{self.bucket_name}'")
                return None

            content = blob.download_as_text()
            return json.loads(content)
        except NotFound:
            logger.error(f"Bucket '{self.bucket_name}' not found")
            return None
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from file '{file_name}'")
            return None
        except Exception as e:
            logger.error(f"An error occurred while reading from GCS: {str(e)}")
            return None

    def write_json_file(self, file_name: str, content: List[Any]) -> bool:
        try:
            blob = self.bucket.blob(file_name)
            blob.upload_from_string(json.dumps(content, default=str))  # Use default=str to handle datetime serialization
            return True
        except Exception as e:
            logger.error(f"An error occurred while writing to GCS: {str(e)}")
            return False

    def append_to_json_file(self, file_name: str, new_item: Any) -> Optional[str]:
        current_content = self.read_json_file(file_name) or []
        new_id = str(uuid.uuid4())
        current_time = datetime.now(timezone.utc).isoformat()
        new_item.update({
            'id': new_id,
            'created_at': current_time,
            'updated_at': current_time
        })
        current_content.append(new_item)
        if self.write_json_file(file_name, current_content):
            return new_id
        return None

    def update_item_in_json_file(self, file_name: str, item_id: str, updated_item: Any) -> bool:
        current_content = self.read_json_file(file_name) or []
        for i, item in enumerate(current_content):
            if item.get('id') == item_id:
                updated_item['id'] = item_id  # Ensure ID doesn't change
                updated_item['created_at'] = item.get('created_at')  # Preserve original created_at
                updated_item['updated_at'] = datetime.now(timezone.utc).isoformat()
                current_content[i] = updated_item
                return self.write_json_file(file_name, current_content)
        return False

    def delete_item_from_json_file(self, file_name: str, item_id: str) -> bool:
        current_content = self.read_json_file(file_name) or []
        new_content = [item for item in current_content if item.get('id') != item_id]
        if len(new_content) < len(current_content):
            return self.write_json_file(file_name, new_content)
        return False

# Usage example:
# gcs_service = GCSService(project_id='your-project-id', bucket_name='your-bucket-name')
