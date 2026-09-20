import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.models.case import ClinicalCase  # noqa: F401 - registers the model metadata
from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate
from app.services import case_service


class CaseSchemaTests(unittest.TestCase):
    def test_all_supported_update_statuses_are_accepted(self):
        for status in ("intake", "patient_verifying", "doctor_review", "completed"):
            with self.subTest(status=status):
                self.assertEqual(CaseUpdate(status=status).status.value, status)

    def test_unknown_update_status_is_rejected(self):
        with self.assertRaises(ValidationError):
            CaseUpdate(status="banana")

    def test_null_update_status_is_rejected(self):
        with self.assertRaises(ValidationError):
            CaseUpdate(status=None)

    def test_null_update_consent_is_rejected(self):
        with self.assertRaises(ValidationError):
            CaseUpdate(consentGranted=None)

    def test_omitted_update_fields_are_accepted(self):
        self.assertEqual(CaseUpdate().model_dump(exclude_unset=True), {})

    def test_null_language_is_accepted(self):
        self.assertEqual(
            CaseUpdate(language=None).model_dump(exclude_unset=True),
            {"language": None},
        )

    def test_omitted_create_consent_defaults_to_false(self):
        self.assertFalse(CaseCreate(patientId="patient-1").consentGranted)

    def test_null_create_consent_is_rejected(self):
        with self.assertRaises(ValidationError):
            CaseCreate(patientId="patient-1", consentGranted=None)

    def test_response_accepts_current_and_legacy_statuses(self):
        now = datetime.now(timezone.utc)
        for status in ("intake", "pending"):
            with self.subTest(status=status):
                response = CaseResponse(
                    caseId="case-12345678",
                    patientId="patient-1",
                    createdAt=now,
                    updatedAt=now,
                    language=None,
                    consentGranted=False,
                    status=status,
                )
                self.assertEqual(response.model_dump(mode="json")["status"], status)


class CaseServiceTests(unittest.TestCase):
    def setUp(self):
        self._temp_dir = tempfile.TemporaryDirectory()
        database_path = Path(self._temp_dir.name) / "cases.db"
        self.engine = create_engine(f"sqlite:///{database_path}")
        self.Session = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)

    def tearDown(self):
        self.engine.dispose()
        self._temp_dir.cleanup()

    def test_case_crud_and_persistence_across_sessions(self):
        with self.Session() as session:
            created = case_service.create_case(
                session,
                CaseCreate(patientId="patient-1", language="English"),
            )
            case_id = created.caseId
            self.assertEqual(created.status, "intake")
            self.assertFalse(created.consentGranted)

        with self.Session() as session:
            retrieved = case_service.get_case(session, case_id)
            self.assertIsNotNone(retrieved)
            self.assertEqual(retrieved.patientId, "patient-1")
            self.assertEqual(retrieved.status, "intake")

            updated = case_service.update_case(
                session,
                case_id,
                CaseUpdate(
                    language="Hindi",
                    consentGranted=True,
                    status="patient_verifying",
                ),
            )
            self.assertIsNotNone(updated)
            self.assertEqual(updated.language, "Hindi")
            self.assertTrue(updated.consentGranted)
            self.assertEqual(updated.status, "patient_verifying")

        with self.Session() as session:
            persisted = case_service.get_case(session, case_id)
            self.assertIsNotNone(persisted)
            self.assertEqual(persisted.language, "Hindi")
            self.assertTrue(persisted.consentGranted)
            self.assertEqual(persisted.status, "patient_verifying")

    def test_missing_case_returns_none(self):
        with self.Session() as session:
            self.assertIsNone(case_service.get_case(session, "missing-case"))
            self.assertIsNone(
                case_service.update_case(
                    session,
                    "missing-case",
                    CaseUpdate(language="Hindi"),
                )
            )


if __name__ == "__main__":
    unittest.main()
