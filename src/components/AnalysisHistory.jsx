/**
 * AnalysisHistory.jsx
 * Component for Browsing Past AI Analysis Runs and Feedback (FR-08 Auditability).
 */

import React, { useState, useEffect } from 'react';
import { fetchAnalyses, fetchAnalysisById } from '../services/api';

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadAnalyses();
  }, [page]);

  const loadAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAnalyses({ page, limit: 10 });
      if (res.success) {
        setAnalyses(res.data);
        setPagination(res.pagination || { total: res.data.length, pages: 1 });
      }
    } catch (err) {
      setError(err.message || 'Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (analysisId) => {
    setLoadingDetail(true);
    try {
      const res = await fetchAnalysisById(analysisId);
      if (res.success) {
        setSelectedAnalysis(res.data);
      }
    } catch (err) {
      alert(`Could not load details: ${err.message}`);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>📜 Past AI Analysis History</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Browse previously completed ticket classification and recommendation runs.
          </p>
        </div>
        <button
          onClick={loadAnalyses}
          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading analysis records...</div>
      ) : analyses.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '36px', textAlign: 'center', color: '#64748b' }}>
          No analysis records found. Submit a ticket in the Analyst Dashboard to create the first record.
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>Analysis ID</th>
                <th style={{ padding: '12px 16px' }}>Ticket ID</th>
                <th style={{ padding: '12px 16px' }}>Title Snapshot</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Latency</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0369a1' }}>{a.analysis_id}</td>
                  <td style={{ padding: '12px 16px' }}>{a.ticket_id}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.input_snapshot?.title || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>
                      {a.classification?.category || 'Unclassified'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      background: a.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      color: a.status === 'completed' ? '#166534' : '#92400e'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{a.execution_latency_ms?.total || 0}ms</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleViewDetail(a.analysis_id)}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Total analyses: {pagination.total}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ padding: '4px 8px', fontSize: '13px' }}>Page {page} of {pagination.pages || 1}</span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: page >= pagination.pages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Details Drawer / Modal */}
      {selectedAnalysis && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', maxWidth: '750px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Analysis Details: {selectedAnalysis.analysis_id}</h3>
              <button onClick={() => setSelectedAnalysis(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
              <div><strong>Ticket ID:</strong> {selectedAnalysis.ticket_id}</div>
              <div><strong>Title:</strong> {selectedAnalysis.input_snapshot?.title}</div>
              <div><strong>Service:</strong> {selectedAnalysis.input_snapshot?.affected_service} ({selectedAnalysis.input_snapshot?.environment})</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>Recommended Steps ({selectedAnalysis.recommendations?.length || 0}):</h4>
              {selectedAnalysis.recommendations?.map((r, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
                  <strong>{r.title}</strong>
                  <ol style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '12px' }}>
                    {r.steps?.map((s, si) => <li key={si}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>

            {selectedAnalysis.feedback && selectedAnalysis.feedback.length > 0 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Submitted Analyst Feedback (FR-06):</h4>
                {selectedAnalysis.feedback.map((fb, fi) => (
                  <div key={fi} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '6px' }}>
                    <strong>{fb.reviewer_reference?.name || 'Analyst'}:</strong> Marked <em>{fb.target_id}</em> as <strong>{fb.feedback_status.toUpperCase()}</strong>
                    {fb.comment && <div style={{ color: '#166534', marginTop: '2px' }}>"{fb.comment}"</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
