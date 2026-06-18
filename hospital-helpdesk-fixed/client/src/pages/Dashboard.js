import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ticketRes, analyticsRes] = await Promise.all([
        api.get('/tickets'),
        api.get('/tickets/analytics/summary')
      ]);
      setTickets(ticketRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredTickets = filter === 'All'
    ? tickets
    : tickets.filter(t => t.status === filter);

  const statCards = analytics ? [
    { 
      label: 'Total Tickets', 
      value: analytics.total, 
      color: '#4f46e5',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    },
    { 
      label: 'Open', 
      value: analytics.byStatus?.Open || 0, 
      color: '#3b82f6',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    },
    { 
      label: 'In Progress', 
      value: analytics.byStatus?.['In Progress'] || 0, 
      color: '#f59e0b',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
    },
    { 
      label: 'SLA Overdue', 
      value: analytics.overdue, 
      color: '#ef4444',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    },
  ] : [];

  if (loading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4 animated-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-1 fw-bold text-dark">Dashboard &amp; Analytics</h2>
          <p className="text-muted mb-0">
            Welcome back, <span className="fw-semibold text-dark">{user?.name}</span>. Monitor ticket status, SLA queues, and hospital systems.
          </p>
        </div>
        <Link className="btn-primary-custom text-decoration-none" to="/create-ticket">
          <span className="me-1">+</span> Raise Ticket
        </Link>
      </div>

      {error && <div className="alert alert-danger rounded-4 shadow-sm">{error}</div>}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(s => (
          <div className="col-md-3 col-6" key={s.label}>
            <div className="card-custom stat-card-custom h-100" style={{ '--card-color': s.color }}>
              <div className="card-body d-flex align-items-center justify-content-between p-3">
                <div>
                  <div className="text-muted small fw-medium text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>{s.label}</div>
                  <h2 className="mb-0 fw-bold text-dark">{s.value}</h2>
                </div>
                <div className="stat-icon-wrapper" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-custom mb-4">
        <div className="card-body py-3 d-flex align-items-center gap-2 flex-wrap">
          <strong className="me-2 text-dark">Filter:</strong>
          {['All', 'Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map(item => (
            <button
              key={item}
              className={`filter-btn-custom ${filter === item ? 'active' : ''}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="table-container card-custom">
        <div className="table-responsive">
          <table className="table table-custom table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>SLA Due</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-5 text-muted">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted mb-2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                      <path d="M9 9h1" />
                    </svg>
                    <p className="mb-0 small">No IT support tickets in this queue.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => {
                  const overdue = !['Resolved', 'Closed'].includes(ticket.status) && new Date(ticket.slaDueAt) < new Date();
                  return (
                    <tr key={ticket.id}>
                      <td className="small fw-bold text-primary">{ticket.id}</td>
                      <td className="fw-semibold text-dark">{ticket.title}</td>
                      <td className="text-secondary small">{ticket.category}</td>
                      <td>
                        <span className={`badge-pill-custom priority-${ticket.priority.toLowerCase()}-pill`}>
                          <span className={`priority-${ticket.priority.toLowerCase()}-text`}>{ticket.priority}</span>
                        </span>
                      </td>
                      <td>
                        <span className={`badge-pill-custom badge-status-${ticket.status.toLowerCase().replace(' ', '')}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="text-dark small fw-medium">{ticket.assignedTo || 'Unassigned'}</td>
                      <td>
                        <span className={overdue ? 'text-danger fw-bold' : 'text-dark small'}>
                          {new Date(ticket.slaDueAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          {overdue && <span className="ms-1 small badge bg-danger text-uppercase">Overdue</span>}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link className="btn btn-sm btn-primary-custom" to={`/tickets/${ticket.id}`}>Manage</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}