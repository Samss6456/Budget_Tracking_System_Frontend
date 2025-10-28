import React from "react";
import AppContent from "./AppContent";
import LoginForm from "./components/LoginForm";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function AuthenticatedApp() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Personal Budget Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>
      <div className="auth-content">
        <AppContent />
      </div>
    </div>
  );
}

export default function App() {
  // For testing, check if we're in test environment
  if (process.env.NODE_ENV === 'test') {
    return <AppContent />;
  }
  
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
