import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';

// Max file size: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp'
];

type DocumentStatus = 'idle' | 'selected' | 'processing' | 'success';

export function PatientDocumentsPage() {
  const { caseId } = useCase();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<DocumentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileExtension = (filename: string): string => {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    return ext;
  };

  const validateFile = (file: File): string | null => {
    const ext = getFileExtension(file.name);
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);
    const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!isMimeValid && !isExtValid) {
      return `Unsupported file format "${ext || 'unknown'}". Supported formats are: PDF, PNG, JPG, JPEG, and WEBP.`;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 10 MB. Please choose a smaller file.`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setStatus('idle');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
    setStatus('selected');
    setProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDropzoneClick = () => {
    if (status === 'idle' || status === 'selected') {
      fileInputRef.current?.click();
    }
  };

  const handleDropzoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && (status === 'idle' || status === 'selected')) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleStartProcessing = () => {
    if (!selectedFile) return;

    setStatus('processing');
    setProgress(0);
    setError(null);

    // Simulated deterministic timer steps (0% -> 35% -> 70% -> 100% over 1.8s)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 35;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setStatus('success');
      } else {
        setProgress(currentProgress);
      }
    }, 450);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setStatus('idle');
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileBadgeType = (filename: string): string => {
    const ext = getFileExtension(filename);
    if (ext === '.pdf') return 'PDF';
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 'IMG';
    return 'DOC';
  };

  return (
    <div className="container">
      <header>
        <div className="logo">Document Upload</div>
        <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/">Home</Link>
          <Link to="/patient/intake">Intake</Link>
          <Link to="/patient/verification">Next: Verification</Link>
        </nav>
      </header>

      <main className="doc-intake-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="doc-step-indicator">
            <span>Step 2 of 3</span> • <span>Patient Document Intake</span>
          </div>
          {caseId && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Active Case: <strong>{caseId}</strong>
            </div>
          )}
        </div>

        <section className="doc-upload-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
              Upload Medical Documents
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
              Upload your past lab reports, hospital discharge summaries, or diagnostic records to assist your doctor during your consultation.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="doc-alert doc-alert-error" role="alert" aria-live="assertive">
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <strong>Validation Error</strong>
                <div style={{ marginTop: '0.2rem' }}>{error}</div>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'inherit' }}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            id="medical-document-input"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            aria-label="Choose medical document file to upload"
          />

          {/* Upload Dropzone (idle or drag state) */}
          {(status === 'idle' || dragActive) && (
            <div
              className={`doc-dropzone ${dragActive ? 'drag-active' : ''}`}
              onClick={handleDropzoneClick}
              onKeyDown={handleDropzoneKeyDown}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex={0}
              role="button"
              aria-label="Medical document drag and drop area. Click or press Enter to select a file."
            >
              <div className="doc-dropzone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <div>
                <h3 className="doc-dropzone-title">
                  {dragActive ? 'Drop file here' : 'Upload Medical Documents'}
                </h3>
                <p className="doc-dropzone-desc" style={{ marginTop: '0.3rem' }}>
                  Drag & drop your file here, or click to browse your computer
                </p>
              </div>

              <div className="doc-supported-specs">
                Supported: PDF, JPG, PNG, WEBP • Max 10 MB
              </div>

              <button
                type="button"
                className="doc-btn doc-btn-primary"
                style={{ marginTop: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                📁 Choose File
              </button>
            </div>
          )}

          {/* Selected, Processing, or Success File View */}
          {selectedFile && status !== 'idle' && (
            <div className="doc-file-card">
              <div className="doc-file-header">
                <div className="doc-file-info">
                  <div className={`doc-file-icon ${getFileBadgeType(selectedFile.name).toLowerCase()}`}>
                    {getFileBadgeType(selectedFile.name)}
                  </div>
                  <div className="doc-file-details">
                    <h4>{selectedFile.name}</h4>
                    <div className="doc-file-meta">
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span>Type: {getFileExtension(selectedFile.name).toUpperCase().replace('.', '')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {status === 'selected' && (
                    <span className="doc-badge doc-badge-ready">
                      ● Ready to process
                    </span>
                  )}
                  {status === 'processing' && (
                    <span className="doc-badge doc-badge-processing">
                      <span className="spinner"></span> Processing ({progress}%)
                    </span>
                  )}
                  {status === 'success' && (
                    <span className="doc-badge doc-badge-success">
                      ✓ Document ready
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar during simulated processing */}
              {status === 'processing' && (
                <div className="doc-progress-container">
                  <div className="doc-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
              )}

              {/* Success Banner */}
              {status === 'success' && (
                <div className="doc-alert doc-alert-success" style={{ marginTop: '1.25rem', marginBottom: '0' }} role="status">
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <div>
                    <strong>Prototype Processing Complete</strong>
                    <div style={{ marginTop: '0.2rem', fontSize: '0.9rem' }}>
                      Document file structure was validated locally. No medical data extraction was performed.
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="doc-actions-row">
                {status === 'selected' && (
                  <>
                    <button
                      type="button"
                      className="doc-btn doc-btn-accent"
                      onClick={handleStartProcessing}
                    >
                      ⚙️ Process Document
                    </button>

                    <button
                      type="button"
                      className="doc-btn doc-btn-danger"
                      onClick={handleRemove}
                    >
                      🗑️ Remove File
                    </button>
                  </>
                )}

                {status === 'processing' && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                    Simulating document ingestion... Please wait.
                  </div>
                )}

                {status === 'success' && (
                  <>
                    <button
                      type="button"
                      className="doc-btn doc-btn-success"
                      onClick={() => navigate('/patient/verification')}
                    >
                      Next: Go to Verification ➔
                    </button>

                    <button
                      type="button"
                      className="doc-btn doc-btn-secondary"
                      onClick={handleRemove}
                    >
                      🔄 Upload Another Document
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Prototype Scope Note */}
          <div className="doc-prototype-notice">
            ℹ️ <strong>MedMap Prototype Notice:</strong> Document processing is simulated locally in this preview version. Real OCR extraction and backend file storage are intentionally disabled for Day-1 frontend intake demonstration.
          </div>
        </section>
      </main>
    </div>
  );
}

