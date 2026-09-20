import React, { useState } from 'react';
import type { DoctorReviewStatus } from '../../types/trust';
import type { DoctorReview } from '../../types/unifiedCase';

interface DoctorReviewActionProps {
  initialReview: DoctorReview;
  caseId: string;
}

export const DoctorReviewAction: React.FC<DoctorReviewActionProps> = ({ initialReview }) => {
  const [reviewStatus, setReviewStatus] = useState<DoctorReviewStatus>(initialReview.status);
  const [reviewNotes, setReviewNotes] = useState<string>(initialReview.notes || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAction = (status: DoctorReviewStatus) => {
    setReviewStatus(status);
    const labelMap: Record<DoctorReviewStatus, string> = {
      accepted: 'Accepted',
      modified: 'Modified',
      rejected: 'Rejected',
      pending: 'Pending',
    };
    setFeedbackMessage(
      `Demo action recorded: Pre-consultation brief marked as "${labelMap[status]}". (Note: Local demonstration state only — no changes are written to the backend database).`
    );
  };

  const getStatusBadge = (status: DoctorReviewStatus) => {
    switch (status) {
      case 'accepted':
        return <span className="review-status-badge accepted">✓ Brief Accepted</span>;
      case 'modified':
        return <span className="review-status-badge modified">✎ Marked for Modification</span>;
      case 'rejected':
        return <span className="review-status-badge rejected">✗ Brief Rejected</span>;
      case 'pending':
      default:
        return <span className="review-status-badge pending">⏳ Pending Physician Review</span>;
    }
  };

  return (
    <section className="doctor-review-panel" aria-labelledby="doctor-review-heading">
      <div className="review-panel-header">
        <h2 id="doctor-review-heading" className="review-panel-title">
          Physician Case Review
        </h2>
        {getStatusBadge(reviewStatus)}
      </div>

      <p className="review-panel-desc">
        Review the AI-compiled pre-consultation brief and patient-verified history. Confirm if
        the structured brief is accepted for clinical consultation.
      </p>

      {/* Explicit Demo Notice */}
      <div className="review-demo-disclaimer" role="note">
        <strong>Demonstration UI Only:</strong> Actions here update local component state only and do not write to a clinical database or backend API.
      </div>

      <div className="review-form-group">
        <label htmlFor="doctor-review-notes" className="review-notes-label">
          Clinical Review Notes (Optional / Demo):
        </label>
        <textarea
          id="doctor-review-notes"
          className="review-notes-input"
          rows={3}
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Add optional notes regarding brief accuracy, missing records, or consultation focus areas..."
        />
      </div>

      <div className="review-actions-group" role="group" aria-label="Review Decision Actions">
        <button
          type="button"
          className={`btn-decision accept ${reviewStatus === 'accepted' ? 'active' : ''}`}
          onClick={() => handleAction('accepted')}
        >
          ✓ Accept Brief
        </button>

        <button
          type="button"
          className={`btn-decision modify ${reviewStatus === 'modified' ? 'active' : ''}`}
          onClick={() => handleAction('modified')}
        >
          ✎ Request Modifications
        </button>

        <button
          type="button"
          className={`btn-decision reject ${reviewStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => handleAction('rejected')}
        >
          ✗ Reject Brief
        </button>

        {reviewStatus !== 'pending' && (
          <button
            type="button"
            className="btn-decision reset"
            onClick={() => handleAction('pending')}
          >
            Reset to Pending
          </button>
        )}
      </div>

      {feedbackMessage && (
        <div className="review-feedback-banner" role="status" aria-live="polite">
          <span className="feedback-icon" aria-hidden="true">ℹ</span>
          <span>{feedbackMessage}</span>
        </div>
      )}
    </section>
  );
};

