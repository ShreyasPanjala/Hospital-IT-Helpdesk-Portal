import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to={user ? '/dashboard' : '/'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Hospital IT Helpdesk
        </Link>
        <div className="d-flex gap-3 align-items-center">
          {user ? (
            <>
              <Link className="nav-link nav-link-custom" to="/dashboard">Dashboard</Link>
              <Link className="nav-link nav-link-custom" to="/create-ticket">Raise Ticket</Link>
              <Link className="nav-link nav-link-custom" to="/reports">Reports</Link>
              <span className="text-muted small d-none d-md-inline border-start ps-3 ms-2">
                <span className="fw-semibold text-dark">{user.name}</span> ({user.role})
              </span>
              <button className="btn btn-danger-custom btn-sm ms-2" onClick={signOut}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary-custom btn-sm" to="/">Login</Link>
              <Link className="btn btn-primary-custom btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
