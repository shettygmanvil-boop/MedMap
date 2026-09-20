import { Link, useParams } from 'react-router-dom';

export function DoctorCaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();

  return (
    <div className="container">
      <header>
        <div className="logo">Doctor Case Detail</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Back to Home</Link>
          <Link to="/doctor/cases">Back to Cases List</Link>
        </nav>
      </header>
      <main>
        <h2>Reviewing Case: {caseId}</h2>
        <p>This is where the doctor will review the Unified Case details.</p>
      </main>
    </div>
  );
}
