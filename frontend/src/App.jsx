import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import PageBuilderPage from './pages/PageBuilderPage';
import PublicCreatorPage from './pages/PublicCreatorPage';
import AnalyticsPage from './pages/AnalyticsPage'

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

function App() {
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    // Check for token in localStorage on app load
    const savedToken = localStorage.getItem('skynz_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, [setToken]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/creator/:handle" element={<PublicCreatorPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigation />
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigation />
              <CreatorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/page-builder/:pageId?"
          element={
            <ProtectedRoute>
              <Navigation />
              <PageBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:pageId"
          element={
            <ProtectedRoute>
              <Navigation />
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
