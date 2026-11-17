/**
 * api.js
 * Centralized API Client Service communicating strictly with Node.js Express Backend.
 * (Direct browser communication to MongoDB or FastAPI is forbidden by architecture rules).
 * All HTTP communication is executed using the shared axiosInstance.
 */

import axiosInstance from './axiosInstance';

export { axiosInstance };

const API_BASE = '/api/tickets';
const CLASSIFY_BASE = '/api/classify';

/**
 * Fetch paginated tickets or perform full-text search
 */
export const fetchTickets = async ({
  page = 1,
  limit = 20,
  category = '',
  priority = '',
  status = '',
  search = ''
} = {}) => {
  const params = { page, limit };
  if (category) params.category = category;
  if (priority) params.priority = priority;
  if (status) params.status = status;

  let endpoint = API_BASE;
  if (search && search.trim()) {
    endpoint = `${API_BASE}/search`;
    params.q = search.trim();
  }

  try {
    const response = await axiosInstance.get(endpoint, { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch tickets';
    throw new Error(message);
  }
};

/**
 * Fetch a single historical ticket by ID
 */
export const fetchTicketById = async (ticketId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/${encodeURIComponent(ticketId)}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || `Failed to fetch ticket ${ticketId}`;
    throw new Error(message);
  }
};

/**
 * Fetch dataset-wide aggregate metrics and statistics
 */
export const fetchStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/stats`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch dataset statistics';
    throw new Error(message);
  }
};

/**
 * Create a new ticket
 */
export const createTicket = async (ticketPayload) => {
  try {
    const response = await axiosInstance.post(API_BASE, ticketPayload, {
      headers: {
        'x-user-id': 'frontend_analyst'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create ticket';
    throw new Error(message);
  }
};

/**
 * Phase 2: Sends incoming ticket to Node.js backend for ML classification.
 */
export const classifyTicket = async (payload) => {
  try {
    const response = await axiosInstance.post(CLASSIFY_BASE, payload);
    return response.data;
  } catch (error) {
    if (error.response?.data?.fallback) {
      return {
        success: false,
        fallback: error.response.data.fallback,
        error: error.response.data.error
      };
    }
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Classification request failed';
    throw new Error(message);
  }
};

/**
 * Phase 3: Hybrid Similarity Retrieval and Potential Duplicate Detection.
 */
export const fetchSimilarTickets = async (payload) => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/similar`, payload, {
      headers: {
        'x-user-access-level': 'internal'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.fallback) {
      return {
        success: false,
        fallback: error.response.data.fallback,
        error: error.response.data.error
      };
    }
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Similarity retrieval failed';
    throw new Error(message);
  }
};

/**
 * Phase 4: Standalone Evidence-Backed Resolution Recommendation.
 */
export const fetchResolutionRecommendation = async (payload) => {
  try {
    const response = await axiosInstance.post(`${API_BASE}/recommend`, payload, {
      headers: {
        'x-user-access-level': 'internal'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.fallback) {
      return {
        success: false,
        fallback: error.response.data.fallback,
        error: error.response.data.error
      };
    }
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Recommendation failed';
    throw new Error(message);
  }
};

/**
 * Phase 5 & 6: Master Unified Analysis Pipeline.
 */
export const analyzeTicket = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/analyze', payload, {
      headers: {
        'x-user-access-level': 'internal'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Analysis request failed';
    throw new Error(message);
  }
};

/**
 * Phase 5: Submit Analyst Feedback (FR-06).
 */
export const submitFeedback = async (analysisId, feedbackPayload) => {
  try {
    const response = await axiosInstance.post(
      `/api/analyses/${encodeURIComponent(analysisId)}/feedback`,
      feedbackPayload
    );
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Feedback submission failed';
    throw new Error(message);
  }
};

/**
 * Phase 5: Historical Analysis Records.
 */
export const fetchAnalyses = async ({ page = 1, limit = 10, status = '', category = '' } = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (category) params.category = category;

  try {
    const response = await axiosInstance.get('/api/analyses', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch analysis records';
    throw new Error(message);
  }
};

/**
 * Phase 5: Single Analysis Details with Feedback.
 */
export const fetchAnalysisById = async (analysisId) => {
  try {
    const response = await axiosInstance.get(`/api/analyses/${encodeURIComponent(analysisId)}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || `Failed to fetch analysis ${analysisId}`;
    throw new Error(message);
  }
};

/**
 * Phase 5 & 6: Immutable Compliance Audit Trail (FR-08).
 */
export const fetchAuditLogs = async ({ page = 1, limit = 20, event_type = '', analysis_id = '' } = {}) => {
  const params = { page, limit };
  if (event_type) params.event_type = event_type;
  if (analysis_id) params.analysis_id = analysis_id;

  try {
    const response = await axiosInstance.get('/api/audit', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch audit event logs';
    throw new Error(message);
  }
};

export default axiosInstance;
