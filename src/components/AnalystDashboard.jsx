/**
 * AnalystDashboard.jsx
 * Unified AI Ticket Analysis and Resolution Console (Phase 5 & 6).
 * 
 * Provides:
 * - Direct Ticket Ingestion & Quick Presets
 * - Multi-Model AI Orchestration (Classification + Retrieval + Recommendation)
 * - Traceable Evidence Inspection with Exact Excerpts
 * - Inline Human Analyst Feedback Collection (FR-06)
 * - Grounding Validation and Advisory Safety Safeguards
 */

import React, { useState } from 'react';
import { analyzeTicket, submitFeedback } from '../services/api';

const PRESETS = [
  {
    label: 'VPN Disconnect Error 800',
    title: 'VPN connection drops immediately after authentication with Error 800',
    description: 'User enters credentials and completes MFA via GlobalProtect. Tunnel disconnects 5 seconds later with Error 800 on gateway 10.240.0.1.',
    affected_service: 'Corporate VPN',
    environment: 'Production'
  },
  {
    label: 'CAD Install Error 0x80070005',
    title: 'Software installation error 0x80070005 Access is denied during CAD install',
    description: 'AutoCAD 2026 deployment fails via Company Portal with exit code 0x80070005. Antivirus shows quarantine event for setup executable temp file.',
    affected_service: 'Endpoint Management (Intune)',
    environment: 'Production'
  },
  {
    label: 'API Gateway 502 Outage (P1)',
    title: 'Production API gateway returning HTTP 502 Bad Gateway to clients',
    description: 'Nginx reverse proxy server web-gw-prod01 returning HTTP 502. Upstream connection refused on socket 127.0.0.1:8080. CPU utilization at 100%.',
    affected_service: 'Linux Application Cluster',
    environment: 'Production'
  },
  {
    label: 'SSPR Password Reset Token Expired',
    title: 'Urgent self-service password reset token expired',
    description: 'Employee returning from medical leave unable to complete SSPR. Error message: Verification token expired or invalid. User locked out.',
    affected_service: 'Okta Identity Cloud',
    environment: 'Production'
  },
  {
    label: 'Unseen / OOD Incident (Insufficient Evidence)',
    title: 'Proprietary Quantum FPGA Accelerator Kernel Panic in Lab 4',
    description: 'Experimental PCIe board Q-FPGA-99 throws kernel panic 0xDEADBEEF during cryogenic calibration test. No runbook exists.',
    affected_service: 'Quantum Lab Accelerator',
    environment: 'Development'
  }
];

