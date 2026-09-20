import React from 'react';
import type { TimelineEvent } from '../../types/unifiedCase';

interface DoctorCaseTimelineProps {
  timeline?: TimelineEvent[];
}

export const DoctorCaseTimeline: React.FC<DoctorCaseTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="section-empty-notice">
        <span>No chronological timeline events recorded for this case.</span>
      </div>
    );
  }

  return (
    <div className="timeline-container" role="feed" aria-label="Clinical Timeline Events">
      {timeline.map((event, index) => (
        <div key={`${event.date}-${index}`} className="timeline-item">
          <div className="timeline-marker" aria-hidden="true">
            <span className="timeline-dot" />
            {index < timeline.length - 1 && <span className="timeline-line" />}
          </div>

          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-date">{event.date}</span>
              <span className="timeline-badge">{event.eventType}</span>
            </div>

            <p className="timeline-desc">{event.description}</p>

            {event.evidenceIds && event.evidenceIds.length > 0 && (
              <div className="timeline-evidence-links">
                <span className="evidence-link-label">Linked Evidence:</span>
                {event.evidenceIds.map((id) => (
                  <span key={id} className="evidence-pill-tag">
                    #{id}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

