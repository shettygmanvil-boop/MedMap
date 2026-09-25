from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse
from app.services import case_service
from app.core.database import get_db
from fastapi import UploadFile, File
from app.schemas.document import DocumentResponse
from app.services import document_service

router = APIRouter()

@router.post("", response_model=CaseResponse, status_code=201)
@router.post("/", response_model=CaseResponse, status_code=201)
def create_case(case_in: CaseCreate, db: Session = Depends(get_db)):
    return case_service.create_case(db, case_in)

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: str, db: Session = Depends(get_db)):
    case = case_service.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: str, case_in: CaseUpdate, db: Session = Depends(get_db)):
    case = case_service.update_case(db, case_id, case_in)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("/{case_id}/documents", response_model=DocumentResponse, status_code=201)
def upload_case_document(case_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return document_service.upload_document(db, case_id, file)
