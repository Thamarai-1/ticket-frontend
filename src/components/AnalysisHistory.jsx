/**
 * AnalysisHistory.jsx
 * Component for Browsing Past AI Analysis Runs and Feedback.
 */

import React, { useState, useEffect } from 'react';
import { History, RotateCcw, X, ExternalLink, FileText } from 'lucide-react';
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 20px 0', color: '#09090b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: 700,
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <History size={18} />
            <span>Analysis History</span>
          </h2>
          <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>
            Browse previously completed ticket classification and recommendation runs.
          </p>
        </div>
        <button
          onClick={loadAnalyses}
          style={{
            background: '#ffffff',
            border: '1px solid #d4d4d8',
            color: '#09090b',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: '#f4f4f5',
          border: '1px solid #09090b',
          color: '#09090b',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading analysis records...</div>
      ) : analyses.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          padding: '36px',
          textAlign: 'center',
          color: '#71717a'
        }}>
          No analysis records found. Submit a ticket in the Analyst Console to create the first record.
        </div>
      ) : (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead style={{ background: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
              <tr>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Analysis ID</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Ticket ID</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Title Snapshot</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Latency</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Timestamp</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e4e4e7', color: '#09090b' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#09090b', fontFamily: 'var(--font-mono)' }}>
                    {a.analysis_id}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{a.ticket_id}</td>
                  <td style={{ padding: '10px 14px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.input_snapshot?.title || 'N/A'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: '#f4f4f5', color: '#09090b', border: '1px solid #e4e4e7', padding: '2px 7px', borderRadius: '4px', fontSize: '11px' }}>
                      {a.classification?.category || 'Unclassified'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '11px',
                      background: a.status === 'completed' ? '#09090b' : '#f4f4f5',
                      color: a.status === 'completed' ? '#ffffff' : '#09090b',
                      border: '1px solid #09090b'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>{a.execution_latency_ms?.total || 0}ms</td>
                  <td style={{ padding: '10px 14px', color: '#71717a' }}>
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => handleViewDetail(a.analysis_id)}
                      style={{
                        background: '#09090b',
                        color: '#ffffff',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ExternalLink size={11} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid #e4e4e7', background: '#ffffff' }}>
            <span style={{ fontSize: '13px', color: '#71717a' }}>Total analyses: {pagination.total}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d4d4d8',
                  borderRadius: '4px',
                  background: '#ffffff',
                  color: '#09090b',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ padding: '4px 8px', fontSize: '13px', color: '#09090b' }}>
                Page {page} of {pagination.pages || 1}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d4d4d8',
                  borderRadius: '4px',
                  background: '#ffffff',
                  color: '#09090b',
                  cursor: page >= pagination.pages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Details Drawer / Modal */}
      {selectedAnalysis && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            color: '#09090b',
            border: '1px solid #e4e4e7',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '750px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#09090b', fontSize: '16px' }}>Analysis Record: {selectedAnalysis.analysis_id}</h3>
              <button onClick={() => setSelectedAnalysis(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px', background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#09090b' }}>
              <div><strong>Ticket ID:</strong> {selectedAnalysis.ticket_id}</div>
              <div><strong>Title:</strong> {selectedAnalysis.input_snapshot?.title}</div>
              <div><strong>Service:</strong> {selectedAnalysis.input_snapshot?.affected_service} ({selectedAnalysis.input_snapshot?.environment})</div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: '#09090b' }}>
                Recommended Remediation ({selectedAnalysis.recommendations?.length || 0})
              </h4>
              {selectedAnalysis.recommendations?.map((r, i) => (
                <div key={i} style={{ border: '1px solid #e4e4e7', background: '#fafafa', borderRadius: '6px', padding: '10px', marginBottom: '8px', color: '#09090b' }}>
                  <strong style={{ color: '#09090b' }}>{r.title}</strong>
                  <ol style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '12px', color: '#09090b' }}>
                    {r.steps?.map((s, si) => <li key={si}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>

            {selectedAnalysis.feedback && selectedAnalysis.feedback.length > 0 && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #e4e4e7', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#09090b' }}>Analyst Feedback:</h4>
                {selectedAnalysis.feedback.map((fb, fi) => (
                  <div key={fi} style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '8px', borderRadius: '4px', fontSize: '12px', marginBottom: '6px', color: '#09090b' }}>
                    <strong>{fb.reviewer_reference?.name || 'Analyst'}:</strong> Marked <em>{fb.target_id}</em> as <strong style={{ color: '#09090b' }}>{fb.feedback_status.toUpperCase()}</strong>
                    {fb.comment && <div style={{ color: '#52525b', marginTop: '2px' }}>"{fb.comment}"</div>}
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
