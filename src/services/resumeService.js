const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (token) => {
    const accessToken = token || localStorage.getItem('access_token');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

export const resumeService = {
    getResumeData: async (userId, token) => {
        const response = await fetch(`${API_BASE_URL}/cv_parsing/${userId}`, {
            headers: {
                ...getAuthHeaders(token)
            },
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Erreur lors de la récupération des données du CV.');
        }
        return response.json();
    },

    uploadResume: async (file, token) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/cv_parsing/cv`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(token)
            },
            body: formData,
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erreur lors du téléchargement du CV.');
        }
        return response.json();
    },


    deleteResume: async (token) => {
        const response = await fetch(`${API_BASE_URL}/cv_parsing/cv`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token)
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('La suppression du CV a échoué.');
        }
        return response.json();
    }
};