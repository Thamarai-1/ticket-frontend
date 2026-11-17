import React, { useState } from 'react';
import AnalystDashboard from './components/AnalystDashboard';
import SimilarTickets from './components/SimilarTickets';
import TicketClassifier from './components/TicketClassifier';
import HistoricalTickets from './components/HistoricalTickets';
import AnalysisHistory from './components/AnalysisHistory';
import AuditLogViewer from './components/AuditLogViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default to Unified Analyst Console

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{ marginBottom: '1.25rem' }}>
        <div className="brand-wrapper">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 className="brand-title">Intelligent IT Ticket Assistant</h1>
              <span className="brand-badge" style={{ background: '#22c55e', color: '#fff' }}>Phases 1–6 Operational</span>
            </div>
            <p className="brand-subtitle">
              Unified Classification, Hybrid Retrieval, Grounded Resolution Recommendations &amp; Audit Trail — HCLTech Hackathon
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
          <div>Stack: React + Express + FastAPI + MongoDB</div>
          <div style={{ color: 'var(--success)' }}>● All 6 Phases End-to-End Integrated</div>
        </div>
      </header>

      {/* Primary Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'dashboard' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'dashboard' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('dashboard')}
        >
          🚀 Unified Analyst Console (Phases 4 &amp; 5)
        </button>

        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'similar' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'similar' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('similar')}
        >
          🔍 Similar Incidents &amp; Duplicates (Phase 3)
        </button>

        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'classifier' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'classifier' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('classifier')}
        >
          🤖 AI Ticket Classifier (Phase 2)
        </button>

        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'historical' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'historical' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('historical')}
        >
          📁 Ticket Repository &amp; Search (Phase 1)
        </button>

        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'history' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'history' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('history')}
        >
          📜 Past Analyses (Phase 5)
        </button>

        <button
          className="btn-secondary"
          style={{
            background: activeTab === 'audit' ? '#2563eb' : '#334155',
            color: '#fff',
            fontWeight: activeTab === 'audit' ? 700 : 400,
            borderRadius: '6px',
            padding: '8px 14px'
          }}
          onClick={() => setActiveTab('audit')}
        >
          🛡️ Compliance Audit Trail (FR-08)
        </button>
      </div>

      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <AnalystDashboard />}
        {activeTab === 'similar' && <SimilarTickets />}
        {activeTab === 'classifier' && <TicketClassifier />}
        {activeTab === 'historical' && <HistoricalTickets />}
        {activeTab === 'history' && <AnalysisHistory />}
        {activeTab === 'audit' && <AuditLogViewer />}
      </main>

      <footer style={{ marginTop: '2.5rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        HCLTech Future Ready AI Engineer Hackathon | Intelligent IT Ticket Analysis and Resolution Assistant | All 6 Phases Complete &amp; Validated
      </footer>
    </div>
  );
}
