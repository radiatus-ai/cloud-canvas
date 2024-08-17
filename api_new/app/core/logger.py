# app/core/logger.py

import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.core.config import settings

# Create logs directory if it doesn't exist
Path("logs").mkdir(exist_ok=True)

# Set up logging configuration
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(settings.PROJECT_NAME)
logger.setLevel(getattr(logging, settings.LOG_LEVEL))

# Create handlers
console_handler = logging.StreamHandler(sys.stdout)
file_handler = RotatingFileHandler("logs/app.log", maxBytes=10240, backupCount=5)

# Create formatters and add it to handlers
log_format = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(log_format)
file_handler.setFormatter(log_format)

# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)


def get_logger(name: str = settings.PROJECT_NAME) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    return logger
