const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const interviewService = {
    startInterview: async (jobId, customJob = null, token) => {
        if (!token) throw new Error("Authentication token missing");

        const payload = { messages: [] };
        if (jobId) payload.job_id = jobId;
        if (customJob) payload.custom_job = customJob;

        const response = await fetch(`${API_BASE_URL}/interview/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erreur lors du démarrage de l'entretien.");
        }

        return response.json();
    },

    sendMessage: async (jobId, messages, customJob = null, interviewId = null, token, cheatMetrics = null) => {
        if (!token) throw new Error("Authentication token missing");

        const payload = { messages: messages };
        if (jobId) payload.job_id = jobId;
        if (customJob) payload.custom_job = customJob;
        if (interviewId) payload.interview_id = interviewId;
        if (cheatMetrics) payload.cheat_metrics = cheatMetrics;

        const response = await fetch(`${API_BASE_URL}/interview/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erreur lors de l'envoi du message.");
        }

        return response.json();
    },

    getStatus: async (jobId, token) => {
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`${API_BASE_URL}/interview/status/${jobId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la vérification du statut.");
        }
        return response.json();
    },

    deleteHistory: async (jobId, token) => {
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`${API_BASE_URL}/interview/history/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erreur lors de la suppression de l'historique.");
        }
        return response.json();
    }
};
