import React from 'react';
import {
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function TicketStatsBanner({ stats, loading }) {
  if (loading && !stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.6 }}>
            <div className="stat-header">Loading Metrics...</div>
            <div className="stat-value">--</div>
            <div className="stat-subtext">Fetching aggregates</div>
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
          <FolderOpen size={16} color="#71717a" />
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-subtext">Verified incident repository</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Resolution Rate</span>
          <CheckCircle2 size={16} color="#09090b" />
        </div>
        <div className="stat-value" style={{ color: '#09090b' }}>
          {resolvedPct}%
        </div>
        <div className="stat-subtext">{resolved} closed or resolved</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Critical P1 Incidents</span>
          <AlertTriangle size={16} color="#09090b" />
        </div>
        <div className="stat-value" style={{ color: '#09090b' }}>
          {p1Count}
        </div>
        <div className="stat-subtext">High-severity outage tickets</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Active Backlog</span>
          <Clock size={16} color="#71717a" />
        </div>
        <div className="stat-value" style={{ color: '#09090b' }}>
          {unresolved}
        </div>
        <div className="stat-subtext">New, assigned, or in-progress</div>
      </div>
    </div>
  );
}
