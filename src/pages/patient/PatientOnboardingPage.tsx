import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import { createCase } from '../../utils/api';

export function PatientOnboardingPage() {
  const [patientId, setPatientId] = useState('');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setCaseId } = useCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const newCase = await createCase(patientId, language, true);
      setCaseId(newCase.caseId);
      navigate('/patient/intake');
    } catch (err) {
      setError('Failed to create case. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <div className="logo">Patient Onboarding</div>
      </header>
      <main style={{ marginTop: '2rem', maxWidth: '400px' }}>
        <h2>Welcome to MedMap</h2>
        <p>Please enter your details to start.</p>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="patientId" style={{ display: 'block', marginBottom: '0.5rem' }}>Patient ID:</label>
            <input 
              id="patientId"
              type="text" 
              value={patientId} 
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. p-12345"
              required
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor="language" style={{ display: 'block', marginBottom: '0.5rem' }}>Preferred Language:</label>
            <select 
              id="language"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isLoading ? 'Creating case...' : 'Start Intake'}
          </button>
        </form>
      </main>
    </div>
  );
}
