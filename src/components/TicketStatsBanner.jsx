import React from 'react';

export default function TicketStatsBanner({ stats, loading }) {
  if (loading && !stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.6 }}>
            <div className="stat-header">Loading Metrics...</div>
            <div className="stat-value">--</div>
            <div className="stat-subtext">Fetching MongoDB aggregates</div>
          </div>
        ))}
      </div>
    );
  }

  const total = stats?.totalTickets || 0;
  const resolved = stats?.resolutionMetrics?.resolved || 0;
  const unresolved = stats?.resolutionMetrics?.unresolved || 0;
  const resolvedPct = stats?.resolutionMetrics?.resolvedPercentage || 0;

  // Find count of P1 Critical tickets from priority distribution
  const p1Item = stats?.priorityDistribution?.find((p) => p._id === 'P1');
  const p1Count = p1Item ? p1Item.count : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span>Total Tickets</span>
          <span>📁</span>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-subtext">Historical verified repository</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Resolution Rate</span>
          <span>✅</span>
        </div>
        <div className="stat-value" style={{ color: 'var(--success)' }}>
          {resolvedPct}%
        </div>
        <div className="stat-subtext">{resolved} closed or resolved</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Critical P1 Incidents</span>
          <span>🚨</span>
        </div>
        <div className="stat-value" style={{ color: 'var(--danger)' }}>
          {p1Count}
        </div>
        <div className="stat-subtext">High-severity outage tickets</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Active Backlog</span>
          <span>⏳</span>
        </div>
        <div className="stat-value" style={{ color: 'var(--warning)' }}>
          {unresolved}
        </div>
        <div className="stat-subtext">New, assigned, or in-progress</div>
      </div>
    </div>
  );
}
