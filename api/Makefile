start:
	poetry run opentelemetry-instrument uvicorn app.main:app --host=0.0.0.0 --port=8000 --reload

test:
	poetry run pytest tests -W ignore::DeprecationWarning

gen-openapi-spec:
	poetry run python scripts/gen_openapi_spec.py

migrate:
	poetry run alembic revision --autogenerate -m "init db"
	poetry run alembic upgrade head

upload:
	docker-compose build api-deploy && \
        docker tag platform-api-api-deploy:latest us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest && \
				docker push us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest && \
				gcloud run deploy platform-api \
					--image=us-west2-docker.pkg.dev/ada-test-1234/ada/platform-api:latest \
					--execution-environment=gen2 \
					--region=us-west2 \
					--project=ada-test-1234 \
					&& gcloud run services update-traffic platform-api --to-latest --region us-west2
