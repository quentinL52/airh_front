const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const createCheckoutSession = async (priceId, token) => {
    const response = await fetch(`${API_BASE_URL}/payment/create-checkout-session?price_id=${encodeURIComponent(priceId)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la creation de la session de paiement.");
    }

    return response.json();
};

export default {
    createCheckoutSession
};
