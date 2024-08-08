import os


class Config:
    PROJECT_ID = os.environ.get('PROJECT_ID', 'rad-dev-canvas-kwm6')
    BUCKET_NAME = os.environ.get('BUCKET_NAME', 'rad-cc-demo')
    # TODO: replace w/ firebase auth
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '988868445965-<>.apps.googleusercontent.com')
    API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:8000')

config = Config()
