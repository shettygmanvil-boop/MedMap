import { Link } from 'react-router-dom';

export function DoctorCasesPage() {
  return (
    <div className="container">
      <header>
        <div className="logo">Doctor Case List</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Back to Home</Link>
        </nav>
      </header>
      <main>
        <h2>Pending Cases</h2>
        <ul>
          <li>
            <Link to="/doctor/cases/test-case-001">Review Test Case 001</Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
