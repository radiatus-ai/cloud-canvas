# Build stage
FROM python:3.12-slim as builder

# install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy only pyproject.toml and poetry.lock
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root --only main

COPY . .
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi --only main

# Final stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

ENV PORT=8000
EXPOSE $PORT

# Use gunicorn with multiple workers and enable preload
CMD ["sh", "-c", "gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --preload --bind 0.0.0.0:${PORT}"]
