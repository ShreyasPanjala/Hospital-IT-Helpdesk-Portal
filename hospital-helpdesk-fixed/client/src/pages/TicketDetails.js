import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ status: '', assignedTo: '', resolutionNote: '', note: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const isManager = ['admin', 'technician'].includes(user?.role);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tickets');
      const found = data.find(t => t.id === id);
      if (!found) {
        setTicket(null);
        setLoading(false);
        return;
      }
      setTicket(found);
      setForm({
        status: found.status || '',
        assignedTo: found.assignedTo || '',
        resolutionNote: found.resolutionNote || '',
        note: ''
      });
      if (isManager) {
        try {
          const u = await api.get('/auth/users');
          setUsers(u.data.filter(x => ['technician', 'admin'].includes(x.role)));
        } catch {
          // Users list is non-critical; continue without it
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  }, [id, isManager]);

  useEffect(() => { load(); }, [load]);

  const update = async e => {
    e.preventDefault();
    setUpdateError('');
    try {
      const { data } = await api.patch(`/tickets/${id}`, form);
      setTicket(data);
      setForm(prev => ({ ...prev, note: '' }));
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update ticket.');
    }
  };

  if (loading) {
    return (
      <main className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return <main className="container py-4"><div className="alert alert-danger">{error}</div></main>;
  }

  if (!ticket) {
    return <main className="container py-4"><div className="alert alert-warning">Ticket not found.</div></main>;
  }

  const overdue = !['Resolved', 'Closed'].includes(ticket.status) && new Date(ticket.slaDueAt) < new Date();

  return (
    <main className="container py-4 animated-fade-in">
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn-secondary-custom btn-sm py-1 px-3 d-inline-flex align-items-center gap-1 text-decoration-none" onClick={() => window.history.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>
      </div>

      <div className="card-custom mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
            <div>
              <span className="text-primary small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>Ticket Details</span>
              <h3 className="fw-bold text-dark mt-1 mb-2">{ticket.title}</h3>
              <p className="text-muted mb-0 small">
                ID: <span className="fw-semibold text-primary">{ticket.id}</span> · Raised by <span className="fw-semibold text-dark">{ticket.createdByName}</span>
              </p>
            </div>
            <span className={`badge-pill-custom fs-6 ${overdue ? 'bg-danger text-white' : 'bg-success text-white'}`}>
              {overdue ? 'SLA Overdue' : 'Within SLA'}
            </span>
          </div>
          
          <hr style={{ borderColor: 'var(--card-border)' }} />
          
          <div className="row g-4 my-1">
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block mb-1">Category</span>
              <span className="fw-semibold text-dark">{ticket.category}</span>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block mb-1">Priority</span>
              <span className={`badge-pill-custom priority-${ticket.priority.toLowerCase()}-pill`}>
                <span className={`priority-${ticket.priority.toLowerCase()}-text`}>{ticket.priority}</span>
              </span>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block mb-1">Status</span>
              <span className={`badge-pill-custom badge-status-${ticket.status.toLowerCase().replace(' ', '')}`}>
                {ticket.status}
              </span>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block mb-1">SLA Due Date</span>
              <span className="fw-semibold text-dark">{new Date(ticket.slaDueAt).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <strong className="text-dark d-block mb-2">Description</strong>
            <p className="mb-0 text-secondary" style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
          </div>
          
          <div className="mt-3 p-3 rounded-3" style={{ background: ticket.resolutionNote ? '#f0fdf4' : '#f8fafc', border: ticket.resolutionNote ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }}>
            <strong className="text-dark d-block mb-2">Resolution Note</strong>
            <p className="mb-0 text-secondary">{ticket.resolutionNote || 'No resolution note added yet.'}</p>
          </div>
        </div>
      </div>

      {isManager && (
        <div className="card-custom mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Technician Assignment &amp; Resolution Panel
            </h5>
            {updateError && <div className="alert alert-danger rounded-3 shadow-sm">{updateError}</div>}
            
            <form onSubmit={update} className="row g-3">
              <div className="col-md-4">
                <label className="form-label-custom">Status</label>
                <select className="form-control-custom form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">Assign Technician</label>
                <select className="form-control-custom form-select" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label-custom">Activity Log Comment</label>
                <input className="form-control-custom form-control" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="e.g. Checking lab router / Ward visited" />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Resolution Notes (When Resolving Issue)</label>
                <textarea className="form-control-custom form-control" rows="3" value={form.resolutionNote} onChange={e => setForm({ ...form, resolutionNote: e.target.value })} placeholder="State details of the final resolution..." />
              </div>
              <div className="col-12 mt-3">
                <button className="btn-primary-custom" type="submit">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-custom">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
            Ticket History &amp; Activity Logs
          </h5>
          <div className="timeline-custom">
            {ticket.history.map((h, i) => (
              <div key={i} className="timeline-item-custom">
                <div className="timeline-dot-custom" style={{ borderColor: i === 0 ? 'var(--primary-color)' : '#94a3b8' }}></div>
                <span className="timeline-time-custom">
                  {new Date(h.at).toLocaleString()} by <span className="fw-bold text-dark">{h.by}</span>
                </span>
                <div className="timeline-content-custom shadow-sm">
                  <strong className="text-dark small d-block mb-1">{h.action}</strong>
                  {h.note && <p className="mb-0 mt-1 text-secondary small">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
