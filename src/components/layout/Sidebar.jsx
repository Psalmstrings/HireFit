import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Briefcase, Search, Zap, MessageSquare,
  BookOpen, TrendingUp, Shield, PlusCircle
} from 'lucide-react';

const navItems = [
  {
    section: 'Overview',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' }
    ]
  },
  {
    section: 'CV Tools',
    items: [
      { to: '/cvs', icon: <FileText size={16} />, label: 'My CV Library' },
      { to: '/optimizer', icon: <Zap size={16} />, label: 'Optimize CV' },
      { to: '/cvs/upload', icon: <PlusCircle size={16} />, label: 'Upload CV' },
      { to: '/jobs', icon: <Search size={16} />, label: 'Analyze Job' },
    ]
  },
  {
    section: 'AI Features',
    items: [
      { to: '/skills-gap', icon: <TrendingUp size={16} />, label: 'Skills Gap' },
      { to: '/cover-letters', icon: <MessageSquare size={16} />, label: 'Cover Letter' },
      { to: '/interviews', icon: <BookOpen size={16} />, label: 'Interview Prep' },
    ]
  },
  {
    section: 'Track',
    items: [
      { to: '/applications', icon: <Briefcase size={16} />, label: 'Applications' },
    ]
  }
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar" aria-label="Application navigation">
      {navItems.map(section => (
        <div key={section.section} className="sidebar-section">
          <div className="sidebar-section-label">{section.section}</div>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}

      {user?.role === 'admin' && (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Admin</div>
          <NavLink
            to="/admin"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Shield size={16} />
            Admin Dashboard
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
