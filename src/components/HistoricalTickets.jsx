import React, { useState, useEffect, useCallback } from 'react';
import { fetchTickets, fetchStats } from '../services/api';
import TicketStatsBanner from './TicketStatsBanner';
import TicketFilters from './TicketFilters';
import TicketList from './TicketList';
import TicketDetailModal from './TicketDetailModal';

export default function HistoricalTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Load stats once on mount
  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const res = await fetchStats();
        if (isMounted && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Could not load statistics banner:', err.message);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch tickets with debounce on search
  const loadTickets = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTickets({
        page: targetPage,
        limit: pagination.limit,
        category,
        priority,
        status,
        search
      });

      if (res.success) {
        setTickets(res.data);
        setPagination((prev) => ({
          ...prev,
          page: res.pagination.page,
          total: res.pagination.total,
          totalPages: res.pagination.totalPages
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load tickets from backend service');
    } finally {
      setLoading(false);
    }
  }, [category, priority, status, search, pagination.limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadTickets(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [category, priority, status, search, loadTickets]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setPriority('');
    setStatus('');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadTickets(newPage);
    }
  };

  return (
    <div>
      <TicketStatsBanner stats={stats} loading={loading && !stats} />

      <TicketFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="alert-box alert-error">
          <strong>Backend Error: </strong> {error}
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => loadTickets(pagination.page)}>
              Retry Request
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="table-container loading-spinner">
          <span>Loading historical tickets from MongoDB...</span>
        </div>
      ) : (
        <TicketList
          tickets={tickets}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        />
      )}

      {/* Pagination Bar */}
      <div className="pagination-wrapper">
        <div>
          Showing {tickets.length} of {pagination.total} tickets (Page {pagination.page} of{' '}
          {pagination.totalPages})
        </div>

        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={pagination.page <= 1 || loading}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>

          <span style={{ fontSize: '0.8rem', padding: '0 0.5rem' }}>
            Page {pagination.page}
          </span>

          <button
            className="page-btn"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
