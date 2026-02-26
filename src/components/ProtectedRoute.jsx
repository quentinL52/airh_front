import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute: role-based access control.
 * - Reads profil from Clerk publicMetadata.profil
 * - For enterprise routes: waits for backend sync to verify company_users
 * - Redirects to appropriate landing if unauthorized.
 */
const ProtectedRoute = ({ children, requiredRole, syncDone, enterpriseRejected }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && user && !user.id)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ padding: '2rem' }}>Chargement...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    const isEnterprisePath = location.pathname.startsWith('/enterprise');
    return <Navigate to={isEnterprisePath ? '/enterprise' : '/'} replace />;
  }

  // Role checking logic
  if (requiredRole) {
    const isEnterprise = user?.publicMetadata?.profil === 'entreprise';
    const userRole = isEnterprise ? 'enterprise' : 'candidate';

    if (userRole !== requiredRole) {
      console.warn(`Access denied: required role "${requiredRole}", user has "${userRole}"`);
      const redirectPath = userRole === 'enterprise' ? '/enterprise/dashboard' : '/home';
      return <Navigate to={redirectPath} replace />;
    }

    if (enterpriseRejected) {
      return <Navigate to={userRole === 'enterprise' ? "/enterprise" : "/"} replace />;
    }

    // Attendre que le backend ait synchronisé l'utilisateur (créé dans Supabase)
    // avant de rendre la page — évite les erreurs 404 sur les premiers appels API
    if (!syncDone) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ padding: '2rem' }}>Connexion en cours...</div>
        </div>
      );
    }
  }

  // Pass user data to children
  return React.cloneElement(children, { user });
};

export default ProtectedRoute;
