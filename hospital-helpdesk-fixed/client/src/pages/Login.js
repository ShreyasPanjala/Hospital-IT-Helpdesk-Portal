import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const submit = async (e) => {
    e.preventDefault(); 
    setError('');
    try { 
      await login(form); 
      navigate('/dashboard'); 
    } catch (err) { 
      setError(err.response?.data?.message || 'Login failed'); 
    }
  };

  return (
    <main className="auth-page animated-fade-in">
      <section className="auth-card-custom text-center">
        <div className="d-flex justify-content-center mb-3">
          <div className="stat-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
        </div>
        <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.65rem' }}>Hospital IT Portal</h2>
        <p className="text-muted small mb-4">Login to raise and track IT support tickets.</p>
        
        {error && <div className="alert alert-danger rounded-3 small py-2">{error}</div>}
        
        <form onSubmit={submit}>
          <div className="mb-3 text-start">
            <label className="form-label-custom">Email Address</label>
            <input className="form-control-custom form-control" placeholder="name@hospital.com" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label-custom">Password</label>
            <input className="form-control-custom form-control" placeholder="••••••••" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn-primary-custom w-100" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 mb-0 text-muted small">New user? <Link className="text-primary fw-medium text-decoration-none" to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
