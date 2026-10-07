import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/dashboard/Dashboard';
import CVListPage from './pages/cvs/CVListPage';
import CVUploadPage from './pages/cvs/CVUploadPage';
import CVDetailPage from './pages/cvs/CVDetailPage';
import CVEditorPage from './pages/cvs/CVEditorPage';

import JobInputPage from './pages/jobs/JobInputPage';
import JobListPage from './pages/jobs/JobListPage';

import MatchAnalysisPage from './pages/match/MatchAnalysisPage';
import CVOptimizerPage from './pages/optimizer/CVOptimizerPage';
import SkillsGapPage from './pages/skills/SkillsGapPage';
import CoverLetterPage from './pages/coverLetter/CoverLetterPage';
import InterviewPrepPage from './pages/interview/InterviewPrepPage';
import ApplicationTrackerPage from './pages/applications/ApplicationTrackerPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated Pages in AppLayout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* CV Routes */}
        <Route path="/cvs" element={<CVListPage />} />
        <Route path="/cvs/upload" element={<CVUploadPage />} />
        <Route path="/cvs/:id" element={<CVDetailPage />} />
        <Route path="/cvs/:id/edit" element={<CVEditorPage />} />

        {/* Job Routes */}
        <Route path="/jobs" element={<JobInputPage />} />
        <Route path="/jobs/saved" element={<JobListPage />} />

        {/* Match & Optimization Routes */}
        <Route path="/match" element={<MatchAnalysisPage />} />
        <Route path="/analysis/:id" element={<MatchAnalysisPage />} />
        <Route path="/optimizer" element={<CVOptimizerPage />} />

        {/* AI Career Assistant Features */}
        <Route path="/skills-gap" element={<SkillsGapPage />} />
        <Route path="/cover-letters" element={<CoverLetterPage />} />
        <Route path="/interviews" element={<InterviewPrepPage />} />

        {/* Application Tracker */}
        <Route path="/applications" element={<ApplicationTrackerPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
