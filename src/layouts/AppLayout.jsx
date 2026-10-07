import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile drawer when navigating to a new route
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Support closing mobile drawer via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('mobile-nav-locked');
    } else {
      document.body.classList.remove('mobile-nav-locked');
    }
    return () => {
      document.body.classList.remove('mobile-nav-locked');
    };
  }, [mobileNavOpen]);

  return (
    <div className="app-root">
      <Navbar
        isMobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen(prev => !prev)}
      />
      <div className="app-layout">
        <Sidebar
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
