import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_DOCTOR_CASES, calculateCaseCounts } from '../../components/doctor/mockCases';
import { DoctorCaseSummary, type CaseFilter } from '../../components/doctor/DoctorCaseSummary';
import { DoctorCaseFilters } from '../../components/doctor/DoctorCaseFilters';
import { DoctorCaseCard } from '../../components/doctor/DoctorCaseCard';
import '../../components/doctor/doctorDashboard.css';

export function DoctorCasesPage() {
  const [activeFilter, setActiveFilter] = useState<CaseFilter>('all');

  const counts = useMemo(() => calculateCaseCounts(MOCK_DOCTOR_CASES), []);

  const filteredCases = useMemo(() => {
    return MOCK_DOCTOR_CASES.filter((c) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'doctor_review') return c.status === 'doctor_review';
      if (activeFilter === 'in_progress') return c.status === 'intake' || c.status === 'patient_verifying';
      if (activeFilter === 'completed') return c.status === 'completed';
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="doctor-dashboard-container">
      {/* Top Header & Navigation */}
      <header className="doctor-header">
        <div className="doctor-top-bar">
          <div className="doctor-brand-group">
            <Link to="/" className="doctor-brand-title">
              MedMap
            </Link>
            <span className="doctor-portal-pill">Doctor Portal</span>
          </div>

          <nav className="doctor-nav-links" aria-label="Portal Navigation">
            <Link to="/" className="doctor-nav-link">
              ← Back to Home
            </Link>
          </nav>
        </div>

        <div className="doctor-page-heading-group">
          <div>
            <h1 className="doctor-page-title">Pre-Consultation Cases</h1>
            <p className="doctor-page-subtitle">
              Review AI-structured clinical briefs and patient-verified histories before consultation.
            </p>
          </div>
        </div>
      </header>

      {/* Demonstration Notice */}
      <div className="doctor-demo-banner" role="status" aria-live="polite">
        <span className="demo-banner-tag">Demo Mode</span>
        <span>
          Displaying synthetic pre-consultation cases for demonstration only. No real patient data or clinical triage scores are represented.
        </span>
      </div>

      <main>
        {/* Case Metrics Summary */}
        <DoctorCaseSummary
          counts={counts}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Filter Controls */}
        <DoctorCaseFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Cases Section */}
        <section className="doctor-cases-section" aria-labelledby="cases-list-heading">
          <div className="cases-section-header">
            <h2 id="cases-list-heading" className="cases-section-title">
              {activeFilter === 'all' && 'All Cases'}
              {activeFilter === 'doctor_review' && 'Awaiting Doctor Review'}
              {activeFilter === 'in_progress' && 'In Progress Cases'}
              {activeFilter === 'completed' && 'Completed Cases'}
            </h2>
            <span className="cases-count-label">
              Showing {filteredCases.length} of {MOCK_DOCTOR_CASES.length} cases
            </span>
          </div>

          {filteredCases.length > 0 ? (
            <div className="cases-list-grid">
              {filteredCases.map((caseItem) => (
                <DoctorCaseCard key={caseItem.caseId} caseItem={caseItem} />
              ))}
            </div>
          ) : (
            <div className="doctor-empty-state" role="region" aria-label="No cases found">
              <span className="empty-icon" aria-hidden="true">📋</span>
              <h3 className="empty-title">No Cases Found</h3>
              <p className="empty-desc">
                There are currently no cases matching the selected filter.
              </p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => setActiveFilter('all')}
              >
                Reset Filter to All Cases
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
