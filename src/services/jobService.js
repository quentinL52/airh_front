const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://airh-backend.onrender.com/api/v1';

export const jobsService = {
    getJobs: async () => {
        const response = await fetch(`${API_BASE_URL}/jobs/`, { 
            credentials: 'include' 
        });
        
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des offres d'emploi.");
        }
        
        return response.json();
    },
};