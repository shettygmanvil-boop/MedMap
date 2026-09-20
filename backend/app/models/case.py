from sqlalchemy import Column, String, Boolean, DateTime
from app.models.base import Base

class ClinicalCase(Base):
    __tablename__ = "cases"

    caseId = Column(String, primary_key=True, index=True)
    patientId = Column(String, index=True, nullable=False)
    createdAt = Column(DateTime(timezone=True), nullable=False)
    updatedAt = Column(DateTime(timezone=True), nullable=False)
    language = Column(String, nullable=True)
    consentGranted = Column(Boolean, default=False, nullable=False)
    status = Column(String, nullable=False)
