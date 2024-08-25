# app/main.py
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.api import api_router, base_router, provisioner_router
from app.core.config import settings
from app.core.logger import get_logger
from app.core.middleware import TraceContextMiddleware, setup_honeycomb_telemetry

logger = get_logger(__name__)

setup_honeycomb_telemetry()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting application with log level: {settings.LOG_LEVEL}")
    yield
    logger.info("shutting down")


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# add middleware
app.add_middleware(TraceContextMiddleware)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Outgoing response: {response.status_code}")
    return response


# include main api router
app.include_router(api_router)
app.include_router(base_router)
app.include_router(provisioner_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://platform-ui-toyurvn2oq-wl.a.run.app",
        "https://6db5-76-102-100-3.ngrok-free.app",
        "https://dev.r7ai.net",
        "https://canvas.dev.r7ai.net",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    logger.info("Starting application")
