import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import { getCase, updateCaseStatus } from '../../utils/api';
import type { ClinicalCase } from '../../types/case';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { StatusBadge } from '../../components/StatusBadge';

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
        
        <ErrorMessage message={error} />

        {isLoading ? (
          <LoadingIndicator message="Loading case..." />
        ) : clinicalCase ? (
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px', maxWidth: '400px' }}>
            <h3>Case Details</h3>
            <p><strong>Case ID:</strong> {clinicalCase.caseId}</p>
            <p><strong>Patient ID:</strong> {clinicalCase.patientId}</p>
            <p><strong>Language:</strong> {clinicalCase.language || 'N/A'}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <strong>Status:</strong> <StatusBadge status={clinicalCase.status} />
            </p>

            <Button
              variant="success"
              onClick={handleStatusUpdate}
              disabled={isUpdating || clinicalCase.status === 'patient_verifying'}
              isLoading={isUpdating}
              style={{ marginTop: '1rem' }}
            >
              {isUpdating ? 'Updating case...' : 'Move to Verification'}
            </Button>
          </div>
        ) : (
          <div>Case not found.</div>
        )}
      </main>
    </div>
  );
}
