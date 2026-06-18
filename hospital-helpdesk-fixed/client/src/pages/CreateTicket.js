import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const categories = ['Computer Hardware', 'Printer', 'Software Application', 'Network Connectivity', 'Medical Support System', 'Email/Account Access'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', category: 'Computer Hardware', priority: 'Medium', system: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = async e => { 
    e.preventDefault(); 
    setError(''); 
    try { 
      const { data } = await api.post('/tickets', form); 
      navigate(`/tickets/${data.id}`); 
    } catch (err) { 
      setError(err.response?.data?.message || 'Could not create ticket'); 
    } 
  };

  return (
    <main className="container py-4 animated-fade-in">
      <div className="card-custom">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="stat-icon-wrapper" style={{ width: '56px', height: '56px', borderRadius: '14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <div>
              <h3 className="fw-bold mb-1">Raise IT Service Request</h3>
              <p className="text-muted mb-0">Select category, priority, and describe the technical problem clearly.</p>
            </div>
          </div>
          
          {error && <div className="alert alert-danger rounded-3 shadow-sm">{error}</div>}
          
          <form onSubmit={submit} className="row g-4">
            <div className="col-md-8">
              <label className="form-label-custom">Issue Title</label>
              <input name="title" className="form-control-custom form-control" value={form.title} onChange={change} required placeholder="e.g. Printer offline in Pharmacy Ward" />
            </div>
            <div className="col-md-4">
              <label className="form-label-custom">Affected System / Location</label>
              <input name="system" className="form-control-custom form-control" value={form.system} onChange={change} placeholder="e.g. OPD printer / Lab PC" />
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Issue Category</label>
              <select name="category" className="form-control-custom form-select" value={form.category} onChange={change}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Priority Level</label>
              <select name="priority" className="form-control-custom form-select" value={form.priority} onChange={change}>
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label-custom">Detailed Problem Description</label>
              <textarea name="description" className="form-control-custom form-control" rows="5" value={form.description} onChange={change} required placeholder="Describe what happened, any error messages, and steps taken..." />
            </div>
            <div className="col-12 d-flex gap-3 mt-4">
              <button className="btn-primary-custom" type="submit">Submit Ticket</button>
              <button className="btn-secondary-custom" type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
