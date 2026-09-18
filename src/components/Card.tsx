import React from 'react';

interface CardProps {
  title: string;
  description: string;
  highlightVerify?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, description, highlightVerify = false }) => {
  return (
    <div className={`card ${highlightVerify ? 'highlight-verify' : ''}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
