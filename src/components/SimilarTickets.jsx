import React, { useState } from 'react';
import { fetchSimilarTickets } from '../services/api';
import TicketDetailModal from './TicketDetailModal';

const PRESET_QUERIES = [
  {
    name: 'VPN Dropout',
    title: 'VPN connection disconnects right after MFA',
    description: 'User enters credentials on GlobalProtect. The VPN disconnects with Error 800 on gateway 10.240.0.1 after 30 seconds.',
    service: 'Corporate VPN',
    env: 'Production'
  },
  {
    name: 'Account Lockout',
    title: 'User account locked out in Active Directory repeatedly',
    description: 'Employee account locked out with Event ID 4625 originating from workstation WS-1049 badpwdcount incrementing.',
    service: 'Active Directory Domain Services',
    env: 'Production'
  },
  {
    name: 'CAD 0x80070005',
    title: 'AutoCAD deployment fails with error 0x80070005 access denied',
    description: 'Installer fails during staging directory extraction in C:\\Windows\\Temp via Company Portal Intune.',
    service: 'Endpoint Management (Intune)',
    env: 'Production'
  },
  {
    name: '502 Bad Gateway',
    title: 'Nginx reverse proxy returning HTTP 502 Bad Gateway to clients',
    description: 'API gateway web-gw-prod01 returning 502. Upstream connection refused on socket 127.0.0.1:8080.',
    service: 'Linux Application Cluster',
    env: 'Production'
  },
  {
    name: 'Printer Jam',
    title: 'Floor 3 HP LaserJet printer paper jam 13.00.00',
    description: 'Shared printer PRN-FL3-COLOR displays error code 13.00.00 paper jam inside top cover.',
    service: 'Print Server Services',
    env: 'Production'
  }
];

export default function SimilarTickets() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedService, setAffectedService] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [topK, setTopK] = useState(5);
  const [retrievalMethod, setRetrievalMethod] = useState('hybrid');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a ticket title and description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultsData(null);

    try {
      const response = await fetchSimilarTickets({
        title: title.trim(),
        description: description.trim(),
        affected_service: affectedService.trim() || null,
        environment: environment || null,
        top_k: parseInt(topK, 10),
        method: retrievalMethod
      });

      if (response.success && response.data) {
        setResultsData(response.data);
      } else if (response.fallback) {
        setResultsData(response.fallback);
        setError(`ML Service Notice: ${response.error || 'Retrieval service offline'}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve similar historical tickets.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setAffectedService(preset.service);
    setEnvironment(preset.env);
    setError(null);
    setResultsData(null);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Semantic Similarity &amp; Duplicate Detection</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Hybrid Information Retrieval combining Sentence Transformers (FAISS IndexFlatIP) and BM25 with Reciprocal Rank Fusion (RRF).
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Test Scenarios:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            onClick={() => loadPreset(preset)}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Query Formulation Form */}
      <div className="filter-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Ticket Title *</label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. GlobalProtect VPN disconnects with error 800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Affected Service</label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. Corporate VPN"
                value={affectedService}
                onChange={(e) => setAffectedService(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Environment</label>
              <select
                className="select-input"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
                <option value="QA">QA</option>
                <option value="DR">DR</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="input-label">Symptom Description *</label>
            <textarea
              className="text-input"
              rows={3}
              placeholder="Describe user symptoms, error codes (0x80070005, 502), server names, or log snippets..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="input-label" style={{ marginBottom: 0 }}>Method:</span>
                <select
                  className="select-input"
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                  value={retrievalMethod}
                  onChange={(e) => setRetrievalMethod(e.target.value)}
                >
                  <option value="hybrid">Hybrid (FAISS + BM25 RRF)</option>
                  <option value="semantic_only">Semantic Only (FAISS MiniLM)</option>
                  <option value="bm25_only">Lexical Only (BM25)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="input-label" style={{ marginBottom: 0 }}>Top K:</span>
                <select
                  className="select-input"
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
                  value={topK}
                  onChange={(e) => setTopK(e.target.value)}
                >
                  <option value={3}>Top 3</option>
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                </select>
              </div>
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
              {loading ? 'Searching Vectors & Inverted Index...' : 'Find Similar Historical Tickets'}
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

      {/* Loading Indicator */}
      {loading && (
        <div className="table-container loading-spinner" style={{ marginBottom: '1.5rem' }}>
          <span>Querying FAISS IndexFlatIP &amp; BM25 with Reciprocal Rank Fusion...</span>
        </div>
      )}

      {/* Results Section */}
      {resultsData && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
              Similar Historical Tickets ({resultsData.results?.length || 0} retrieved)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Method: {resultsData.retrieval_method} | Engine: {resultsData.retrieval_model_version} | ⚡ {resultsData.retrieval_latency_ms} ms
            </span>
          </div>

          {resultsData.results?.length === 0 ? (
            <div className="table-container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No matching historical tickets found for this query.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try broadening your search description or adjusting filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resultsData.results.map((item) => (
                <div
                  key={item.ticket_id}
                  className="filter-card"
                  style={{
                    borderColor: item.potential_duplicate ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Bar with Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="brand-badge" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                        Rank #{item.hybrid_rank}
                      </span>
                      <span className="ticket-id" style={{ fontSize: '1.05rem' }}>
                        {item.ticket_id}
                      </span>
                      <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1' }}>
                        {item.category} / {item.subcategory}
                      </span>
                      <span className="badge badge-status-resolved">
                        {item.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {/* Potential Duplicate Badge */}
                      {item.potential_duplicate && (
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--danger)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            fontWeight: 700
                          }}
                        >
                          ⚠️ Potential Duplicate ({(item.duplicate_confidence * 100).toFixed(0)}%)
                        </span>
                      )}

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                        onClick={() => setSelectedTicket(item)}
                      >
                        View Full Details →
                      </button>
                    </div>
                  </div>

                  {/* Title & Description Excerpt */}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                    {item.description_excerpt}
                  </p>

                  {/* Duplicate Alert Box */}
                  {item.potential_duplicate && item.duplicate_reason && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.8rem',
                        color: '#fca5a5',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <strong>Duplicate Signals: </strong> {item.duplicate_reason}
                    </div>
                  )}

                  {/* Match Evidence & Scores Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      fontSize: '0.8rem',
                      background: 'var(--bg-primary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Match Evidence: </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {item.match_reason}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Semantic: <strong style={{ color: 'var(--success)' }}>{(item.similarity_score * 100).toFixed(1)}%</strong></span>
                      <span>BM25: <strong>{item.bm25_score}</strong></span>
                      <span>RRF: <strong style={{ color: 'var(--accent-primary)' }}>{item.rrf_score}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
