import { Link } from 'react-router-dom';

export function PatientVerificationPage() {
  return (
    <div className="container">
      <header>
        <div className="logo">Patient Verification</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Back to Home</Link>
          <Link to="/doctor/cases">Go to Doctor Dashboard</Link>
        </nav>
      </header>
      <main>
        <h2>Verify Your Information</h2>
        <p>This is where the patient will review the Unified Case.</p>
      </main>
    </div>
  );
}
