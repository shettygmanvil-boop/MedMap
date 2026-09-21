import React from 'react';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`error-message ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.65rem 0.85rem',
        marginBottom: '1rem',
        backgroundColor: '#fef2f2',
        border: '1.5px solid #ef4444',
        borderRadius: '6px',
        color: '#b91c1c',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.4,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0, marginTop: '2px' }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{message}</span>
    </div>
  );
};
