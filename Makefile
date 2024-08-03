build:
	docker-compose build api-deploy ui-deploy

tag:
	docker tag infra-app-api-deploy:latest us-west2-docker.pkg.dev/radiatus-gcp-project/infra-app/api:latest
	docker tag infra-app-ui-deploy:latest us-west2-docker.pkg.dev/radiatus-gcp-project/infra-app/ui:latest

upload: build tag
	docker push us-west2-docker.pkg.dev/radiatus-gcp-project/infra-app/api:latest
	docker push us-west2-docker.pkg.dev/radiatus-gcp-project/infra-app/ui:latest
