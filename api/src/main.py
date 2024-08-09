import connections_handler
import package_handler
import project_handler
import project_package_handler
import user_handler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/")
def read_root():
    return {"hello": "world"}

app.include_router(router=connections_handler.router)
app.include_router(router=package_handler.router)
app.include_router(router=project_handler.router)
app.include_router(router=project_package_handler.router)
app.include_router(router=user_handler.router)

allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://ui-xe7ty6qn7a-uc.a.run.app",
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

