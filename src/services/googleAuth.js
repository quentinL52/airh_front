const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const handleCredentialResponse = (response) => {
  if (response.credential) {
    try {
      const user = JSON.parse(decodeURIComponent(response.credential));
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/home';
    } catch (error) {
      console.error('Erreur parsing user data:', error);
      window.location.href = '/?error=invalid_data';
    }
  } else {
    window.location.href = '/?error=auth_failed';
  }
};

export const initializeGoogleAuth = () => {
  return new Promise((resolve) => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      resolve(true);
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve(true);
      };
      document.head.appendChild(script);
    }
  });
};

export const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Token invalide');
  }
};