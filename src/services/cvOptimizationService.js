const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (token) => {
    const accessToken = token || localStorage.getItem('access_token');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

export const cvOptimizationService = {
    /**
     * Analyse la correspondance entre le CV de l'utilisateur et une offre d'emploi.
     * @param {string} jobId - L'ID de l'offre d'emploi
     * @param {string} token - Token d'authentification
     * @returns {Promise<Object>} - Résultat de l'analyse
     */
    analyzeMatch: async (jobId, token) => {
        const response = await fetch(`${API_BASE_URL}/cv_optimization/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token)
            },
            body: JSON.stringify({ job_id: jobId }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Erreur lors de l\'analyse du CV.');
        }

        return response.json();
    }
};
