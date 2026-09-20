import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import { getCase, updateCaseStatus } from '../../utils/api';
import type { ClinicalCase } from '../../types/case';

export function PatientIntakePage() {
  const { caseId } = useCase();
  const navigate = useNavigate();
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      navigate('/patient');
      return;
    }

    const loadCase = async () => {
      try {
        const data = await getCase(caseId);
        setClinicalCase(data);
      } catch (err) {
        setError('Failed to load case data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCase();
  }, [caseId, navigate]);

  const handleStatusUpdate = async () => {
    if (!caseId) return;
    setIsUpdating(true);
    setError(null);
    try {
      const updatedCase = await updateCaseStatus(caseId, 'patient_verifying');
      setClinicalCase(updatedCase);
    } catch (err) {
      setError('Failed to update case status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container">
      <header>
        <div className="logo">Patient Case Taking</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Back to Home</Link>
          <Link to="/patient/documents">Next: Documents</Link>
        </nav>
      </header>
      <main style={{ marginTop: '2rem' }}>
        <h2>Intake Chat</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {isLoading ? (
          <div>Loading case...</div>
        ) : clinicalCase ? (
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px', maxWidth: '400px' }}>
            <h3>Case Details</h3>
            <p><strong>Case ID:</strong> {clinicalCase.caseId}</p>
            <p><strong>Patient ID:</strong> {clinicalCase.patientId}</p>
            <p><strong>Language:</strong> {clinicalCase.language || 'N/A'}</p>
            <p><strong>Status:</strong> {clinicalCase.status}</p>

            <button 
              onClick={handleStatusUpdate}
              disabled={isUpdating || clinicalCase.status === 'patient_verifying'}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isUpdating ? 'Updating case...' : 'Move to Verification'}
            </button>
          </div>
        ) : (
          <div>Case not found.</div>
        )}
      </main>
    </div>
  );
}
