# app/core/config.py

from typing import Any, Dict, Optional

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Platform API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "my-32-character-ultra-secure-and-ultra-long-secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    CREDENTIAL_ENCRYPTION_KEY: str
    AUTH_SERVICE_URL: str = "http://localhost:8080"

    OTEL_SERVICE_NAME: str = "your-service-name"
    OTEL_EXPORTER_OTLP_PROTOCOL: str = "http/protobuf"
    OTEL_EXPORTER_OTLP_ENDPOINT: str = "https://api.honeycomb.io:443"  # US instance
    OTEL_EXPORTER_OTLP_HEADERS: str = "x-honeycomb-team=<your-api-key>"
    HONEYCOMB_API_KEY: str
    HONEYCOMB_DATASET: str

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "myuser"
    POSTGRES_PASSWORD: str = "mypassword"
    POSTGRES_DB: str = "mydatabase"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    SQLALCHEMY_DATABASE_URI_ASYNC: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            username=info.data.get("POSTGRES_USER"),
            password=info.data.get("POSTGRES_PASSWORD"),
            host=info.data.get("POSTGRES_SERVER"),
            path=f"{info.data.get('POSTGRES_DB') or ''}",
        ).unicode_string()

    @field_validator("SQLALCHEMY_DATABASE_URI_ASYNC", mode="before")
    @classmethod
    def assemble_db_connection_async(
        cls, v: Optional[str], info: Dict[str, Any]
    ) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=info.data.get("POSTGRES_USER"),
            password=info.data.get("POSTGRES_PASSWORD"),
            host=info.data.get("POSTGRES_SERVER"),
            path=f"{info.data.get('POSTGRES_DB') or ''}",
        ).unicode_string()

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Google OAuth (if using Google Sign-In)
    GOOGLE_CLIENT_ID: Optional[str] = None
    LOG_LEVEL: str = "INFO"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
