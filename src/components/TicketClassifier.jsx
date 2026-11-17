import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  Tags,
  CheckCircle2,
  Info
} from 'lucide-react';
import { classifyTicket } from '../services/api';

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
        setError(`Service Fallback: ${response.error || 'Classification service temporarily unavailable'}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to communicate with classification backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#09090b' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#09090b' }}>
          Ticket Classification Engine
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          Real-time category prediction and calibrated probability scoring powered by TF-IDF and Logistic Regression.
        </p>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Fields required for inference. Post-resolution fields are strictly prohibited from inputs.
            </div>
            <button
              type="submit"
              className="btn-secondary"
              style={{
                background: '#09090b',
                color: '#ffffff',
                fontWeight: 600,
                padding: '0.6rem 1.4rem',
                border: '1px solid #09090b',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}
              disabled={loading}
            >
              <Sparkles size={14} />
              <span>{loading ? 'Classifying...' : 'Classify Ticket'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertTriangle size={15} />
          <span><strong>Notice:</strong> {error}</span>
        </div>
      )}

      {/* Classification Result Card */}
      {result && (
        <div className="filter-card" style={{ borderColor: result.review_required ? '#09090b' : 'var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-badge" style={{ background: '#09090b', color: '#ffffff', fontSize: '11px', padding: '2px 8px' }}>
                Classification Result
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Model: {result.model_version} | Taxonomy: {result.taxonomy_version}
              </span>
            </div>
            {result.inference_latency_ms && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>{result.inference_latency_ms} ms</span>
              </span>
            )}
          </div>

          {/* Primary Category & Subcategory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Predicted Category</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#09090b' }}>
                {result.classification?.category || 'Unassigned / Needs Review'}
              </div>
            </div>

            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Resolved Subcategory</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b' }}>
                {result.classification?.subcategory || 'None (Triage Rule Unmatched)'}
              </div>
            </div>

            <div>
              <div className="input-label" style={{ marginBottom: '0.35rem' }}>Priority &amp; Intent</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Priority: <span style={{ color: '#09090b', fontWeight: 600 }}>{result.classification?.priority || 'Pending Triage'}</span>
                <br />
                Intent: <span style={{ color: '#09090b', fontWeight: 600 }}>{result.classification?.intent || 'Pending Triage'}</span>
              </div>
            </div>
          </div>

          {/* Confidence Score Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Probability Confidence ({result.confidence?.score_type})
              </span>
              <span style={{ fontWeight: 700, color: '#09090b' }}>
                {(result.confidence?.category_score * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e4e4e7', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, result.confidence?.category_score * 100))}%`,
                  height: '100%',
                  background: '#09090b',
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
                background: '#f4f4f5',
                border: '1px solid #09090b',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.95rem',
                fontSize: '0.85rem',
                color: '#09090b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertTriangle size={15} />
              <span><strong>Human Review Required:</strong> {result.review_reason || 'Confidence fell below operational safety threshold.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
