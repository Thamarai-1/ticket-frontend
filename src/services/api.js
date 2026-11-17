/**
 * api.js
 * Centralized API Client Service communicating strictly with Node.js Express Backend.
 * (Direct browser communication to MongoDB or FastAPI is forbidden by architecture rules).
 */

const API_BASE = '/api/tickets';
const CLASSIFY_BASE = '/api/classify';

export const fetchTickets = async ({
  page = 1,
  limit = 20,
  category = '',
  priority = '',
  status = '',
  search = ''
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);

  if (category) params.append('category', category);
  if (priority) params.append('priority', priority);
  if (status) params.append('status', status);

  let endpoint = API_BASE;
  if (search && search.trim()) {
    endpoint = `${API_BASE}/search`;
    params.append('q', search.trim());
  }

  const url = `${endpoint}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const fetchTicketById = async (ticketId) => {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(ticketId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch ticket ${ticketId}`);
  }
  return response.json();
};

export const fetchStats = async () => {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch dataset statistics');
  }
  return response.json();
};

export const createTicket = async (ticketPayload) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'frontend_analyst'
    },
    body: JSON.stringify(ticketPayload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create ticket');
  }

  return response.json();
};

/**
 * Phase 2: Sends incoming ticket to Node.js backend for ML classification.
 */
export const classifyTicket = async (payload) => {
  const response = await fetch(CLASSIFY_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (data.fallback) {
      return { success: false, fallback: data.fallback, error: data.error };
    }
    throw new Error(data.error || `Classification failed with status ${response.status}`);
  }

  return data;
};

/**
 * Phase 3: Hybrid Similarity Retrieval and Potential Duplicate Detection.
 */
export const fetchSimilarTickets = async (payload) => {
  const response = await fetch(`${API_BASE}/similar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-access-level': 'internal'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (data.fallback) {
      return { success: false, fallback: data.fallback, error: data.error };
    }
    throw new Error(data.error || `Similarity retrieval failed with status ${response.status}`);
  }

  return data;
};

/**
 * Phase 4: Standalone Evidence-Backed Resolution Recommendation.
 */
export const fetchResolutionRecommendation = async (payload) => {
  const response = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-access-level': 'internal'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (data.fallback) {
      return { success: false, fallback: data.fallback, error: data.error };
    }
    throw new Error(data.error || `Recommendation failed with status ${response.status}`);
  }

  return data;
};

/**
 * Phase 5 & 6: Master Unified Analysis Pipeline.
 */
export const analyzeTicket = async (payload) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-access-level': 'internal'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Analysis failed with status ${response.status}`);
  }

  return data;
};

/**
 * Phase 5: Submit Analyst Feedback (FR-06).
 */
export const submitFeedback = async (analysisId, feedbackPayload) => {
  const response = await fetch(`/api/analyses/${encodeURIComponent(analysisId)}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedbackPayload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Feedback submission failed with status ${response.status}`);
  }

  return data;
};

/**
 * Phase 5: Historical Analysis Records.
 */
export const fetchAnalyses = async ({ page = 1, limit = 10, status = '', category = '' } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);
  if (category) params.append('category', category);

  const response = await fetch(`/api/analyses?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch analysis records');
  }
  return response.json();
};

/**
 * Phase 5: Single Analysis Details with Feedback.
 */
export const fetchAnalysisById = async (analysisId) => {
  const response = await fetch(`/api/analyses/${encodeURIComponent(analysisId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch analysis ${analysisId}`);
  }
  return response.json();
};

/**
 * Phase 5 & 6: Immutable Compliance Audit Trail (FR-08).
 */
export const fetchAuditLogs = async ({ page = 1, limit = 20, event_type = '', analysis_id = '' } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (event_type) params.append('event_type', event_type);
  if (analysis_id) params.append('analysis_id', analysis_id);

  const response = await fetch(`/api/audit?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch audit event logs');
  }
  return response.json();
};
