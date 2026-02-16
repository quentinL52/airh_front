import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Landing from './page/Landing.jsx';
import EnterpriseLanding from './page/EnterpriseLanding.jsx';
import HomePage from './page/HomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthCallback from './page/AuthCallback.jsx';
import AccountPage from './page/AccountPage.jsx';
import EnterpriseDashboardPage from './page/EnterpriseDashboardPage.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useBackendSync } from './hooks/useBackendSync';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function AppContent() {
  useBackendSync();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/enterprise" element={<EnterpriseLanding />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enterprise/dashboard"
          element={
            <ProtectedRoute>
              <EnterpriseDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AppContent />
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);