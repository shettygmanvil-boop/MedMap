from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import cases

app = FastAPI(title="MedMap API", version="1.0.0")

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])
