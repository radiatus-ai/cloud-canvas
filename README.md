# Cloud Canvas

Manage your infrastructure (and everything else) with diagrams.

## Getting Started

The backend is super basic, it uses app default credentials.

`gcloud auth application-default login`

You may need to set the project.

`gcloud config set project rad-dev-canvas-kwm6`

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

`make deploy`
