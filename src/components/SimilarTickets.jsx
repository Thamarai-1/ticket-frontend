import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { fetchSimilarTickets } from '../services/api';
import TicketDetailModal from './TicketDetailModal';

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
        setError(`Service Notice: ${response.error || 'Retrieval service offline'}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve similar historical tickets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', color: '#09090b' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: '#09090b' }}>
          Semantic Similarity &amp; Duplicate Detection
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
          Hybrid retrieval combining vector embeddings (FAISS) and lexical matching (BM25) with Reciprocal Rank Fusion.
        </p>
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
              <Search size={14} />
              <span>{loading ? 'Searching Vectors...' : 'Find Similar Incidents'}</span>
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

      {/* Loading Indicator */}
      {loading && (
        <div className="table-container loading-spinner" style={{ marginBottom: '1.5rem' }}>
          <span>Querying vector and lexical indexes with Reciprocal Rank Fusion...</span>
        </div>
      )}

      {/* Results Section */}
      {resultsData && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#09090b' }}>
              Similar Historical Tickets ({resultsData.results?.length || 0} retrieved)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span>Method: {resultsData.retrieval_method} | Engine: {resultsData.retrieval_model_version}</span>
              <span style={{ margin: '0 4px' }}>•</span>
              <Clock size={12} />
              <span>{resultsData.retrieval_latency_ms} ms</span>
            </span>
          </div>

          {resultsData.results?.length === 0 ? (
            <div className="table-container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No matching historical tickets found for this query.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try broadening your search description or adjusting filters.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {resultsData.results.map((item) => (
                <div
                  key={item.ticket_id}
                  className="filter-card"
                  style={{
                    borderColor: item.potential_duplicate ? '#09090b' : 'var(--border-color)',
                    padding: '14px 16px',
                    marginBottom: 0
                  }}
                >
                  {/* Top Bar with Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="brand-badge" style={{ background: '#f4f4f5', color: '#09090b', border: '1px solid #d4d4d8', fontSize: '11px', padding: '1px 6px' }}>
                        Rank #{item.hybrid_rank}
                      </span>
                      <span className="ticket-id" style={{ fontSize: '1rem', color: '#09090b' }}>
                        {item.ticket_id}
                      </span>
                      <span className="badge" style={{ background: '#f4f4f5', color: '#52525b', border: '1px solid #e4e4e7' }}>
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
                            background: '#09090b',
                            color: '#ffffff',
                            border: '1px solid #09090b',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <AlertTriangle size={11} />
                          <span>Duplicate ({(item.duplicate_confidence * 100).toFixed(0)}%)</span>
                        </span>
                      )}

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setSelectedTicket(item)}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description Excerpt */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem', color: '#09090b' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {item.description_excerpt}
                  </p>

                  {/* Duplicate Alert Box */}
                  {item.potential_duplicate && item.duplicate_reason && (
                    <div
                      style={{
                        background: '#f4f4f5',
                        border: '1px solid #09090b',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.55rem 0.8rem',
                        fontSize: '0.8rem',
                        color: '#09090b',
                        marginBottom: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertTriangle size={13} />
                      <span><strong>Duplicate Signals:</strong> {item.duplicate_reason}</span>
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
                      background: '#f4f4f5',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      color: '#09090b'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Match Evidence: </span>
                      <span style={{ color: '#09090b', fontWeight: 500 }}>
                        {item.match_reason}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Semantic: <strong style={{ color: '#09090b' }}>{(item.similarity_score * 100).toFixed(1)}%</strong></span>
                      <span>BM25: <strong style={{ color: '#09090b' }}>{item.bm25_score}</strong></span>
                      <span>RRF: <strong style={{ color: '#09090b' }}>{item.rrf_score}</strong></span>
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
