from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CaseCreate(BaseModel):
    patientId: str
    language: Optional[str] = None
    consentGranted: Optional[bool] = False

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    language: Optional[str] = None
    consentGranted: Optional[bool] = None

class CaseResponse(BaseModel):
    caseId: str
    patientId: str
    createdAt: datetime
    updatedAt: datetime
    language: Optional[str] = None
    consentGranted: Optional[bool] = False
    status: str
