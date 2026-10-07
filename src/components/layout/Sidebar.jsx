import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Briefcase, Search, Zap, MessageSquare,
  BookOpen, TrendingUp, Shield, PlusCircle, X, LogOut, User
} from 'lucide-react';

const navItems = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' }
    ]
  },
  {
    section: 'CV Tools',
    items: [
      { to: '/cvs', icon: <FileText size={18} />, label: 'My CV Library' },
      { to: '/optimizer', icon: <Zap size={18} />, label: 'Optimize CV' },
      { to: '/cvs/upload', icon: <PlusCircle size={18} />, label: 'Upload CV' },
      { to: '/jobs', icon: <Search size={18} />, label: 'Analyze Job' },
    ]
  },
  {
    section: 'AI Features',
    items: [
      { to: '/skills-gap', icon: <TrendingUp size={18} />, label: 'Skills Gap' },
      { to: '/cover-letters', icon: <MessageSquare size={18} />, label: 'Cover Letter' },
      { to: '/interviews', icon: <BookOpen size={18} />, label: 'Interview Prep' },
    ]
  },
  {
    section: 'Track',
    items: [
      { to: '/applications', icon: <Briefcase size={18} />, label: 'Applications' },
    ]
  }
];

const Sidebar = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Application navigation"
      >
        {/* Mobile-only header inside drawer */}
        <div className="sidebar-mobile-header hide-desktop">
          <div className="drawer-header-brand">
            <Link to="/dashboard" onClick={handleLinkClick} className="navbar-brand">
              Hire<span className="brand-accent">Fit</span>
            </Link>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card on Mobile */}
        {user && (
          <div className="sidebar-user-card hide-desktop">
            <div className="sidebar-user-avatar">
              {getUserInitials(user.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Navigation sections */}
        <div className="sidebar-scroll-area">
          {navItems.map(section => (
            <div key={section.section} className="sidebar-section">
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          {user?.role === 'admin' && (
            <div className="sidebar-section">
              <div className="sidebar-section-label">Admin</div>
              <NavLink
                to="/admin"
                onClick={handleLinkClick}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                <Shield size={18} />
                <span>Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile-only bottom logout */}
        {user && (
          <div className="sidebar-mobile-footer hide-desktop">
            <button
              type="button"
              className="btn btn-secondary sidebar-logout-btn"
              onClick={() => {
                if (onClose) onClose();
                logout();
              }}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

