const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const feedbackService = {
    getMyFeedbacks: async (token) => {
        const response = await fetch(`${API_BASE_URL}/feedback/my-feedbacks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des feedbacks.");
        }

        return response.json();
    },

    getFeedbackById: async (id, token) => {
        const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération du feedback.");
        }

        return response.json();
    }
};
