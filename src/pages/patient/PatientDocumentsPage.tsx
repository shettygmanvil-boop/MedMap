import { Link } from 'react-router-dom';

export function PatientDocumentsPage() {
  return (
    <div className="container">
      <header>
        <div className="logo">Document Upload</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Back to Home</Link>
          <Link to="/patient/verification">Next: Verification</Link>
        </nav>
      </header>
      <main>
        <h2>Upload Medical Documents</h2>
        <p>This is where the file upload area will go.</p>
      </main>
    </div>
  );
}
