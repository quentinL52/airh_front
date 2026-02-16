import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const userParam = urlParams.get('user');
      const tokenParam = urlParams.get('token');

      const error = urlParams.get('error');

      if (error) {
        navigate('/?error=auth_failed', { replace: true });
      } else if (userParam && tokenParam) {
        try {
          console.log("DEBUG: AuthCallback running");
          console.log("DEBUG: Received Token (first 10):", tokenParam ? tokenParam.substring(0, 10) : "null");

          const user = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('access_token', tokenParam);

          console.log("DEBUG: LocalStorage updated. AccessToken in storage:", localStorage.getItem('access_token')?.substring(0, 10));

          navigate('/home', { replace: true });
        } catch (parseError) {
          console.error('Erreur parsing user data:', parseError);
          navigate('/?error=invalid_data', { replace: true });
        }
      } else {
        navigate('/?error=missing_data', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return null;
};

export default AuthCallback;