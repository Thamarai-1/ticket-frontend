import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Layers,
  Tags,
  Database,
  History,
  ShieldCheck,
  Ticket,
  LogOut,
  Loader2
} from 'lucide-react';
import AnalystDashboard from './components/AnalystDashboard';
import SimilarTickets from './components/SimilarTickets';
import TicketClassifier from './components/TicketClassifier';
import HistoricalTickets from './components/HistoricalTickets';
import AnalysisHistory from './components/AnalysisHistory';
import AuditLogViewer from './components/AuditLogViewer';
import LoginPage from './components/LoginPage';
import axiosInstance from './services/axiosInstance';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    axiosInstance.get('/api/auth/me')
      .then((res) => {
        const userData = res.data.data?.user || res.data.data || res.data.user || res.data;
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  const handleLogin = useCallback((userData, token) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    axiosInstance.post('/api/auth/logout').catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // Listen for 401 events from axios interceptor
  useEffect(() => {
    const handler = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Analyst Console', icon: LayoutDashboard },
    { id: 'similar', label: 'Similar Incidents', icon: Layers },
    { id: 'classifier', label: 'Ticket Classifier', icon: Tags },
    { id: 'historical', label: 'Ticket Repository', icon: Database },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
  ];

  const currentNav = navItems.find(item => item.id === activeTab) || navItems[0];

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff'
      }}>
        <Loader2 size={24} color="#09090b" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

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

        {/* Sidebar Footer - User & Logout */}
        <div className="sidebar-footer">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#09090b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.name || user.email}
              </div>
              {user.name && (
                <div style={{
                  fontSize: '11px',
                  color: '#71717a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.email}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                color: '#71717a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.color = '#09090b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
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
