import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import { getCase } from '../../utils/api';
import type { ClinicalCase } from '../../types/case';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { StatusBadge } from '../../components/StatusBadge';
import { INTAKE_QUESTIONS } from '../../data/intakeQuestions';
import './PatientIntakePage.css';

export function PatientIntakePage() {
  const { caseId } = useCase();
  const navigate = useNavigate();

  // ── Case loading state ────────────────────────────────────────────────
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Intake questionnaire state ────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isComplete = currentIndex >= INTAKE_QUESTIONS.length;
  const currentQuestion = isComplete ? null : INTAKE_QUESTIONS[currentIndex];

  // ── Load case on mount ────────────────────────────────────────────────
  const loadCase = useCallback(async () => {
    if (!caseId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCase(caseId);
      setClinicalCase(data);
    } catch {
      setError("We couldn't load your case. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (!caseId) {
      navigate('/patient');
      return;
    }
    loadCase();
  }, [caseId, navigate, loadCase]);

  // ── Focus input on question change ────────────────────────────────────
  useEffect(() => {
    if (!isLoading && !error && !isComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isLoading, error, isComplete]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: currentAnswer }));
    setCurrentAnswer('');
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: '' }));
    setCurrentAnswer('');
    setCurrentIndex((prev) => prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter to submit on single-line text inputs (not textarea)
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      currentQuestion?.inputType === 'text' &&
      currentAnswer.trim().length > 0
    ) {
      e.preventDefault();
      handleContinue();
    }
  };

  // ── Redirect if no caseId ─────────────────────────────────────────────
  if (!caseId) return null;

  // ── Loading state ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container">
        <div className="intake-page">
          <LoadingIndicator message="Loading your intake…" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error || !clinicalCase) {
    return (
      <div className="container">
        <div className="intake-page">
          <div className="intake-error-card" role="alert">
            <h2>Something went wrong</h2>
            <ErrorMessage message={error || 'Case not found.'} />
            <div className="intake-error-actions">
              <Button
                variant="primary"
                onClick={loadCase}
              >
                Try Again
              </Button>
              <Link to="/" className="intake-btn intake-btn-skip">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion state ──────────────────────────────────────────────────
  if (isComplete) {
    return (
      <div className="container">
        <div className="intake-page">
          <div className="intake-header">
            <h1>Medical History</h1>
            <p className="intake-case-id">Case {clinicalCase.caseId}</p>
          </div>

          <div className="intake-complete-card">
            <div className="intake-complete-icon" aria-hidden="true">✓</div>
            <h2>Intake Complete</h2>
            <p>
              Your medical history has been recorded. You can now proceed
              to upload any supporting medical documents.
            </p>
            <Link
              to="/patient/documents"
              className="intake-btn-complete"
              id="intake-continue-documents"
            >
              Continue to Documents →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Questioning state ─────────────────────────────────────────────────
  // Guard: TypeScript cannot narrow through the `isComplete` boolean, so
  // we check `currentQuestion` directly.
  if (!currentQuestion) return null;

  const progressPercent = (currentIndex / INTAKE_QUESTIONS.length) * 100;

  return (
    <div className="container">
      <div className="intake-page">
        {/* Back link */}
        <Link to="/" className="intake-back-link">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="intake-header">
          <h1>Medical History</h1>
          <p className="intake-case-id" style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>Case {clinicalCase.caseId} <StatusBadge status={clinicalCase.status} /></p>
        </div>

        {/* Progress bar */}
        <div className="intake-progress">
          <div className="intake-progress-header">
            <span className="intake-progress-label">
              {currentQuestion.category}
            </span>
            <span className="intake-progress-count">
              {currentIndex + 1} of {INTAKE_QUESTIONS.length}
            </span>
          </div>
          <div
            className="intake-progress-track"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={0}
            aria-valuemax={INTAKE_QUESTIONS.length}
            aria-label="Intake progress"
          >
            <div
              className="intake-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="intake-question-card" key={currentQuestion.id}>
          <h2 className="intake-question-category">
            {currentQuestion.category}
          </h2>
          <p className="intake-question-prompt">{currentQuestion.prompt}</p>
          {currentQuestion.helperText && (
            <p className="intake-question-helper" id={`helper-${currentQuestion.id}`}>
              {currentQuestion.helperText}
            </p>
          )}

          {currentQuestion.inputType === 'textarea' ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              id={`intake-${currentQuestion.id}`}
              className="intake-textarea"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              aria-describedby={
                currentQuestion.helperText
                  ? `helper-${currentQuestion.id}`
                  : undefined
              }
              aria-label={currentQuestion.prompt}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              id={`intake-${currentQuestion.id}`}
              className="intake-input"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion.placeholder}
              aria-describedby={
                currentQuestion.helperText
                  ? `helper-${currentQuestion.id}`
                  : undefined
              }
              aria-label={currentQuestion.prompt}
            />
          )}

          <div className="intake-actions">
            <Button variant="outline" onClick={handleSkip} className="intake-btn intake-btn-skip">Skip this question</Button>
            <Button variant="primary" onClick={handleContinue} disabled={currentAnswer.trim().length === 0} id="intake-btn-continue" className="intake-btn intake-btn-continue">Continue →</Button>
          </div>
        </div>

        {/* Answered summary */}
        <ul className="intake-summary" aria-label="Question progress">
          {INTAKE_QUESTIONS.map((q, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <li key={q.id} className="intake-summary-item">
                <span
                  className={`intake-summary-icon ${
                    isDone
                      ? 'intake-summary-icon--done'
                      : isCurrent
                        ? 'intake-summary-icon--current'
                        : 'intake-summary-icon--pending'
                  }`}
                  aria-hidden="true"
                >
                  {isDone ? '✓' : isCurrent ? '·' : ''}
                </span>
                <span
                  className={isCurrent ? 'intake-summary-label--current' : ''}
                >
                  {q.category}
                  {isDone && answers[q.id] === '' && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', opacity: 0.6 }}>
                      (skipped)
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

