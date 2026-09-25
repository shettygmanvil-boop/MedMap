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
  return updateCase(caseId, { status: status as any });
};

export const updateCase = async (caseId: string, data: Partial<ClinicalCase>): Promise<ClinicalCase> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update case');
  }

  return response.json();
};

export const uploadDocument = async (caseId: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/documents`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    let errorMessage = 'Failed to upload document';
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

export const getCases = async (): Promise<ClinicalCase[]> => {
  const response = await fetch(`${API_BASE_URL}/cases`);
  if (!response.ok) {
    throw new Error('Failed to load cases');
  }
  return response.json();
};
