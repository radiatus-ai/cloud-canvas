# Cloud Canvas

Manage your infrastructure (and everything else) with diagrams.

## Getting Started

You may need to set the project and authenticate with gcp.

`gcloud auth application-default login`
`gcloud config set project rad-dev-canvas-kwm6`

## Configure, Install, Start

Ask Will for a valid `.env` file for the API. Then it's as simple as....

API

```
cd api
poetry install
make start
```

UI

```
cd ui
npm install
npm start
```

## Deploying To Dev

```
make deploy-ui-cloudbuild-kaniko
make deploy-api-cloudbuild-kaniko
```

## Architecture

```mermaid
graph TD
    UI[UI] --> API
    UI --> AuthService[Auth Service]
    API --> AuthService
    API --> PubSubTopic[PubSub Topic]
    API --> canvas-db[canvas-db]
    AuthService --> user-db[user-db]
    PubSubTopic --> Provisioner
    Provisioner --> InfrastructureAppsAgents[Infrastructure / Apps / Agents]
    gs[gs://rad-canvas-packages] --> Provisioner

    click UI "https://github.com/radiatus-ai/cloud-canvas/tree/main/ui" _blank
    click API "https://github.com/radiatus-ai/cloud-canvas/tree/main/api" _blank
    click AuthService "https://github.com/radiatus-ai/auth-service" _blank
    %% click PubSubTopic "https://github.com/yourusername/pubsub-topic-repo" _blank
    %% click canvas-db "https://github.com/yourusername/canvas-db-repo" _blank
    %% click user-db "https://github.com/yourusername/user-db-repo" _blank
    click Provisioner "https://github.com/radiatus-ai/package-provisioner" _blank
    %% click InfrastructureAppsAgents "https://github.com/yourusername/infrastructure-apps-agents-repo" _blank
    click gs "https://github.com/radiatus-ai/canvas-packages" _blank

    style InfrastructureAppsAgents fill:#127312
```


<!--

misc for will to clean up

### First-Time Database OR After Model Changes

Only the database needs to be live for this, the api doesn't need to be live.

```
cd api
poetry run alembic upgrade head
```

## Starting the Auth DB, Auth Service, and API Database

`docker compose up database`

In most cases you can do this. The api is configured to use a hosted auth-service. You can always run it locally if you'd like, or if you're doing active development on it.

If you'd like to run it locally via Docker, here's how you'd do that.

`docker compose up database auth-service`
-->
