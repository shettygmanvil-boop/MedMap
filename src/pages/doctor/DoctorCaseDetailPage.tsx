import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DoctorCaseStatusBadge } from '../../components/doctor/DoctorCaseStatusBadge';
import { DoctorSectionCard } from '../../components/doctor/DoctorSectionCard';
import { getCase, getCaseDocuments } from '../../utils/api';
import type { ClinicalCase } from '../../types/case';
import { ErrorMessage } from '../../components/ErrorMessage';
import '../../components/doctor/doctorDashboard.css';
import '../../components/doctor/doctorDetail.css';

export function DoctorCaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseDetail, setCaseDetail] = useState<ClinicalCase | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      setError('Invalid Case ID');
      setLoading(false);
      return;
    }

    const fetchCase = async () => {
      try {
        const [data, docs] = await Promise.all([
          getCase(caseId),
          getCaseDocuments(caseId).catch(() => []) // Fallback to empty array if docs fail
        ]);
        setCaseDetail(data);
        setDocuments(docs);
      } catch (err: any) {
        setError(err.message || 'Case Record Not Found');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (loading) {
    return (
      <div className="doctor-detail-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="spinner" style={{ borderTopColor: 'var(--color-primary)' }}></span>
        <h3 style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading Case...</h3>
      </div>
    );
  }

  if (error || !caseDetail) {
    return (
      <div className="doctor-detail-container">
        <nav className="detail-top-nav" aria-label="Not Found Navigation">
          <Link to="/doctor/cases" className="btn-back-link">
            ← Back to Cases Dashboard
          </Link>
        </nav>
        
        {error && error !== 'Case Record Not Found' && (
          <div style={{ padding: '0 2rem' }}>
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <div className="detail-not-found-card" role="region" aria-label="Case Not Found">
          <span className="not-found-icon" aria-hidden="true">🔍</span>
          <h1 className="not-found-title">Case Record Not Found</h1>
          <p className="not-found-desc">{error || 'The requested case could not be loaded or does not exist.'}</p>
          <Link to="/doctor/cases" className="btn-open-case">
            ← Return to Cases Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const renderVerificationBadge = (status: string) => {
    switch (status) {
      case 'patient_verifying':
        return (
          <span className="verification-badge pending" title="Patient verification is pending">
            ⏳ Verification Pending
          </span>
        );
      case 'doctor_review':
      case 'completed':
        return (
          <span className="verification-badge verified" title="Patient confirmed compiled clinical brief">
            ✓ Patient Verified
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="doctor-detail-container">
      {/* Top Navigation Bar */}
      <nav className="detail-top-nav" aria-label="Case Breadcrumbs">
        <div className="detail-nav-left">
          <Link to="/doctor/cases" className="btn-back-link">
            ← Back to Cases List
          </Link>
          <span className="detail-case-badge">{caseDetail.caseId}</span>
        </div>
      </nav>

      {/* Case Overview & Demographics Header */}
      <header className="detail-case-header">
        <div className="detail-header-top">
          <div className="detail-patient-title-group">
            <h1 className="detail-patient-name">Patient {caseDetail.patientId}</h1>
            <span className="detail-patient-sub">
              Patient Identifier: <strong>{caseDetail.patientId}</strong>
            </span>
          </div>

          <div className="detail-badges-group">
            <DoctorCaseStatusBadge status={caseDetail.status} />
            {renderVerificationBadge(caseDetail.status)}
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="detail-demographics-grid">
          {caseDetail.language && (
            <div className="demo-item">
              <span className="demo-item-label">Language</span>
              <span className="demo-item-val">{caseDetail.language}</span>
            </div>
          )}
          <div className="demo-item">
            <span className="demo-item-label">Consent Granted</span>
            <span className="demo-item-val">{caseDetail.consentGranted ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="detail-main-layout">
        {/* Left Column: Structured Clinical Content */}
        <div className="detail-content-column">
          {caseDetail.intakeAnswers && Object.keys(caseDetail.intakeAnswers).length > 0 ? (
            <DoctorSectionCard title="Patient Intake Responses" tag="Self-Reported">
              <div className="history-subsection">
                {Object.entries(caseDetail.intakeAnswers).map(([question, answer], i) => (
                  <div key={i} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <h3 className="history-subheading" style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>{question}</h3>
                    <p className="clinical-list-item" style={{ margin: 0 }}>{answer}</p>
                  </div>
                ))}
              </div>
            </DoctorSectionCard>
          ) : (
            <div className="doctor-empty-state" style={{ marginTop: 0 }}>
              <span className="empty-icon">📝</span>
              <h3 className="empty-title">No Intake Responses</h3>
              <p className="empty-desc">The patient has not completed the intake questionnaire.</p>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <DoctorSectionCard title="Uploaded Documents" tag={`${documents.length} Files`}>
              {documents.length > 0 ? (
                <div className="history-subsection">
                  {documents.map((doc, i) => (
                    <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < documents.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>📄</span>
                        <h3 className="history-subheading" style={{ margin: 0, fontWeight: 600 }}>{doc.filename}</h3>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginLeft: '1.7rem' }}>
                        <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span> • 
                        <span style={{ marginLeft: '0.5rem' }}>{doc.mimeType}</span> • 
                        <span style={{ marginLeft: '0.5rem' }}>Uploaded: {new Date(doc.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="doctor-empty-state" style={{ margin: '1rem 0' }}>
                  <span className="empty-icon">📂</span>
                  <h3 className="empty-title">No Documents Uploaded</h3>
                  <p className="empty-desc">The patient has not provided any supporting medical files.</p>
                </div>
              )}
            </DoctorSectionCard>
          </div>
        </div>

        {/* Right Column: Physician Review Panel & Sidebar Summary */}
        <aside className="detail-sidebar-column" aria-label="Physician Actions and Metadata">
          {/* Case Metadata Panel */}
          <div className="clinical-section-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', margin: '0 0 0.75rem' }}>
              Case Metadata
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Case ID:</strong> {caseDetail.caseId}
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Patient ID:</strong> {caseDetail.patientId}
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Created:</strong>{' '}
                {new Date(caseDetail.createdAt).toLocaleString()}
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Last Updated:</strong>{' '}
                {new Date(caseDetail.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
