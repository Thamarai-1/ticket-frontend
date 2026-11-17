import React from 'react';

const CATEGORIES = [
  'Network',
  'Access & Identity',
  'Hardware',
  'Software',
  'Server & Infrastructure',
  'Email & Collaboration'
];

const PRIORITIES = ['P1', 'P2', 'P3', 'P4'];

const STATUSES = ['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed'];

export default function TicketFilters({
  search,
  setSearch,
  category,
  setCategory,
  priority,
  setPriority,
  status,
  setStatus,
  onReset
}) {
  return (
    <div className="filter-card">
      <div className="filter-grid">
        <div className="input-group">
          <label className="input-label">Keyword Search</label>
          <input
            type="text"
            className="text-input"
            placeholder="Search symptoms, error codes (e.g. 0x80070005, VPN, DNS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Category</label>
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Priority</label>
          <select
            className="select-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Status</label>
          <select
            className="select-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ alignSelf: 'flex-end' }}>
          <button className="btn-secondary" onClick={onReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
