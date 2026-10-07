import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, LogOut, Settings, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand" aria-label="HireFit Home">
          Hire<span className="brand-accent">Fit</span>
        </Link>

        {user ? (
          <>
            <div className="navbar-nav hide-mobile">
              <Link to="/dashboard" className={`nav-link${location.pathname === '/dashboard' ? ' active' : ''}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/cvs" className={`nav-link${location.pathname.startsWith('/cvs') ? ' active' : ''}`}>
                <FileText size={15} /> My CVs
              </Link>
              <Link to="/applications" className={`nav-link${location.pathname.startsWith('/applications') ? ' active' : ''}`}>
                <Briefcase size={15} /> Applications
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link${location.pathname.startsWith('/admin') ? ' active' : ''}`}>
                  <Shield size={15} /> Admin
                </Link>
              )}
            </div>
            <div className="navbar-actions">
              <span className="text-sm text-muted hide-mobile" style={{ fontWeight: 500 }}>
                {user.name}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={logout}
                aria-label="Log out"
              >
                <LogOut size={14} />
                <span className="hide-mobile">Log out</span>
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
