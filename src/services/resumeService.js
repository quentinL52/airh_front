const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const resumeService = {
    getResumeData: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/cv_parsing/${userId}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Erreur lors de la récupération des données du CV.');
        }
        return response.json();
    },

    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/cv_parsing/cv`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erreur lors du téléchargement du CV.');
        }
        return response.json();
    },
    

    deleteResume: async () => {
        const response = await fetch(`${API_BASE_URL}/cv_parsing/cv`, { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('La suppression du CV a échoué.');
        }
        return response.json();
    }
};