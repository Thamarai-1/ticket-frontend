import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Tags,
  Database,
  History,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import AnalystDashboard from './components/AnalystDashboard';
import SimilarTickets from './components/SimilarTickets';
import TicketClassifier from './components/TicketClassifier';
import HistoricalTickets from './components/HistoricalTickets';
import AnalysisHistory from './components/AnalysisHistory';
import AuditLogViewer from './components/AuditLogViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Analyst Console', icon: LayoutDashboard },
    { id: 'similar', label: 'Similar Incidents', icon: Layers },
    { id: 'classifier', label: 'Ticket Classifier', icon: Tags },
    { id: 'historical', label: 'Ticket Repository', icon: Database },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
  ];

  const currentNav = navItems.find(item => item.id === activeTab) || navItems[0];

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '26px',
              height: '26px',
              background: '#09090b',
              color: '#ffffff',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ticket size={15} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#09090b', letterSpacing: '-0.01em' }}>
              IT Ticket Assistant
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="sidebar-nav">
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 8px 8px 8px'
          }}>
            Navigation
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} color={isActive ? '#ffffff' : '#71717a'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-layout">
        {/* Top Header / Breadcrumb */}
        <header className="top-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#71717a' }}>Workspace /</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#09090b' }}>
              {currentNav.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#71717a' }}>
            <span>Incident Intelligence &amp; Resolution</span>
          </div>
        </header>

        {/* Rightside Scrollable Viewport */}
        <div className="main-scroll-container">
          <main className="main-content">
            {activeTab === 'dashboard' && <AnalystDashboard />}
            {activeTab === 'similar' && <SimilarTickets />}
            {activeTab === 'classifier' && <TicketClassifier />}
            {activeTab === 'historical' && <HistoricalTickets />}
            {activeTab === 'history' && <AnalysisHistory />}
            {activeTab === 'audit' && <AuditLogViewer />}
          </main>

          <footer style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            background: '#ffffff'
          }}>
            IT Service Management Console • Ticket Intelligence System
          </footer>
        </div>
      </div>
    </div>
  );
}
