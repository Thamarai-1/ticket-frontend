import React from 'react';

const getPriorityBadgeClass = (p) => {
  switch (p) {
    case 'P1': return 'badge badge-p1';
    case 'P2': return 'badge badge-p2';
    case 'P3': return 'badge badge-p3';
    case 'P4': return 'badge badge-p4';
    default: return 'badge';
  }
};

const getStatusBadgeClass = (s) => {
  switch (s) {
    case 'Resolved': return 'badge badge-status-resolved';
    case 'Closed': return 'badge badge-status-closed';
    case 'In Progress': return 'badge badge-status-in-progress';
    case 'Assigned': return 'badge badge-status-assigned';
    case 'New': return 'badge badge-status-new';
    default: return 'badge';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export default function TicketList({ tickets, onSelectTicket }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="table-container" style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
          No matching IT tickets found in the repository.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Try clearing search keywords or selecting different taxonomy filters.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Category & Subcategory</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Affected Service</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id} onClick={() => onSelectTicket(t)}>
              <td>
                <span className="ticket-id">{t.ticket_id}</span>
              </td>
              <td>
                <div className="ticket-title" title={t.title}>
                  {t.title}
                </div>
              </td>
              <td>
                <div>{t.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {t.subcategory}
                </div>
              </td>
              <td>
                <span className={getPriorityBadgeClass(t.priority)}>
                  {t.priority}
                </span>
              </td>
              <td>
                <span className={getStatusBadgeClass(t.status)}>
                  {t.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {t.affected_service}
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {formatDate(t.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
