// VULN-04 : Ce composant est un vestige d'un ancien flux OAuth Google.
// Il ne doit plus stocker de tokens en localStorage ni les lire depuis l'URL.
// Si ce flux n'est plus utilisé, ce composant peut être supprimé.
// En attendant, il redirige simplement vers la page d'accueil.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Flux OAuth legacy désactivé — redirection vers l'accueil
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default AuthCallback;
