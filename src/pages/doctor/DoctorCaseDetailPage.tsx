import { Link, useParams } from 'react-router-dom';
import { getMockCaseDetail, MOCK_CASE_DETAILS } from '../../components/doctor/mockCaseDetails';
import { MOCK_DOCTOR_CASES } from '../../components/doctor/mockCases';
import { DoctorCaseStatusBadge } from '../../components/doctor/DoctorCaseStatusBadge';
import { DoctorCasePriorityBadge } from '../../components/doctor/DoctorCasePriorityBadge';
import { DoctorCaseTimeline } from '../../components/doctor/DoctorCaseTimeline';
import { DoctorEvidenceViewer } from '../../components/doctor/DoctorEvidenceViewer';
import { DoctorReviewAction } from '../../components/doctor/DoctorReviewAction';
import { DoctorSectionCard } from '../../components/doctor/DoctorSectionCard';
import '../../components/doctor/doctorDashboard.css';
import '../../components/doctor/doctorDetail.css';

export function DoctorCaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();

  const caseDetail = caseId ? getMockCaseDetail(caseId) : undefined;
  const summaryMeta = caseId ? MOCK_DOCTOR_CASES.find((c) => c.caseId === caseId) : undefined;

  // Unknown Case ID / Not-Found State
  if (!caseDetail) {
    const availableCaseIds = Object.keys(MOCK_CASE_DETAILS);
    return (
      <div className="doctor-detail-container">
        <nav className="detail-top-nav" aria-label="Not Found Navigation">
          <Link to="/doctor/cases" className="btn-back-link">
            ← Back to Cases Dashboard
          </Link>
        </nav>

        <div className="detail-not-found-card" role="region" aria-label="Case Not Found">
          <span className="not-found-icon" aria-hidden="true">🔍</span>
          <h1 className="not-found-title">Case Record Not Found</h1>
          <p className="not-found-desc">
            No demonstration case with identifier <code className="not-found-case-id">{caseId}</code> was
            found in the local fixture dataset.
          </p>

          <div className="available-demo-list">
            <h2 className="available-demo-title">Available Demonstration Cases:</h2>
            <div className="available-demo-links">
              {availableCaseIds.map((id) => (
                <Link key={id} to={`/doctor/cases/${id}`} className="available-demo-link">
                  {id}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/doctor/cases" className="btn-open-case">
            ← Return to Cases Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { demographics, history, medications, allergies, investigations, documentsFindings, timeline, highlights, missingInformation, evidence, patientVerificationStatus, doctorReview } = caseDetail;

  const patientDisplayName = demographics?.['Full Name'] || summaryMeta?.patientDisplayName || `Patient ${caseDetail.patientId}`;

  const renderVerificationBadge = (status: 'verified' | 'pending' | 'flagged') => {
    switch (status) {
      case 'verified':
        return (
          <span className="verification-badge verified" title="Patient confirmed compiled clinical brief">
            ✓ Patient Verified
          </span>
        );
      case 'flagged':
        return (
          <span className="verification-badge flagged" title="Patient indicated discrepancies during verification">
            ⚠ Patient Flagged
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="verification-badge pending" title="Patient verification is pending">
            ⏳ Verification Pending
          </span>
        );
    }
  };

  const hasHistorySections =
    (history.historyOfPresentIllness && history.historyOfPresentIllness.length > 0) ||
    (history.pastMedicalHistory && history.pastMedicalHistory.length > 0) ||
    (history.pastSurgicalHistory && history.pastSurgicalHistory.length > 0) ||
    (history.familyHistory && history.familyHistory.length > 0) ||
    (history.personalHistory && history.personalHistory.length > 0) ||
    (history.reviewOfSystems && history.reviewOfSystems.length > 0) ||
    (history.previousInvestigations && history.previousInvestigations.length > 0);

  const hasMedsOrAllergies = (medications && medications.length > 0) || (allergies && allergies.length > 0);
  const hasInvestigations = (investigations && investigations.length > 0) || (documentsFindings && documentsFindings.length > 0);

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

        <div className="doctor-demo-banner" style={{ margin: 0, padding: '0.35rem 0.75rem' }}>
          <span className="demo-banner-tag">Demo Mode</span>
          <span>Synthetic Pre-Consultation Record</span>
        </div>
      </nav>

      {/* Case Overview & Demographics Header */}
      <header className="detail-case-header">
        <div className="detail-header-top">
          <div className="detail-patient-title-group">
            <h1 className="detail-patient-name">{patientDisplayName}</h1>
            <span className="detail-patient-sub">
              Patient Identifier: <strong>{caseDetail.patientId}</strong>
            </span>
          </div>

          <div className="detail-badges-group">
            {summaryMeta && <DoctorCasePriorityBadge priority={summaryMeta.demoPriority} />}
            {summaryMeta && <DoctorCaseStatusBadge status={summaryMeta.status} />}
            {renderVerificationBadge(patientVerificationStatus)}
          </div>
        </div>

        {/* Demographics Grid */}
        {demographics && Object.keys(demographics).length > 0 && (
          <div className="detail-demographics-grid">
            {Object.entries(demographics).map(([key, val]) => (
              <div key={key} className="demo-item">
                <span className="demo-item-label">{key}</span>
                <span className="demo-item-val">{val}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Main Two-Column Layout */}
      <main className="detail-main-layout">
        {/* Left Column: Structured Clinical Content */}
        <div className="detail-content-column">
          {/* Chief Complaint */}
          {history.chiefComplaint && (
            <DoctorSectionCard title="Chief Complaint & Reason for Visit" tag="Intake Focus">
              <div className="chief-complaint-box">
                <h3 className="complaint-heading">Reported by Patient</h3>
                <p className="complaint-text">{history.chiefComplaint}</p>
              </div>
            </DoctorSectionCard>
          )}

          {/* Highlights & Missing Information */}
          {((highlights && highlights.length > 0) || (missingInformation && missingInformation.length > 0)) && (
            <DoctorSectionCard title="Brief Highlights & Missing Items" tag="Pre-Consult Brief">
              {highlights && highlights.length > 0 && (
                <div className="alert-box highlights">
                  <div className="alert-box-title">
                    <span aria-hidden="true">★</span> Key Brief Highlights:
                  </div>
                  <ul>
                    {highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {missingInformation && missingInformation.length > 0 && (
                <div className="alert-box missing">
                  <div className="alert-box-title">
                    <span aria-hidden="true">⚠</span> Missing / Pending Information:
                  </div>
                  <ul>
                    {missingInformation.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </DoctorSectionCard>
          )}

          {/* Structured Clinical History */}
          {hasHistorySections && (
            <DoctorSectionCard title="Structured Clinical History" tag="AI Structured">
              {history.historyOfPresentIllness && history.historyOfPresentIllness.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">History of Present Illness</h3>
                  <ul className="clinical-list">
                    {history.historyOfPresentIllness.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {history.pastMedicalHistory && history.pastMedicalHistory.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Past Medical History</h3>
                  <ul className="clinical-list">
                    {history.pastMedicalHistory.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {history.pastSurgicalHistory && history.pastSurgicalHistory.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Past Surgical History</h3>
                  <ul className="clinical-list">
                    {history.pastSurgicalHistory.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {history.familyHistory && history.familyHistory.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Family History</h3>
                  <ul className="clinical-list">
                    {history.familyHistory.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {history.personalHistory && history.personalHistory.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Personal & Social History</h3>
                  <ul className="clinical-list">
                    {history.personalHistory.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {history.reviewOfSystems && history.reviewOfSystems.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Review of Systems (Pre-Consultation Questionnaire)</h3>
                  <ul className="clinical-list">
                    {history.reviewOfSystems.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </DoctorSectionCard>
          )}

          {/* Medications & Allergies */}
          {hasMedsOrAllergies && (
            <DoctorSectionCard title="Medications & Known Allergies" tag="Patient Verified">
              {allergies && allergies.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Reported Allergies</h3>
                  <div className="clinical-tags-group">
                    {allergies.map((item, i) => (
                      <span key={i} className="clinical-tag allergy">
                        ⚠ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {medications && medications.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Current Reported Medications</h3>
                  <div className="clinical-tags-group">
                    {medications.map((item, i) => (
                      <span key={i} className="clinical-tag med">
                        💊 {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </DoctorSectionCard>
          )}

          {/* Investigations & Documents */}
          {hasInvestigations && (
            <DoctorSectionCard title="Uploaded Documents & Prior Investigations" tag="Attachments">
              {investigations && investigations.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Attached Clinic Documents</h3>
                  <ul className="clinical-list">
                    {investigations.map((item, i) => (
                      <li key={i} className="clinical-list-item">📄 {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {documentsFindings && documentsFindings.length > 0 && (
                <div className="history-subsection">
                  <h3 className="history-subheading">Extracted Findings Summary</h3>
                  <ul className="clinical-list">
                    {documentsFindings.map((item, i) => (
                      <li key={i} className="clinical-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </DoctorSectionCard>
          )}

          {/* Chronological Timeline */}
          {timeline && timeline.length > 0 && (
            <DoctorSectionCard title="Chronological Clinical Timeline" tag="Chronology">
              <DoctorCaseTimeline timeline={timeline} />
            </DoctorSectionCard>
          )}

          {/* Source Evidence & Provenance */}
          {evidence && Object.keys(evidence).length > 0 && (
            <DoctorSectionCard title="Source Evidence & Provenance" tag="Traceability">
              <DoctorEvidenceViewer evidenceMap={evidence} />
            </DoctorSectionCard>
          )}
        </div>

        {/* Right Column: Physician Review Panel & Sidebar Summary */}
        <aside className="detail-sidebar-column" aria-label="Physician Actions and Metadata">
          {/* Interactive Doctor Review Component */}
          <DoctorReviewAction initialReview={doctorReview} caseId={caseDetail.caseId} />

          {/* Case Metadata Panel */}
          <div className="clinical-section-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', margin: '0 0 0.75rem' }}>
              Case Metadata
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Case ID:</strong> {caseDetail.caseId}
              </div>
              <div>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Patient ID:</strong> {caseDetail.patientId}
              </div>
              {summaryMeta && (
                <>
                  <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Created:</strong>{' '}
                    {new Date(summaryMeta.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Updated:</strong>{' '}
                    {new Date(summaryMeta.updatedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Documents Attached:</strong>{' '}
                    {summaryMeta.documentsCount}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
