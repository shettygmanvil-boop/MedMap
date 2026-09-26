from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import cases, auth
app = FastAPI(title="MedMap API", version="1.0.0")

import os

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]
frontend_origin = os.getenv("FRONTEND_ORIGIN")
if frontend_origin:
    # Support comma-separated list for multiple origins
    origins.extend([origin.strip() for origin in frontend_origin.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from sqlalchemy import text
from app.core.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/v1/health/db")
def db_health_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar()
        return {"db_status": "ok", "result": result}
    except Exception as e:
        import re
        safe_msg = re.sub(r"://[^@]+@[^/]+", "://***:***@***", str(e))
        return {
            "db_status": "error",
            "message": "Connection failed",
            "exception_type": type(e).__name__,
            "exception_msg": safe_msg
        }

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])
