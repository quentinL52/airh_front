const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const jobsService = {
    getJobs: async (page = 1, size = 20) => {
        const response = await fetch(`${API_BASE_URL}/jobs/?page=${page}&size=${size}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des offres d'emploi.");
        }

        return response.json();
    },

    getJob: async (id) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'offre d'emploi.");
        }

        return response.json();
    },

    getActiveInterviews: async (token) => {
        if (!token) return [];
        try {
            const response = await fetch(`${API_BASE_URL}/interview/active-list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.active_job_ids || [];
        } catch (e) {
            console.error("Error fetching active interviews:", e);
            return [];
        }
    }
};