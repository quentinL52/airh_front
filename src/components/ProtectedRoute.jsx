import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Loading spinner or placeholder */}
        <div style={{ padding: '2rem' }}>Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Redirect to home if not signed in, or could use <RedirectToSignIn />
    return <Navigate to="/" replace />;
  }

  // Role checking logic
  if (requiredRole) {
    const userRole = user?.publicMetadata?.role || 'candidate';
    if (userRole !== requiredRole) {
      console.warn(`Access denied: required role ${requiredRole}, user has ${userRole}`);
      // Redirect based on user's actual role or to a safe default
      const redirectPath = userRole === 'enterprise' ? '/enterprise/dashboard' : '/home';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Pass user data to children
  return React.cloneElement(children, { user });
};

export default ProtectedRoute;