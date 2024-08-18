from fastapi import Request
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.propagate import extract
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
)
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)


def setup_honeycomb_telemetry():
    HONEYCOMB_API_KEY = settings.HONEYCOMB_API_KEY
    HONEYCOMB_DATASET = settings.HONEYCOMB_DATASET
    SERVICE_NAME = settings.OTEL_SERVICE_NAME

    # Create a resource with service information
    resource = Resource.create({"service.name": SERVICE_NAME})

    # Initialize tracing and an exporter that can send data to Honeycomb
    provider = TracerProvider(resource=resource)
    processor = BatchSpanProcessor(
        OTLPSpanExporter(
            endpoint="https://api.honeycomb.io:443",
            headers={
                "x-honeycomb-team": HONEYCOMB_API_KEY,
                "x-honeycomb-dataset": HONEYCOMB_DATASET,
            },
        )
    )
    provider.add_span_processor(processor)

    # Sets the global default tracer provider
    trace.set_tracer_provider(provider)

    # Initialize automatic instrumentation with Flask
    FastAPIInstrumentor().instrument()
    LoggingInstrumentor().instrument()
    SQLAlchemyInstrumentor().instrument()


class TraceContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        carrier = {}
        for key, value in request.headers.items():
            carrier[key.lower()] = value

        ctx = extract(carrier)

        if ctx:
            logger.info(f"Extracted context: {ctx}")
            span = trace.get_current_span(ctx)
            if span:
                logger.info(
                    f"Span context: TraceId={span.get_span_context().trace_id:032x}, SpanId={span.get_span_context().span_id:016x}"
                )
                request.state.trace_context = span.get_span_context()
            else:
                logger.info("No span in extracted context")
                request.state.trace_context = None
        else:
            logger.info("No context extracted")
            request.state.trace_context = None

        response = await call_next(request)
        return response
