import os
import uuid
import shutil
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from app.models.document import PatientDocument
from app.models.case import ClinicalCase
from app.schemas.document import DocumentResponse

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp"}
ALLOWED_MIMES = {"application/pdf", "image/png", "image/jpeg", "image/webp"}
MAX_SIZE = 10 * 1024 * 1024

def upload_document(db: Session, case_id: str, file: UploadFile) -> DocumentResponse:
    # Validate case
    case = db.query(ClinicalCase).filter(ClinicalCase.caseId == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIMES:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Save file temporarily to check size and keep it
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}{ext}"
    storage_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Read and validate size
    size_bytes = 0
    with open(storage_path, "wb") as buffer:
        while True:
            chunk = file.file.read(8192)
            if not chunk:
                break
            size_bytes += len(chunk)
            if size_bytes > MAX_SIZE:
                buffer.close()
                os.remove(storage_path)
                raise HTTPException(status_code=400, detail="File too large")
            buffer.write(chunk)
    
    if size_bytes == 0:
        os.remove(storage_path)
        raise HTTPException(status_code=400, detail="Empty file")

    # Create DB record
    db_doc = PatientDocument(
        id=doc_id,
        caseId=case_id,
        filename=os.path.basename(file.filename),
        storagePath=storage_path,
        mimeType=file.content_type,
        sizeBytes=size_bytes,
        createdAt=datetime.now(timezone.utc)
    )
    
    try:
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
    except Exception as e:
        db.rollback()
        if os.path.exists(storage_path):
            os.remove(storage_path)
        raise e

    return DocumentResponse(
        id=db_doc.id,
        caseId=db_doc.caseId,
        filename=db_doc.filename,
        mimeType=db_doc.mimeType,
        sizeBytes=db_doc.sizeBytes,
        createdAt=db_doc.createdAt
    )
