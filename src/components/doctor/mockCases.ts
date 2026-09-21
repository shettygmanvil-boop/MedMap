import type { CaseStatus } from '../../types/case';

export type DemoPresentationPriority = 'priority_review' | 'routine' | 'follow_up';

export interface DoctorCaseSummaryItem {
  caseId: string;
  patientId: string;
  patientDisplayName: string;
  age: number;
  gender: string;
  preferredLanguage: string;
  status: CaseStatus;
  demoPriority: DemoPresentationPriority;
  createdAt: string;
  updatedAt: string;
  intakeSummary: string;
  hasPatientVerified: boolean;
  documentsCount: number;
}

/**
 * Synthetic demonstration cases for Day-1 Doctor Dashboard.
 * NOTE: These are synthetic demonstration fixtures only, not actual patient health records.
 * No real diagnoses, medications, or clinical recommendations are fabricated.
 */
export const MOCK_DOCTOR_CASES: DoctorCaseSummaryItem[] = [
  {
    caseId: 'test-case-001',
    patientId: 'DEMO-PT-101',
    patientDisplayName: 'Demo Patient 01 (A. Sharma)',
    age: 52,
    gender: 'Female',
    preferredLanguage: 'English',
    status: 'doctor_review',
    demoPriority: 'priority_review',
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-20T10:15:00Z',
    intakeSummary: 'Pre-consultation intake completed via touch; patient verified history and uploaded 2 laboratory records.',
    hasPatientVerified: true,
    documentsCount: 2,
  },
  {
    caseId: 'case-demo-002',
    patientId: 'DEMO-PT-102',
    patientDisplayName: 'Demo Patient 02 (R. Patel)',
    age: 44,
    gender: 'Male',
    preferredLanguage: 'English',
    status: 'doctor_review',
    demoPriority: 'routine',
    createdAt: '2026-09-20T09:10:00Z',
    updatedAt: '2026-09-20T10:45:00Z',
    intakeSummary: 'Voice intake completed with structured chief complaint; patient verified information before submission.',
    hasPatientVerified: true,
    documentsCount: 1,
  },
  {
    caseId: 'case-demo-003',
    patientId: 'DEMO-PT-103',
    patientDisplayName: 'Demo Patient 03 (M. Khan)',
    age: 67,
    gender: 'Male',
    preferredLanguage: 'Hindi',
    status: 'doctor_review',
    demoPriority: 'follow_up',
    createdAt: '2026-09-19T14:20:00Z',
    updatedAt: '2026-09-20T09:00:00Z',
    intakeSummary: 'Pre-consultation brief ready for follow-up review; previous clinic records uploaded and linked.',
    hasPatientVerified: true,
    documentsCount: 3,
  },
  {
    caseId: 'case-demo-004',
    patientId: 'DEMO-PT-104',
    patientDisplayName: 'Demo Patient 04 (S. Nair)',
    age: 31,
    gender: 'Female',
    preferredLanguage: 'English',
    status: 'patient_verifying',
    demoPriority: 'routine',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-20T11:20:00Z',
    intakeSummary: 'Intake conversation completed; currently awaiting patient verification of compiled timeline.',
    hasPatientVerified: false,
    documentsCount: 1,
  },
  {
    caseId: 'case-demo-005',
    patientId: 'DEMO-PT-105',
    patientDisplayName: 'Demo Patient 05 (V. Rao)',
    age: 39,
    gender: 'Male',
    preferredLanguage: 'Telugu',
    status: 'intake',
    demoPriority: 'routine',
    createdAt: '2026-09-20T11:45:00Z',
    updatedAt: '2026-09-20T11:50:00Z',
    intakeSummary: 'Pre-consultation questionnaire in progress; documents pending upload.',
    hasPatientVerified: false,
    documentsCount: 0,
  },
  {
    caseId: 'case-demo-006',
    patientId: 'DEMO-PT-106',
    patientDisplayName: 'Demo Patient 06 (E. Gomez)',
    age: 58,
    gender: 'Female',
    preferredLanguage: 'Spanish',
    status: 'completed',
    demoPriority: 'follow_up',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-19T15:30:00Z',
    intakeSummary: 'Consultation completed; pre-consultation brief was reviewed and verified by attending physician.',
    hasPatientVerified: true,
    documentsCount: 2,
  },
];

export interface CaseCounts {
  total: number;
  doctorReview: number;
  inProgress: number;
  completed: number;
}

export function calculateCaseCounts(cases: DoctorCaseSummaryItem[]): CaseCounts {
  return {
    total: cases.length,
    doctorReview: cases.filter((c) => c.status === 'doctor_review').length,
    inProgress: cases.filter((c) => c.status === 'intake' || c.status === 'patient_verifying').length,
    completed: cases.filter((c) => c.status === 'completed').length,
  };
}

