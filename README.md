# Cloud Canvas

Manage your infrastructure (and everything else) with diagrams.

## Getting Started

You may need to set the project some gcloud config

`gcloud auth application-default login`
`gcloud config set project rad-dev-canvas-kwm6`

## Starting the Auth DB, Auth Service, and API Database

`docker compose up database auth-service`

API

```
cd api
poetry install
make start
```

### First-Time Database OR After Model Changes

Only the database needs to be live for this, the api doesn't need to be live.

```
cd api
poetry run alembic upgrade head
```

UI

```
cd ui
npm install
npm start
```

## Deploying To Dev

`make deploy`
