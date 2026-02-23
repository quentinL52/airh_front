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
import OfferDetailPage from './page/OfferDetailPage.jsx';
import EnterpriseInterviewDetailPage from './page/EnterpriseInterviewDetailPage.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useBackendSync } from './hooks/useBackendSync';

// --- Single Clerk instance (same for candidates and enterprise) ---
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY — authentication disabled");
}

/**
 * Main application with role-based routing.
 * Candidates and enterprise users share the same Clerk instance.
 * Role is determined by Clerk publicMetadata.role.
 */
function AppRoutes() {
  const { syncDone, enterpriseRejected } = useBackendSync();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/enterprise" element={<EnterpriseLanding />} />

      {/* Candidate routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute requiredRole="candidate">
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute requiredRole="candidate">
            <AccountPage />
          </ProtectedRoute>
        }
      />

      {/* Enterprise routes — need backend verification via syncDone */}
      <Route
        path="/enterprise/dashboard"
        element={
          <ProtectedRoute requiredRole="enterprise" syncDone={syncDone} enterpriseRejected={enterpriseRejected}>
            <EnterpriseDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/enterprise/offers/:offerId"
        element={
          <ProtectedRoute requiredRole="enterprise" syncDone={syncDone} enterpriseRejected={enterpriseRejected}>
            <OfferDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/enterprise/interviews/:feedbackId"
        element={
          <ProtectedRoute requiredRole="enterprise" syncDone={syncDone} enterpriseRejected={enterpriseRejected}>
            <EnterpriseInterviewDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  if (!CLERK_KEY) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Authentication not configured</div>;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      afterSignOutUrl="/"
    >
      <Router>
        <AppRoutes />
      </Router>
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);