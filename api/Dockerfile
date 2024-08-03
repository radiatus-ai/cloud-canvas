FROM python:3.11-slim

# install system dependencies
RUN apt-get update && apt-get install -y \
  wget \
  unzip

RUN wget https://releases.hashicorp.com/terraform/1.9.1/terraform_1.9.1_linux_amd64.zip && \
  unzip terraform_1.9.1_linux_amd64.zip && \
  mv terraform /usr/local/bin/terraform && \
  rm terraform_1.9.1_linux_amd64.zip

RUN pip install poetry

WORKDIR /app

# Copy only pyproject.toml and poetry.lock
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

# Copy the rest of the application code
COPY . .

# Install the project itself
RUN poetry install --no-interaction --no-ansi

ENV PORT=8000
EXPOSE $PORT

CMD ["sh", "-c", "poetry run uvicorn main:app --app-dir=src --host=0.0.0.0 --port=${PORT}"]
