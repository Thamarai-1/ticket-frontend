import React, { useState } from 'react';
import { classifyTicket } from '../services/api';

const SAMPLE_TEMPLATES = [
  {
    name: 'VPN Disconnect',
    title: 'Unable to connect to corporate VPN with Error 800',
    description: 'User enters credentials and completes MFA, but GlobalProtect VPN disconnects immediately with Error 800 on gateway 10.240.0.1.',
    service: 'Corporate VPN'
  },
  {
    name: 'Account Lockout',
    title: 'User account locked out after multiple failed logon attempts',
    description: 'Active Directory account jdoe@corp.com is locked out with Event ID 4625 originating from workstation WS-1049.',
    service: 'Active Directory Domain Services'
  },
  {
    name: '502 Bad Gateway',
    title: 'Production API gateway returning HTTP 502 Bad Gateway to clients',
    description: 'Nginx reverse proxy web-gw-prod01 returning HTTP 502. Upstream Node.js process crashed on socket 127.0.0.1:8080 due to memory exhaustion.',
    service: 'Linux Application Cluster'
  },
  {
    name: 'Docking Station Flicker',
    title: 'Dual 4K monitors flickering via Thunderbolt WD19TBS dock',
    description: 'External Dell displays turn black intermittently when opening GPU heavy apps. DisplayPort cables seated properly.',
    service: 'End User Computing'
  },
  {
    name: 'Unfamiliar / OOD Query',
    title: 'Quantum blockchain cryptocurrency ledger mining crash',
    description: 'Xyzzyspoon hash collision on unallocated node 999999.',
    service: 'Unknown'
  }
];

export default function TicketClassifier() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedService, setAffectedService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleClassify = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a ticket title and a symptom description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await classifyTicket({
        title: title.trim(),
        description: description.trim(),
        affected_service: affectedService.trim() || null
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else if (response.fallback) {
        setResult(response.fallback);
        setError(`ML Service Fallback: ${response.error || 'ML service temporarily unavailable'}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to communicate with classification backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setTitle(sample.title);
    setDescription(sample.description);
    setAffectedService(sample.service);
    setResult(null);
    setError(null);
  };

  const getConfidenceBarColor = (score, reviewRequired) => {
    if (reviewRequired) return 'var(--danger)';
    if (score >= 0.80) return 'var(--success)';
    if (score >= 0.60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>AI Ticket Classification Engine</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Real-time category prediction and confidence scoring powered by Scikit-learn TF-IDF + Logistic Regression.
        </p>
      </div>

      {/* Preset Quick Load Buttons */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Quick Scenarios:
        </span>
        {SAMPLE_TEMPLATES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            onClick={() => handleLoadSample(sample)}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Submission Form */}
      <div className="filter-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleClassify}>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Ticket Title *</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Unable to connect to corporate VPN"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Symptom Description *</label>
            <textarea
              className="text-input"
              rows={4}
              placeholder="Describe user symptoms, error codes (e.g. 0x80070005, Event ID 4625), server hostnames, or log snippets..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="input-label">Affected Service (Optional)</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g. Corporate VPN, Active Directory, Print Server Services..."
              value={affectedService}
              onChange={(e) => setAffectedService(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Fields required for inference. Post-resolution fields are strictly prohibited from inputs.
            </div>
            <button
              type="submit"
              className="btn-secondary"
              style={{
                background: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 600,
                padding: '0.65rem 1.5rem',
                border: 'none'
              }}
              disabled={loading}
            >
              {loading ? 'Classifying via FastAPI...' : 'Analyze & Classify Ticket'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
          <strong>Notice: </strong> {error}
        </div>
      )}

      {/* Classification Result Card */}
      {result && (
        <div className="filter-card" style={{ borderColor: result.review_required ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <span className="brand-badge" style={{ marginRight: '0.5rem' }}>
                Classification Result
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Model: {result.model_version} | Taxonomy: {result.taxonomy_version}
              </span>
            </div>
            {result.inference_latency_ms && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ⚡ {result.inference_latency_ms} ms
              </span>
            )}
          </div>

          {/* Primary Category & Subcategory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Predicted Category</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: result.classification?.category ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {result.classification?.category || 'Unassigned / Needs Review'}
              </div>
            </div>

            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Resolved Subcategory</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: result.classification?.subcategory ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                {result.classification?.subcategory || 'None (Triage Rule Unmatched)'}
              </div>
            </div>

            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Priority & Intent</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Priority: <span style={{ color: 'var(--text-muted)' }}>{result.classification?.priority || 'Pending Triage'}</span>
                <br />
                Intent: <span style={{ color: 'var(--text-muted)' }}>{result.classification?.intent || 'Pending Triage'}</span>
              </div>
            </div>
          </div>

          {/* Confidence Score Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Probability Confidence ({result.confidence?.score_type})
              </span>
              <span style={{ fontWeight: 700, color: getConfidenceBarColor(result.confidence?.category_score, result.review_required) }}>
                {(result.confidence?.category_score * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, result.confidence?.category_score * 100))}%`,
                  height: '100%',
                  background: getConfidenceBarColor(result.confidence?.category_score, result.review_required),
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Calibrated: {result.confidence?.calibrated ? 'Yes' : 'No (Raw Softmax Probability)'} | Threshold: 60.0%
            </div>
          </div>

          {/* Review Required Warning */}
          {result.review_required && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                fontSize: '0.85rem',
                color: '#fca5a5'
              }}
            >
              <strong>⚠️ Human Review Required: </strong>
              {result.review_reason || 'Confidence fell below operational safety threshold.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
