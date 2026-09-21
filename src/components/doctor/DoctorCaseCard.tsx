import React from 'react';
import { Link } from 'react-router-dom';
import type { DoctorCaseSummaryItem } from './mockCases';
import { DoctorCaseStatusBadge } from './DoctorCaseStatusBadge';
import { DoctorCasePriorityBadge } from './DoctorCasePriorityBadge';

interface DoctorCaseCardProps {
  caseItem: DoctorCaseSummaryItem;
}

export const DoctorCaseCard: React.FC<DoctorCaseCardProps> = ({ caseItem }) => {
  const formattedDate = new Date(caseItem.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <article className="doctor-case-card" aria-labelledby={`case-title-${caseItem.caseId}`}>
      <div className="case-card-header">
        <div className="case-id-group">
          <span className="case-id-tag">{caseItem.caseId}</span>
          <h3 id={`case-title-${caseItem.caseId}`} className="case-patient-name">
            {caseItem.patientDisplayName}
          </h3>
        </div>
        <div className="case-badges">
          <DoctorCasePriorityBadge priority={caseItem.demoPriority} />
          <DoctorCaseStatusBadge status={caseItem.status} />
        </div>
      </div>

      <div className="case-demographics">
        <span>Age: {caseItem.age}</span>
        <span className="separator">•</span>
        <span>Gender: {caseItem.gender}</span>
        <span className="separator">•</span>
        <span>Language: {caseItem.preferredLanguage}</span>
        <span className="separator">•</span>
        <span>ID: {caseItem.patientId}</span>
      </div>

      <p className="case-summary-text">{caseItem.intakeSummary}</p>

      <div className="case-meta-row">
        <div className="case-meta-indicators">
          {caseItem.hasPatientVerified ? (
            <span className="meta-pill verified" title="Patient reviewed compiled information">
              <span aria-hidden="true">✓</span> Patient Verified
            </span>
          ) : (
            <span className="meta-pill unverified" title="Patient has not yet verified">
              Pending Verification
            </span>
          )}

          {caseItem.documentsCount > 0 && (
            <span className="meta-pill docs">
              {caseItem.documentsCount} {caseItem.documentsCount === 1 ? 'Doc' : 'Docs'} Uploaded
            </span>
          )}

          <span className="meta-date" title="Last Updated">
            Updated: {formattedDate}
          </span>
        </div>

        <div className="case-actions">
          <Link
            to={`/doctor/cases/${caseItem.caseId}`}
            className="btn-open-case"
            aria-label={`Open pre-consultation brief for case ${caseItem.caseId}, patient ${caseItem.patientDisplayName}`}
          >
            Open Case Brief →
          </Link>
        </div>
      </div>
    </article>
  );
};

