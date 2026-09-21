import React from 'react';
import type { Evidence } from '../../types/trust';

interface DoctorEvidenceViewerProps {
  evidenceMap?: Record<string, Evidence>;
}

export const DoctorEvidenceViewer: React.FC<DoctorEvidenceViewerProps> = ({ evidenceMap }) => {
  if (!evidenceMap || Object.keys(evidenceMap).length === 0) {
    return (
      <div className="section-empty-notice">
        <span>No linked source evidence recorded for this case.</span>
      </div>
    );
  }

  const items = Object.values(evidenceMap);

  return (
    <div className="evidence-list" role="list" aria-label="Extracted Source Evidence">
      <div className="evidence-demo-note">
        <span>Demo Provenance: Links structured clinical brief statements back to their raw conversational or document inputs.</span>
      </div>

      {items.map((ev) => (
        <div key={ev.evidenceId} className="evidence-card" role="listitem">
          <div className="evidence-card-top">
            <span className="evidence-id-tag">#{ev.evidenceId}</span>
            <span className={`evidence-source-type ${ev.sourceType}`}>
              {ev.sourceType === 'document' ? '📄 Uploaded Document' : '🎙 Conversational Intake'}
            </span>
            <span className="evidence-source-id">Source: {ev.sourceId}</span>
          </div>

          {ev.extractedContent && (
            <blockquote className="evidence-quote">
              &ldquo;{ev.extractedContent}&rdquo;
            </blockquote>
          )}

          {ev.location && (
            <div className="evidence-location">
              <span className="loc-label">Location Reference:</span> {ev.location}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

