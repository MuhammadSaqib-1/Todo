from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import todos, auth
from core.config import settings
from database.init_db import create_db_and_tables

app = FastAPI(title=settings.APP_NAME, version=settings.API_VERSION)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, configure specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include API routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(todos.router, prefix="/api", tags=["todos"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)