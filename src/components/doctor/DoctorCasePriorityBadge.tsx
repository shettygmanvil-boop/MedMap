import React from 'react';
import type { DemoPresentationPriority } from './mockCases';

interface DoctorCasePriorityBadgeProps {
  priority: DemoPresentationPriority;
}

const PRIORITY_CONFIG: Record<DemoPresentationPriority, { label: string; className: string }> = {
  priority_review: {
    label: 'Priority Queue (Demo)',
    className: 'badge-priority-high',
  },
  routine: {
    label: 'Routine (Demo)',
    className: 'badge-priority-routine',
  },
  follow_up: {
    label: 'Follow-up (Demo)',
    className: 'badge-priority-followup',
  },
};

export const DoctorCasePriorityBadge: React.FC<DoctorCasePriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`doctor-priority-badge ${config.className}`}
      title="UI demo presentation order only — not a clinical medical urgency score."
    >
      {config.label}
    </span>
  );
};

