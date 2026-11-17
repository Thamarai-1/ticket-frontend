/**
 * AuditLogViewer.jsx
 * Immutable Compliance Audit Trail Viewer (FR-08 Audit-Friendly Output).
 */

import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../services/api';

const EVENT_TYPES = [
  'ALL',
  'ANALYSIS_STARTED',
  'ANALYSIS_COMPLETED',
  'ANALYSIS_PARTIAL',
  'ANALYSIS_FAILED',
  'FEEDBACK_SUBMITTED',
  'TICKET_CREATED'
];

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    loadLogs();
  }, [page, eventTypeFilter]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const typeParam = eventTypeFilter === 'ALL' ? '' : eventTypeFilter;
      const res = await fetchAuditLogs({ page, limit: 15, event_type: typeParam });
      if (res.success) {
        setLogs(res.data);
        setPagination(res.pagination || { total: res.data.length, pages: 1 });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>🛡️ Enterprise Compliance Audit Trail (FR-08)</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Immutable, cryptographically correlated audit records tracing every AI inference and analyst decision.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: 600 }}>Filter Event:</label>
          <select
            value={eventTypeFilter}
            onChange={e => { setEventTypeFilter(e.target.value); setPage(1); }}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          >
            {EVENT_TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
          <button
            onClick={loadLogs}
            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading compliance audit records...</div>
      ) : logs.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '36px', textAlign: 'center', color: '#64748b' }}>
          No audit records found matching criteria.
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 14px' }}>Event ID</th>
                <th style={{ padding: '12px 14px' }}>Event Type</th>
                <th style={{ padding: '12px 14px' }}>Correlation ID</th>
                <th style={{ padding: '12px 14px' }}>Analysis ID</th>
                <th style={{ padding: '12px 14px' }}>Actor</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#0369a1' }}>{log.event_id}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: log.event_type.includes('COMPLETED') ? '#dcfce7' : log.event_type.includes('FEEDBACK') ? '#e0e7ff' : '#f1f5f9',
                      color: log.event_type.includes('COMPLETED') ? '#166534' : log.event_type.includes('FEEDBACK') ? '#4338ca' : '#334155'
                    }}>
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>
                    {log.correlation_id}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px' }}>{log.analysis_id || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px' }}>{log.actor_reference?.actor_id || 'system'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: log.component_status === 'completed' ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                      {log.component_status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '12px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Total audit events: {pagination.total}</span>
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
    </div>
  );
}
