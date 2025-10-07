const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const authService = {
  initialize: async () => {
    console.log('Auth service initialisé');
  },

  authenticateWithGoogle: () => {
    const authUrl = `${API_BASE_URL}/auth/oauth/google`;
    console.log('🔄 Redirection vers:', authUrl);
    window.location.href = authUrl;
  },

  // Vérifie si un objet 'user' existe dans le localStorage
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  getCurrentUser: async () => {
    try {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        return JSON.parse(localUser);
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  // Supprime l'utilisateur du localStorage et redirige
  logout: () => {
    localStorage.removeItem('user');
    // Idéalement, vous devriez aussi appeler un endpoint /logout sur le backend
    // pour invalider le cookie côté serveur.
    window.location.href = '/';
  },
};