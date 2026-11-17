import React from 'react';

const formatFullDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

export default function TicketDetailModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className="ticket-id" style={{ fontSize: '1.25rem' }}>
                {ticket.ticket_id}
              </span>
              <span className={`badge badge-${ticket.priority?.toLowerCase()}`}>
                {ticket.priority}
              </span>
              <span className={`badge badge-status-${ticket.status?.toLowerCase().replace(' ', '-')}`}>
                {ticket.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: 600 }}>
              {ticket.title}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-section">
          <div className="modal-label">Symptom Description</div>
          <p className="modal-text">{ticket.description}</p>
        </div>

        {ticket.resolution_text && (
          <div className="modal-section">
            <div className="modal-label" style={{ color: 'var(--success)' }}>
              Historical Resolution Steps
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}
            >
              {ticket.resolution_text}
            </div>
          </div>
        )}

        <div className="modal-section">
          <div className="modal-label">Incident Metadata</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
              fontSize: '0.825rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Category: </span>
              <strong>{ticket.category}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Subcategory: </span>
              <strong>{ticket.subcategory}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Affected Service: </span>
              <strong>{ticket.affected_service}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Environment: </span>
              <strong>{ticket.environment}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Assignment Group: </span>
              <strong>{ticket.assignment_group}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Intent: </span>
              <strong>{ticket.intent || 'Incident'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Access Level: </span>
              <strong>{ticket.data_access_level || 'internal'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Source: </span>
              <strong>{ticket.source_type || 'synthetic'}</strong>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-label">Audit Timestamps</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <div>Created: <strong>{formatFullDate(ticket.created_at)}</strong></div>
            {ticket.resolved_at && (
              <div>Resolved: <strong>{formatFullDate(ticket.resolved_at)}</strong></div>
            )}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-label">Raw Ticket Text (Fidelity Preservation)</div>
          <pre className="code-block">{ticket.raw_text || ticket.description}</pre>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
