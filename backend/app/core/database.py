import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

load_dotenv()
from sqlalchemy.orm import sessionmaker

raw_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:PASSWORD_PLACEHOLDER@localhost:5432/medmap"
)

if raw_url.startswith("postgresql://"):
    DATABASE_URL = raw_url.replace("postgresql://", "postgresql+pg8000://", 1)
elif raw_url.startswith("postgresql+psycopg2://"):
    DATABASE_URL = raw_url.replace("postgresql+psycopg2://", "postgresql+pg8000://", 1)
elif raw_url.startswith("postgres://"):
    DATABASE_URL = raw_url.replace("postgres://", "postgresql+pg8000://", 1)
else:
    DATABASE_URL = raw_url

engine = create_engine(DATABASE_URL, poolclass=NullPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
