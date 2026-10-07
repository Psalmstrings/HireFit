import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Briefcase, LogOut, Settings,
  Shield, Menu, X, User, ChevronDown, Sparkles
} from 'lucide-react';

const Navbar = ({ isMobileNavOpen = false, onToggleMobileNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Left Section: Mobile Menu Trigger + Brand */}
        <div className="navbar-left">
          {user && (
            <button
              type="button"
              className="mobile-hamburger-btn hide-desktop"
              onClick={onToggleMobileNav}
              aria-label={isMobileNavOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          <Link to={user ? '/dashboard' : '/'} className="navbar-brand" aria-label="HireFit Home">
            Hire<span className="brand-accent">Fit</span>
          </Link>
        </div>

        {/* Center / Desktop Navigation Links */}
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

            {/* Right Section: User Profile & Actions */}
            <div className="navbar-actions" ref={dropdownRef}>
              {/* Desktop User Tag */}
              <span className="text-sm text-muted hide-mobile" style={{ fontWeight: 500 }}>
                {user.name}
              </span>

              {/* User Avatar Button (Visible on all screens, primary for mobile) */}
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="navbar-avatar-btn"
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  aria-label="User profile and account options"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="avatar-initials">{getUserInitials(user.name)}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="navbar-user-dropdown" role="menu">
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                      {user.role === 'admin' && (
                        <span className="badge badge-primary mt-1">Admin</span>
                      )}
                    </div>
                    <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
                    <Link
                      to="/dashboard"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/cvs"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FileText size={15} /> My CV Library
                    </Link>
                    <Link
                      to="/optimizer"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Sparkles size={15} /> Optimize CV
                    </Link>
                    <div className="divider" style={{ margin: 'var(--space-2) 0' }} />
                    <button
                      type="button"
                      className="dropdown-menu-item text-danger"
                      role="menuitem"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop Explicit Logout Button */}
              <button
                className="btn btn-secondary btn-sm hide-mobile"
                onClick={logout}
                aria-label="Log out"
              >
                <LogOut size={14} />
                <span>Log out</span>
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

