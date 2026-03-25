import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeedbackForm from './pages/FeedbackForm';
import MyFeedback from './pages/MyFeedback';
import Navbar from './components/Navbar'; // We will create this
import { AuthProvider, useAuth } from './context/AuthContext'; // We will create this
import { GoogleOAuthProvider } from '@react-oauth/google';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      <div className="container-lg px-2 px-md-4 py-3" style={{ maxWidth: '1200px' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'placeholder-client-id'}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback/:category/:subCategory"
              element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback/edit/:id"
              element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-feedback"
              element={
                <ProtectedRoute>
                  <MyFeedback />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
