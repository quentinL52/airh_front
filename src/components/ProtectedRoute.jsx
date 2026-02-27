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
    return null;
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

    // Pour enterprise uniquement : attendre la vérification company_users
    if (requiredRole === 'enterprise' && !syncDone) {
      return null;
    }
  }

  // Pass user data to children
  return React.cloneElement(children, { user });
};

export default ProtectedRoute;
