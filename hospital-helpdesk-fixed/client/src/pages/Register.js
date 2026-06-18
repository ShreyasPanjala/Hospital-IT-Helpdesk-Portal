import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', role: 'staff' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    try { 
      await register(form); 
      navigate('/dashboard'); 
    } catch (err) { 
      setError(err.response?.data?.message || 'Registration failed'); 
    } 
  };

  return (
    <main className="auth-page animated-fade-in">
      <section className="auth-card-custom">
        <div className="d-flex justify-content-center mb-3">
          <div className="stat-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
        </div>
        <h2 className="fw-bold text-dark text-center mb-1" style={{ fontSize: '1.65rem' }}>Create Account</h2>
        <p className="text-muted text-center small mb-4">Register to access IT Helpdesk Portal services.</p>
        
        {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}
        
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label-custom">Full Name</label>
            <input name="name" className="form-control-custom form-control" placeholder="Dr. John Doe" value={form.name} onChange={change} required />
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <input name="email" className="form-control-custom form-control" placeholder="john.doe@hospital.com" type="email" value={form.email} onChange={change} required />
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Password</label>
            <input name="password" className="form-control-custom form-control" placeholder="Minimum 6 characters" type="password" value={form.password} onChange={change} required />
          </div>
          <div className="mb-3">
            <label className="form-label-custom">Department / Ward / Location</label>
            <input name="department" className="form-control-custom form-control" placeholder="e.g. ICU / Pediatrics / Admin Office" value={form.department} onChange={change} />
          </div>
          <div className="mb-4">
            <label className="form-label-custom">System Access Role</label>
            <select name="role" className="form-control-custom form-select" value={form.role} onChange={change}>
              <option value="staff">Hospital Staff (Raise tickets)</option>
              <option value="technician">IT Technician (Resolve tickets)</option>
              <option value="admin">System Administrator (Manage all)</option>
            </select>
          </div>
          <button className="btn-primary-custom w-100" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 mb-0 text-center text-muted small">Already registered? <Link className="text-primary fw-medium text-decoration-none" to="/">Sign In</Link></p>
      </section>
    </main>
  );
}
