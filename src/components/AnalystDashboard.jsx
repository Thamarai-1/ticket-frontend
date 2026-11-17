/**
 * AnalystDashboard.jsx
 * Unified AI Ticket Analysis and Resolution Console.
 */

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Layers,
  Tags,
  MessageSquare,
  ExternalLink,
  Clock,
  Search,
  X
} from 'lucide-react';
import { analyzeTicket, submitFeedback } from '../services/api';

export default function AnalystDashboard() {
  const [formData, setFormData] = useState({
    ticket_id: '',
    title: '',
    description: '',
    affected_service: '',
    environment: 'Production',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide a ticket title and description.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setFeedbackSuccessMsg('');

    try {
      const result = await analyzeTicket(formData);
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        setError(result.error || 'Failed to complete analysis');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with analysis service');
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
      setFeedbackSuccessMsg(`Feedback recorded for ${feedbackModal.target_id}`);
      setFeedbackModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      alert(`Feedback submission error: ${err.message}`);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 20px 0' }}>
      {/* Sub-Header Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '14px',
        borderBottom: '1px solid #e4e4e7',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 3px 0', color: '#09090b' }}>
            Analyst Console
          </h2>
          <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>
            Incident triage, semantic retrieval, and resolution recommendation workspace.
          </p>
        </div>

      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Ticket Input */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          padding: '20px',
          color: '#09090b'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            marginTop: 0,
            marginBottom: '14px',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={16} />
            <span>Submit Incident</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                Ticket ID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. INC-1042"
                value={formData.ticket_id}
                onChange={e => setFormData({ ...formData, ticket_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d4d4d8',
                  background: '#ffffff',
                  color: '#09090b',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. GlobalProtect VPN drops after authentication"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d4d4d8',
                  background: '#ffffff',
                  color: '#09090b',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Enter reported user symptoms, error codes, logs..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d4d4d8',
                  background: '#ffffff',
                  color: '#09090b',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                  Affected Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. Corporate VPN"
                  value={formData.affected_service}
                  onChange={e => setFormData({ ...formData, affected_service: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d4d4d8',
                    background: '#ffffff',
                    color: '#09090b',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                  Environment
                </label>
                <select
                  value={formData.environment}
                  onChange={e => setFormData({ ...formData, environment: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d4d4d8',
                    background: '#ffffff',
                    color: '#09090b',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#09090b' }}>
                Generation Mode
              </label>
              <select
                value={formData.generation_mode}
                onChange={e => setFormData({ ...formData, generation_mode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #d4d4d8',
                  background: '#ffffff',
                  color: '#09090b',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option value="deterministic">Deterministic Engine (Verified Rules &amp; Evidence)</option>
                <option value="rag">Grounded RAG (Strict Citation)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: loading ? '#71717a' : '#09090b',
                color: '#ffffff',
                border: '1px solid #09090b',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={15} />
              <span>{loading ? 'Analyzing Incident...' : 'Analyze Incident'}</span>
            </button>
          </form>

          {feedbackSuccessMsg && (
            <div style={{
              marginTop: '14px',
              padding: '9px 12px',
              background: '#f4f4f5',
              border: '1px solid #09090b',
              color: '#09090b',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={15} />
              <span>{feedbackSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Results */}
        <div>
          {error && (
            <div style={{
              padding: '14px',
              background: '#f4f4f5',
              border: '1px solid #09090b',
              color: '#09090b',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              <span><strong>Error:</strong> {error}</span>
            </div>
          )}

          {!analysisResult && !loading && (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #d4d4d8',
              borderRadius: '8px',
              padding: '56px 24px',
              textAlign: 'center',
              color: '#71717a'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <Search size={36} strokeWidth={1.5} color="#71717a" />
              </div>
              <h3 style={{ margin: '0 0 6px 0', color: '#09090b', fontSize: '16px', fontWeight: 600 }}>
                No Incident Analyzed Yet
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#71717a' }}>
                Select a preset on the left or enter ticket details, then click "Analyze Incident".
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#09090b'
            }}>
              <div style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid #e4e4e7',
                borderTopColor: '#09090b',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '16px', color: '#09090b', fontSize: '13px', fontWeight: 500 }}>
                Analyzing incident: querying taxonomy classification, FAISS &amp; BM25 indexes, synthesizing resolution evidence...
              </p>
            </div>
          )}

          {analysisResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pipeline Status Banner */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                color: '#09090b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#71717a' }}>
                    Analysis ID: <strong style={{ color: '#09090b', fontFamily: 'var(--font-mono)' }}>{analysisResult.analysis_id}</strong>
                  </span>
                  <span style={{ color: '#d4d4d8' }}>•</span>
                  <span style={{
                    background: '#09090b',
                    color: '#ffffff',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>
                    {analysisResult.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '12px', alignItems: 'center' }}>
                  <span style={{ background: '#f4f4f5', color: '#09090b', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e4e4e7', fontSize: '11px' }}>
                    Classifier: <strong>{analysisResult.component_statuses?.classification || 'OK'}</strong>
                  </span>
                  <span style={{ background: '#f4f4f5', color: '#09090b', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e4e4e7', fontSize: '11px' }}>
                    Retrieval: <strong>{analysisResult.component_statuses?.retrieval || 'OK'}</strong>
                  </span>
                  <span style={{ background: '#f4f4f5', color: '#09090b', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e4e4e7', fontSize: '11px' }}>
                    Recommendations: <strong>{analysisResult.component_statuses?.recommendation || 'OK'}</strong>
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#09090b',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '11px'
                  }}>
                    <Clock size={12} />
                    <span>{analysisResult.execution_latency_ms?.total || 24}ms</span>
                  </span>
                </div>
              </div>

              {/* SECTION 1: Classification */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                padding: '16px',
                color: '#09090b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#09090b' }}>
                    <Tags size={16} />
                    <span>Incident Classification</span>
                  </h3>
                  <button
                    onClick={() => handleOpenFeedback('classification', analysisResult.ticket_id)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #d4d4d8',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      color: '#09090b',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageSquare size={11} />
                    <span>Feedback</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>CATEGORY</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                      {analysisResult.classification?.category || 'Unknown'}
                    </div>
                  </div>

                  <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>SUBCATEGORY</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                      {analysisResult.classification?.subcategory || 'N/A'}
                    </div>
                  </div>

                  <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>CONFIDENCE</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                      {analysisResult.classification?.confidence_score
                        ? (analysisResult.classification.confidence_score * 100).toFixed(1) + '%'
                        : '0%'}
                    </div>
                  </div>

                  <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>PRIORITY &amp; INTENT</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#09090b', marginTop: '2px' }}>
                      {analysisResult.classification?.priority || 'P3'} ({analysisResult.classification?.intent || 'Incident'})
                    </div>
                  </div>
                </div>

                {analysisResult.classification?.review_required && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#f4f4f5',
                    border: '1px solid #09090b',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#09090b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <AlertTriangle size={14} />
                    <span><strong>Human Review Required:</strong> {analysisResult.classification.review_reason}</span>
                  </div>
                )}
              </div>

              {/* SECTION 2: Suggested Resolution */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                padding: '16px',
                color: '#09090b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#09090b' }}>
                    <CheckCircle2 size={16} />
                    <span>Resolution Recommendations</span>
                  </h3>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: '#09090b',
                    color: '#ffffff'
                  }}>
                    Confidence: {analysisResult.confidence?.level?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>

                {/* Advisory Warning */}
                <div style={{
                  padding: '9px 12px',
                  background: '#f4f4f5',
                  border: '1px solid #e4e4e7',
                  borderLeft: '3px solid #09090b',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#09090b',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Info size={15} />
                  <span><strong>Advisory Assistance:</strong> Proposed remediation steps are derived from historical evidence. The analyst must verify applicability prior to execution.</span>
                </div>

                {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                  analysisResult.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} style={{
                      background: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '6px',
                      padding: '14px',
                      marginBottom: '12px',
                      color: '#09090b'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#09090b' }}>{rec.title}</h4>
                        <button
                          onClick={() => handleOpenFeedback('recommendation', rec.recommendation_id)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #d4d4d8',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            color: '#09090b',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <MessageSquare size={11} />
                          <span>Review</span>
                        </button>
                      </div>

                      {/* Numbered Steps */}
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>
                          Remediation Steps
                        </div>
                        <ol style={{ margin: '4px 0 0 18px', padding: 0, fontSize: '13px', color: '#09090b' }}>
                          {rec.steps?.map((step, sIdx) => (
                            <li key={sIdx} style={{ marginBottom: '3px' }}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Supporting Evidence */}
                      {rec.evidence && rec.evidence.length > 0 && (
                        <div style={{
                          background: '#f4f4f5',
                          border: '1px solid #e4e4e7',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          marginTop: '8px',
                          color: '#09090b'
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#09090b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FileText size={12} />
                            <span>Supporting Historical Evidence</span>
                          </div>
                          {rec.evidence.map((ev, eIdx) => (
                            <div key={eIdx} style={{ fontSize: '12px', color: '#09090b', marginTop: '6px' }}>
                              <div>Source ID: <strong style={{ color: '#09090b', fontFamily: 'var(--font-mono)' }}>{ev.source_id}</strong> ({ev.affected_service || 'Incident'})</div>
                              <blockquote style={{
                                margin: '4px 0',
                                padding: '6px 10px',
                                background: '#ffffff',
                                border: '1px solid #e4e4e7',
                                borderLeft: '3px solid #09090b',
                                fontStyle: 'italic',
                                color: '#09090b'
                              }}>
                                "{ev.excerpt}"
                              </blockquote>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>Reason: {ev.relevance_reason}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Limitations */}
                      {rec.limitations && rec.limitations.length > 0 && (
                        <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '11px', color: '#71717a' }}>
                          {rec.limitations.map((lim, lIdx) => (
                            <li key={lIdx}>{lim}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{
                    padding: '12px',
                    background: '#f4f4f5',
                    border: '1px solid #09090b',
                    borderRadius: '6px',
                    color: '#09090b',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={15} />
                      <strong>Insufficient Historical Evidence:</strong> No verified historical incident contains a reusable resolution for these symptoms.
                    </div>
                    {analysisResult.clarification_questions && analysisResult.clarification_questions.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontWeight: 600, fontSize: '12px' }}>Clarification Questions for Reporter:</div>
                        <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: '12px' }}>
                          {analysisResult.clarification_questions.map((q, qIdx) => (
                            <li key={qIdx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: Similar Incidents & Duplicates */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                padding: '16px',
                color: '#09090b'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#09090b' }}>
                  <Layers size={16} />
                  <span>Similar Incidents &amp; Duplicates</span>
                </h3>

                {analysisResult.similar_tickets && analysisResult.similar_tickets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysisResult.similar_tickets.map((st, sIdx) => (
                      <div key={sIdx} style={{
                        border: st.potential_duplicate ? '1px solid #09090b' : '1px solid #e4e4e7',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        background: st.potential_duplicate ? '#f4f4f5' : '#ffffff',
                        color: '#09090b'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <strong style={{ color: '#09090b', fontFamily: 'var(--font-mono)' }}>{st.ticket_id}</strong>: {st.title}
                            {st.potential_duplicate && (
                              <span style={{
                                marginLeft: '8px',
                                background: '#09090b',
                                color: '#ffffff',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}>
                                <AlertTriangle size={11} />
                                <span>Duplicate ({(st.duplicate_confidence ? (st.duplicate_confidence * 100).toFixed(0) : '85')}%)</span>
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#71717a' }}>
                              Similarity: <strong style={{ color: '#09090b' }}>{(st.similarity_score * 100).toFixed(1)}%</strong>
                            </span>
                            <button
                              onClick={() => setSelectedTicketDetail(st)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #d4d4d8',
                                color: '#09090b',
                                borderRadius: '4px',
                                padding: '3px 7px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <ExternalLink size={11} />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => handleOpenFeedback('similar_ticket', st.ticket_id)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #d4d4d8',
                                color: '#09090b',
                                borderRadius: '4px',
                                padding: '3px 7px',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <MessageSquare size={11} />
                              <span>Rate</span>
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#71717a', marginTop: '3px' }}>
                          Reason: {st.match_reason || st.duplicate_reason || 'Similar reported symptoms'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>No similar historical tickets retrieved.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicketDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            color: '#09090b',
            border: '1px solid #e4e4e7',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#09090b', fontSize: '16px' }}>Incident: {selectedTicketDetail.ticket_id}</h3>
              <button
                onClick={() => setSelectedTicketDetail(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Title:</strong> {selectedTicketDetail.title}</p>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Service:</strong> {selectedTicketDetail.affected_service}</p>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Category:</strong> {selectedTicketDetail.category}</p>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Status:</strong> {selectedTicketDetail.status}</p>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Description:</strong> {selectedTicketDetail.description_excerpt}</p>
            <p style={{ margin: '6px 0', fontSize: '13px' }}><strong>Similarity:</strong> {(selectedTicketDetail.similarity_score * 100).toFixed(1)}%</p>
            <div style={{ textAlign: 'right', marginTop: '18px' }}>
              <button
                onClick={() => setSelectedTicketDetail(null)}
                style={{
                  padding: '7px 16px',
                  background: '#09090b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analyst Feedback Modal */}
      {feedbackModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            color: '#09090b',
            border: '1px solid #e4e4e7',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#09090b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} />
                <span>Submit Feedback</span>
              </h3>
              <button
                onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#71717a', margin: '0 0 14px 0' }}>
              Target: <strong>{feedbackModal.target_type}</strong> ({feedbackModal.target_id})
            </p>

            <form onSubmit={handleSendFeedback}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#09090b' }}>
                  Feedback Status *
                </label>
                <select
                  value={feedbackModal.feedback_status}
                  onChange={e => setFeedbackModal({ ...feedbackModal, feedback_status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d4d4d8',
                    background: '#ffffff',
                    color: '#09090b',
                    fontSize: '13px'
                  }}
                >
                  <option value="useful">Useful (Accurate &amp; Reusable)</option>
                  <option value="incorrect">Incorrect (Inapplicable or Wrong Action)</option>
                  <option value="unresolved">Unresolved (Partially relevant but incomplete)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#09090b' }}>
                  Comments / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackModal.comment}
                  onChange={e => setFeedbackModal({ ...feedbackModal, comment: e.target.value })}
                  placeholder="Provide technical notes or root-cause clarifications..."
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d4d4d8',
                    background: '#ffffff',
                    color: '#09090b',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
                  style={{
                    padding: '7px 14px',
                    background: '#ffffff',
                    color: '#09090b',
                    border: '1px solid #d4d4d8',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  style={{
                    padding: '7px 16px',
                    background: '#09090b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
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
