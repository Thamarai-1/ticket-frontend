/**
 * AuditLogViewer.jsx
 * Compliance Audit Trail Viewer.
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RotateCcw, Filter } from 'lucide-react';
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 20px 0', color: '#09090b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
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
            <ShieldCheck size={18} />
            <span>Compliance Audit Trail</span>
          </h2>
          <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>
            Correlated audit records tracing model inference, recommendations, and analyst actions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#09090b' }}>Filter Event:</label>
          <select
            value={eventTypeFilter}
            onChange={e => { setEventTypeFilter(e.target.value); setPage(1); }}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #d4d4d8',
              background: '#ffffff',
              color: '#09090b',
              fontSize: '13px'
            }}
          >
            {EVENT_TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
          <button
            onClick={loadLogs}
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
        <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>Loading compliance audit records...</div>
      ) : logs.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          padding: '36px',
          textAlign: 'center',
          color: '#71717a'
        }}>
          No audit records found matching criteria.
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
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Event ID</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Event Type</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Correlation ID</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Analysis ID</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Actor</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 14px', color: '#09090b', fontWeight: 600 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e4e4e7', color: '#09090b' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#09090b' }}>
                    {log.event_id}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: log.event_type.includes('COMPLETED') ? '#09090b' : '#f4f4f5',
                      color: log.event_type.includes('COMPLETED') ? '#ffffff' : '#09090b',
                      border: '1px solid #d4d4d8'
                    }}>
                      {log.event_type}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#71717a' }}>
                    {log.correlation_id}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '12px' }}>{log.analysis_id || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px' }}>{log.actor_reference?.actor_id || 'system'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      background: log.component_status === 'completed' ? '#09090b' : '#f4f4f5',
                      color: log.component_status === 'completed' ? '#ffffff' : '#09090b',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {log.component_status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#71717a', fontSize: '12px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid #e4e4e7', background: '#ffffff' }}>
            <span style={{ fontSize: '13px', color: '#71717a' }}>Total audit events: {pagination.total}</span>
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
    </div>
  );
}