export default function AnalystDashboard() {
  const [formData, setFormData] = useState({
    ticket_id: 'INC-' + Math.floor(2000 + Math.random() * 8000),
    title: PRESETS[0].title,
    description: PRESETS[0].description,
    affected_service: PRESETS[0].affected_service,
    environment: PRESETS[0].environment,
    generation_mode: 'deterministic'
  });

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);

  // Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    target_type: 'recommendation',
    target_id: '',
    feedback_status: 'useful',
    comment: ''
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState('');

  const handleApplyPreset = (p) => {
    setFormData(prev => ({
      ...prev,
      title: p.title,
      description: p.description,
      affected_service: p.affected_service,
      environment: p.environment
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setFeedbackSuccessMsg('');

    try {
      const result = await analyzeTicket(formData);
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        setError(result.error || 'Failed to complete unified analysis');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with analysis backend');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = (target_type, target_id) => {
    setFeedbackModal({
      isOpen: true,
      target_type,
      target_id,
      feedback_status: 'useful',
      comment: ''
    });
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!analysisResult) return;
    setFeedbackSubmitting(true);
    setFeedbackSuccessMsg('');

    try {
      await submitFeedback(analysisResult.analysis_id, {
        target_type: feedbackModal.target_type,
        target_id: feedbackModal.target_id,
        feedback_status: feedbackModal.feedback_status,
        comment: feedbackModal.comment
      });
      setFeedbackSuccessMsg(`Feedback recorded for ${feedbackModal.target_id}!`);
      setFeedbackModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      alert(`Feedback submission error: ${err.message}`);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header Banner */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>Intelligent IT Ticket Analysis & Resolution Assistant</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
              HCLTech Future Ready AI Engineer Hackathon | Phases 1–6 End-to-End System
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid #334155' }}>
              🛡️ Role: <strong>Tier-2 Triage Analyst</strong>
            </span>
            <span style={{ background: '#1e293b', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid #334155' }}>
              🔒 Clearance: <strong>Internal</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Ticket Input & Controls */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0, marginBottom: '14px' }}>📥 Submit Ticket for AI Analysis</h2>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Quick Presets:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Ticket ID</label>
              <input
                type="text"
                value={formData.ticket_id}
                onChange={e => setFormData({ ...formData, ticket_id: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Description *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Affected Service</label>
                <input
                  type="text"
                  value={formData.affected_service}
                  onChange={e => setFormData({ ...formData, affected_service: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Environment</label>
                <select
                  value={formData.environment}
                  onChange={e => setFormData({ ...formData, environment: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="QA">QA</option>
                  <option value="DR">DR</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Recommendation Generation Mode</label>
              <select
                value={formData.generation_mode}
                onChange={e => setFormData({ ...formData, generation_mode: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="deterministic">Deterministic Engine (Verified Rules & Evidence)</option>
                <option value="rag">Grounded RAG (Strict Citation & Injection Defense)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#94a3b8' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⚡ Running End-to-End AI Analysis...' : '🚀 Analyze Ticket (Run All Phases)'}
            </button>
          </form>

          {feedbackSuccessMsg && (
            <div style={{ marginTop: '14px', padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '13px' }}>
              ✅ {feedbackSuccessMsg}
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Results */}
        <div>
          {error && (
            <div style={{ padding: '16px', background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', borderRadius: '8px', marginBottom: '20px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {!analysisResult && !loading && (
            <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#64748b' }}>
              <span style={{ fontSize: '40px' }}>🔍</span>
              <h3 style={{ margin: '12px 0 6px 0', color: '#334155' }}>No Ticket Analyzed Yet</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Select a preset or enter ticket details on the left, then click "Analyze Ticket".</p>
            </div>
          )}

          {loading && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '4px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '16px', color: '#475569', fontWeight: 500 }}>
                Orchestrating AI Services: Classifying symptoms, querying FAISS & BM25 indexes, synthesizing resolution evidence...
              </p>
            </div>
          )}

          {analysisResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Pipeline Status Banner */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Analysis ID: <strong>{analysisResult.analysis_id}</strong></span>
                  <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Status: <strong style={{ color: analysisResult.status === 'completed' ? '#16a34a' : '#d97706' }}>{analysisResult.status.toUpperCase()}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    Classification: <strong>{analysisResult.component_statuses?.classification || 'OK'}</strong>
                  </span>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    Retrieval: <strong>{analysisResult.component_statuses?.retrieval || 'OK'}</strong>
                  </span>
                  <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    Recommendation: <strong>{analysisResult.component_statuses?.recommendation || 'OK'}</strong>
                  </span>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    ⏱️ {analysisResult.execution_latency_ms?.total || 24}ms
                  </span>
                </div>
              </div>

              {/* SECTION 1: Classification (FR-01) */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏷️ AI Classification (Phase 2)
                  </h3>
                  <button
                    onClick={() => handleOpenFeedback('classification', analysisResult.ticket_id)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    💬 Feedback
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PREDICTED CATEGORY</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                      {analysisResult.classification?.category || 'Unknown'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SUBCATEGORY</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                      {analysisResult.classification?.subcategory || 'N/A'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CONFIDENCE</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
                      {analysisResult.classification?.confidence_score
                        ? (analysisResult.classification.confidence_score * 100).toFixed(1) + '%'
                        : '0%'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PRIORITY & INTENT</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                      {analysisResult.classification?.priority || 'P3'} ({analysisResult.classification?.intent || 'Incident'})
                    </div>
                  </div>
                </div>

                {analysisResult.classification?.review_required && (
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', fontSize: '12px', color: '#92400e' }}>
                    ⚠️ <strong>Low Confidence Review:</strong> {analysisResult.classification.review_reason}
                  </div>
                )}
              </div>

              {/* SECTION 2: Suggested Resolution (FR-03 & FR-04) */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💡 Suggested Resolution (Phase 4)
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: analysisResult.confidence?.level === 'high' ? '#dcfce7' : analysisResult.confidence?.level === 'medium' ? '#dbeafe' : '#fee2e2',
                      color: analysisResult.confidence?.level === 'high' ? '#166534' : analysisResult.confidence?.level === 'medium' ? '#1e40af' : '#991b1b'
                    }}>
                      Confidence: {analysisResult.confidence?.level?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                </div>

                {/* Advisory Warning */}
                <div style={{ padding: '10px 14px', background: '#eff6ff', borderLeft: '4px solid #2563eb', borderRadius: '4px', fontSize: '13px', color: '#1e3a8a', marginBottom: '14px' }}>
                  ℹ️ <strong>Advisory Assistance:</strong> Proposed remediation steps are derived from historical resolution evidence. Automated execution is disabled by design. The triage analyst must verify applicability before execution.
                </div>

                {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                  analysisResult.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{rec.title}</h4>
                        <button
                          onClick={() => handleOpenFeedback('recommendation', rec.recommendation_id)}
                          style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          💬 Review Action
                        </button>
                      </div>

                      {/* Numbered Steps */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>ACTIONABLE REMEDIATION STEPS:</div>
                        <ol style={{ margin: '4px 0 0 18px', padding: 0, fontSize: '13px', color: '#1e293b' }}>
                          {rec.steps?.map((step, sIdx) => (
                            <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Verifiable Historical Evidence */}
                      {rec.evidence && rec.evidence.length > 0 && (
                        <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', marginTop: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                            📜 Traceable Supporting Historical Evidence (FR-04)
                          </div>
                          {rec.evidence.map((ev, eIdx) => (
                            <div key={eIdx} style={{ fontSize: '12px', color: '#334155' }}>
                              <div>Source ID: <strong style={{ color: '#0369a1' }}>{ev.source_id}</strong> ({ev.affected_service || 'Incident'})</div>
                              <blockquote style={{ margin: '4px 0', padding: '6px 10px', background: '#f0fdf4', borderLeft: '3px solid #22c55e', fontStyle: 'italic' }}>
                                "{ev.excerpt}"
                              </blockquote>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>Reason: {ev.relevance_reason}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Limitations */}
                      {rec.limitations && rec.limitations.length > 0 && (
                        <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '11px', color: '#64748b' }}>
                          {rec.limitations.map((lim, lIdx) => (
                            <li key={lIdx}>{lim}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '13px' }}>
                    <strong>Insufficient Historical Evidence:</strong> No verified historical incident contains a reusable resolution for these symptoms.
                    {analysisResult.clarification_questions && analysisResult.clarification_questions.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontWeight: 600 }}>Clarification Questions for Reporter:</div>
                        <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                          {analysisResult.clarification_questions.map((q, qIdx) => (
                            <li key={qIdx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: Similar Tickets & Duplicate Detection (FR-02) */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔍 Similar Historical Incidents & Duplicates (Phase 3)
                </h3>

                {analysisResult.similar_tickets && analysisResult.similar_tickets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {analysisResult.similar_tickets.map((st, sIdx) => (
                      <div key={sIdx} style={{
                        border: st.potential_duplicate ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '12px',
                        background: st.potential_duplicate ? '#fffbeb' : '#fafafa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <strong style={{ color: '#0f172a' }}>{st.ticket_id}</strong>: {st.title}
                            {st.potential_duplicate && (
                              <span style={{ marginLeft: '8px', background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                                ⚠️ POTENTIAL DUPLICATE ({st.duplicate_confidence ? (st.duplicate_confidence * 100).toFixed(0) + '%' : 'HIGH'})
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              Similarity: <strong>{(st.similarity_score * 100).toFixed(1)}%</strong>
                            </span>
                            <button
                              onClick={() => setSelectedTicketDetail(st)}
                              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleOpenFeedback('similar_ticket', st.ticket_id)}
                              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                            >
                              💬 Rate Match
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Reason: {st.match_reason || st.duplicate_reason || 'Similar reported symptoms'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>No similar historical tickets retrieved.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicketDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Ticket Details: {selectedTicketDetail.ticket_id}</h3>
            <p><strong>Title:</strong> {selectedTicketDetail.title}</p>
            <p><strong>Affected Service:</strong> {selectedTicketDetail.affected_service}</p>
            <p><strong>Category:</strong> {selectedTicketDetail.category}</p>
            <p><strong>Status:</strong> {selectedTicketDetail.status}</p>
            <p><strong>Description:</strong> {selectedTicketDetail.description_excerpt}</p>
            <p><strong>Similarity Score:</strong> {(selectedTicketDetail.similarity_score * 100).toFixed(1)}%</p>
            <button
              onClick={() => setSelectedTicketDetail(null)}
              style={{ marginTop: '16px', padding: '8px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Analyst Feedback Modal (FR-06) */}
      {feedbackModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px' }}>📝 Submit Analyst Feedback (FR-06)</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Target: <strong>{feedbackModal.target_type}</strong> ({feedbackModal.target_id})
            </p>

            <form onSubmit={handleSendFeedback}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Feedback Status *</label>
                <select
                  value={feedbackModal.feedback_status}
                  onChange={e => setFeedbackModal({ ...feedbackModal, feedback_status: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="useful">Useful (Accurate & Reusable)</option>
                  <option value="incorrect">Incorrect (Inapplicable or Wrong Action)</option>
                  <option value="unresolved">Unresolved (Partially relevant but incomplete)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Comments / Corrections (Optional)</label>
                <textarea
                  rows={3}
                  value={feedbackModal.comment}
                  onChange={e => setFeedbackModal({ ...feedbackModal, comment: e.target.value })}
                  placeholder="Provide technical notes or root-cause clarifications..."
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                  style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
