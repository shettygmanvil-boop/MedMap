import type { ClinicalCase } from '../types/case';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const createCase = async (patientId: string, language?: string, consentGranted?: boolean): Promise<ClinicalCase> => {
  const response = await fetch(`${API_BASE_URL}/cases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ patientId, language, consentGranted }),
  });

  if (!response.ok) {
    throw new Error('Failed to create case');
  }

  return response.json();
};

export const getCase = async (caseId: string): Promise<ClinicalCase> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);

  if (!response.ok) {
    throw new Error('Failed to load case');
  }

  return response.json();
};

export const updateCaseStatus = async (caseId: string, status: string): Promise<ClinicalCase> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update case');
  }

  return response.json();
};
