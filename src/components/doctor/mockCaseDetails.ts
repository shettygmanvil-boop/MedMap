import type { UnifiedCase } from '../../types/unifiedCase';

/**
 * Synthetic demonstration details for Day-1 Doctor Case Detail view.
 *
 * NOTE: These are strictly synthetic demonstration fixtures for interface prototyping.
 * They contain NO real patient health information (PHI), NO real medical diagnoses,
 * and NO autonomous clinical treatment recommendations.
 */
export const MOCK_CASE_DETAILS: Record<string, UnifiedCase> = {
  'test-case-001': {
    caseId: 'test-case-001',
    patientId: 'DEMO-PT-101',
    demographics: {
      'Full Name': 'Demo Patient 01 (A. Sharma)',
      'Age / Gender': '52 / Female',
      'Preferred Language': 'English',
      'Contact Preference': 'SMS Notification (Demo)',
      'Emergency Contact': 'Family Member (Demo)',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Patient reported a 3-week history of mild intermittent morning stiffness in fingers.',
      historyOfPresentIllness: [
        'Symptoms noted to begin approximately three weeks ago.',
        'Stiffness reported as more noticeable upon waking, subsiding after 30 minutes of light activity.',
        'Patient reports no joint redness, warm swelling, or acute trauma.',
      ],
      pastMedicalHistory: [
        'Mild seasonal allergic rhinitis (self-reported during intake)',
      ],
      pastSurgicalHistory: [
        'Appendectomy (2012, self-reported historical entry)',
      ],
      medicationHistory: [
        'Over-the-counter daily multivitamin supplement (self-reported)',
      ],
      allergies: [
        'Penicillin (mild skin rash documented in past clinic record)',
      ],
      familyHistory: [
        'Maternal history of joint wear / osteoarthritis (self-reported)',
      ],
      personalHistory: [
        'Non-smoker, works desk-based occupation, walks 30 minutes daily',
      ],
      reviewOfSystems: [
        'Musculoskeletal: Mild stiffness in bilateral MCP joints without redness.',
        'Constitutional: Denies unexplained fatigue, fever, or unintended weight change.',
      ],
      previousInvestigations: [
        'Routine complete blood count from Jan 2025 clinic intake (uploaded document)',
      ],
    },
    medications: ['Daily Multivitamin (Over-the-counter, self-reported)'],
    allergies: ['Penicillin — cutaneous rash (self-reported)'],
    investigations: [
      'Uploaded complete blood panel summary (PDF dated Jan 14, 2025)',
      'Baseline ESR report (document attachment 2)',
    ],
    documentsFindings: [
      'Lab Document #1 (Jan 2025): Baseline cell counts noted within standard reference intervals.',
      'Lab Document #2 (Jan 2025): Mild baseline inflammatory marker elevation recorded during prior checkup.',
    ],
    timeline: [
      {
        date: '2026-09-01',
        eventType: 'Symptom Onset',
        description: 'Patient reports initial perception of intermittent morning finger stiffness.',
        evidenceIds: ['ev-001'],
      },
      {
        date: '2026-09-18',
        eventType: 'Record Upload',
        description: 'Uploaded previous routine lab summary from Jan 2025 via MedMap document intake.',
        evidenceIds: ['ev-002'],
      },
      {
        date: '2026-09-20 08:30',
        eventType: 'Intake Completed',
        description: 'Completed structured pre-consultation questionnaire via touch interface.',
        evidenceIds: ['ev-001', 'ev-003'],
      },
      {
        date: '2026-09-20 09:15',
        eventType: 'Patient Verified',
        description: 'Patient verified compiled clinical history items prior to physician dispatch.',
        evidenceIds: ['ev-003'],
      },
    ],
    highlights: [
      'Patient reviewed and verified all compiled intake points prior to submission.',
      'Two historical laboratory summaries successfully uploaded and linked to timeline.',
      'Review of systems questionnaire negative for constitutional red flags.',
    ],
    missingInformation: [
      'Recent Vitamin D lab levels not present in uploaded documents.',
      'Workstation ergonomic evaluation pending consultation discussion.',
    ],
    evidence: {
      'ev-001': {
        evidenceId: 'ev-001',
        sourceType: 'intake',
        sourceId: 'intake-session-101',
        extractedContent:
          'Patient intake response: "Morning stiffness lasts about 30 minutes after waking up."',
        location: 'Questionnaire Section 2, Item 3',
      },
      'ev-002': {
        evidenceId: 'ev-002',
        sourceType: 'document',
        sourceId: 'doc-upload-2025-lab.pdf',
        extractedContent:
          'Extracted document text: "Routine CBC: Normal limits. ESR: 22 mm/hr."',
        location: 'Page 1, Paragraph 2',
      },
      'ev-003': {
        evidenceId: 'ev-003',
        sourceType: 'intake',
        sourceId: 'verify-session-101',
        extractedContent:
          'Patient verification confirmation: "I confirm the reported stiffness duration is accurate."',
        location: 'Verification Review Checkpoint',
      },
    },
    patientVerificationStatus: 'verified',
    doctorReview: {
      status: 'pending',
      reviewedAt: undefined,
      reviewedBy: undefined,
      notes: '',
    },
  },

  'case-demo-002': {
    caseId: 'case-demo-002',
    patientId: 'DEMO-PT-102',
    demographics: {
      'Full Name': 'Demo Patient 02 (R. Patel)',
      'Age / Gender': '44 / Male',
      'Preferred Language': 'English',
      'Contact Preference': 'Email Notification (Demo)',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Patient completed voice intake regarding mild recurring throat irritation after dry weather exposure.',
      historyOfPresentIllness: [
        'Symptoms intermittent over the past 10 days.',
        'Patient reports no difficulty swallowing or fever.',
      ],
      pastMedicalHistory: ['Seasonal tree pollen allergies'],
      allergies: ['No known drug allergies (self-reported)'],
      medicationHistory: ['Cetirizine 10mg as needed for pollen seasons'],
      reviewOfSystems: [
        'ENT: Mild dry throat tickle; Respiratory: Clear, no cough or wheezing.',
      ],
    },
    medications: ['Cetirizine 10mg PRN'],
    allergies: ['No known drug allergies (NKDA)'],
    investigations: ['Uploaded seasonal allergy clinic notes from 2024'],
    timeline: [
      {
        date: '2026-09-10',
        eventType: 'Symptom Note',
        description: 'Patient noted throat dryness during seasonal weather shift.',
      },
      {
        date: '2026-09-20 09:10',
        eventType: 'Voice Intake',
        description: 'Completed conversational voice case-taking.',
      },
      {
        date: '2026-09-20 10:45',
        eventType: 'Patient Verified',
        description: 'Patient verified compiled conversational brief.',
      },
    ],
    highlights: [
      'Voice intake successfully organized into structured clinical brief.',
      'Patient confirmed all allergy history items.',
    ],
    patientVerificationStatus: 'verified',
    doctorReview: {
      status: 'pending',
      notes: '',
    },
  },

  'case-demo-003': {
    caseId: 'case-demo-003',
    patientId: 'DEMO-PT-103',
    demographics: {
      'Full Name': 'Demo Patient 03 (M. Khan)',
      'Age / Gender': '67 / Male',
      'Preferred Language': 'Hindi',
      'Contact Preference': 'Phone Call (Demo)',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Routine pre-consultation brief prepared for periodic blood pressure follow-up review.',
      pastMedicalHistory: ['Hypertension (documented in 2021 records)'],
      medicationHistory: ['Amlodipine 5mg daily (verified by patient in intake)'],
      allergies: ['Sulfa drugs (self-reported mild hives)'],
      reviewOfSystems: ['Cardiovascular: Denies chest pain, palpitations, or shortness of breath.'],
    },
    medications: ['Amlodipine 5mg once daily'],
    allergies: ['Sulfa drugs'],
    investigations: [
      'Uploaded home blood pressure log summary (PDF)',
      'Previous lipid panel record (2025)',
    ],
    timeline: [
      {
        date: '2026-09-15',
        eventType: 'Log Entry',
        description: 'Home BP measurements compiled into PDF record.',
      },
      {
        date: '2026-09-20 09:00',
        eventType: 'Intake Completed',
        description: 'Pre-consultation intake recorded in preferred language (Hindi).',
      },
    ],
    highlights: ['Comprehensive 3-month home blood pressure summary attached.'],
    missingInformation: ['Recent serum creatinine report from primary care.'],
    patientVerificationStatus: 'verified',
    doctorReview: {
      status: 'pending',
      notes: '',
    },
  },

  'case-demo-004': {
    caseId: 'case-demo-004',
    patientId: 'DEMO-PT-104',
    demographics: {
      'Full Name': 'Demo Patient 04 (S. Nair)',
      'Age / Gender': '31 / Female',
      'Preferred Language': 'English',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Pre-consultation questions completed; patient currently reviewing extracted items.',
      historyOfPresentIllness: [
        'Patient reports periodic mild tension headaches associated with prolonged screen time.',
      ],
      allergies: ['No known allergies'],
    },
    medications: [],
    allergies: ['No known allergies'],
    timeline: [
      {
        date: '2026-09-20 11:00',
        eventType: 'Intake Started',
        description: 'Patient initiated questionnaire via touch interface.',
      },
    ],
    missingInformation: ['Pending patient verification review.'],
    patientVerificationStatus: 'pending',
    doctorReview: {
      status: 'pending',
      notes: '',
    },
  },

  'case-demo-005': {
    caseId: 'case-demo-005',
    patientId: 'DEMO-PT-105',
    demographics: {
      'Full Name': 'Demo Patient 05 (V. Rao)',
      'Age / Gender': '39 / Male',
      'Preferred Language': 'Telugu',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Initial questionnaire in progress; intake conversation incomplete.',
    },
    timeline: [
      {
        date: '2026-09-20 11:45',
        eventType: 'Intake Initiated',
        description: 'Onboarding completed; primary questionnaire began.',
      },
    ],
    missingInformation: [
      'Document uploads pending.',
      'Symptom duration details pending completion of conversational flow.',
    ],
    patientVerificationStatus: 'pending',
    doctorReview: {
      status: 'pending',
      notes: '',
    },
  },

  'case-demo-006': {
    caseId: 'case-demo-006',
    patientId: 'DEMO-PT-106',
    demographics: {
      'Full Name': 'Demo Patient 06 (E. Gomez)',
      'Age / Gender': '58 / Female',
      'Preferred Language': 'Spanish',
    },
    history: {
      chiefComplaint:
        'Demo intake note: Follow-up consultation completed; clinical pre-consultation brief reviewed and archived.',
      pastMedicalHistory: ['Hypothyroidism (diagnosed 2018)'],
      medicationHistory: ['Levothyroxine 50mcg daily'],
      allergies: ['Latex (mild contact irritation)'],
    },
    medications: ['Levothyroxine 50mcg daily'],
    allergies: ['Latex'],
    timeline: [
      {
        date: '2026-09-18',
        eventType: 'Intake Completed',
        description: 'Patient completed structured history intake in Spanish.',
      },
      {
        date: '2026-09-19 15:30',
        eventType: 'Physician Review',
        description: 'Attending physician reviewed and accepted pre-consultation brief.',
      },
    ],
    highlights: ['All previous endocrinology reports linked and archived.'],
    patientVerificationStatus: 'verified',
    doctorReview: {
      status: 'accepted',
      reviewedAt: '2026-09-19T15:30:00Z',
      reviewedBy: 'Dr. S. Mukherjee (Demo Attending)',
      notes: 'Structured brief was verified by patient and matched prior outpatient history.',
    },
  },
};

/**
 * Safely lookup a mock case detail by caseId.
 */
export function getMockCaseDetail(caseId: string): UnifiedCase | undefined {
  return MOCK_CASE_DETAILS[caseId];
}

