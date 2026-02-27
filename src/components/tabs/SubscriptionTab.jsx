import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import '../../style/SubscriptionTab.css'; // We'll create this CSS next

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubscriptionTab = () => {
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                alert("Session expirée. Veuillez vous reconnecter.");
                return;
            }

            const premiumPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'cplan_3AGNgh83HMAhwCjhjx31r9LPwOr';

            const response = await fetch(`${API_BASE_URL}/payment/create-checkout-session?price_id=${premiumPriceId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Checkout session failed:", response.status, errorData);
                alert(`Erreur: ${errorData.detail || "Impossible d'initier le paiement"}`);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Erreur de connexion au serveur de paiement.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="subscription-tab">
            <div className="subscription-header">
                <h2>Abonnements</h2>
                <p>Choisissez la formule qui correspond à vos besoins</p>
            </div>

            <div className="pricing-cards">
                {/* Freemium Plan */}
                <div className="pricing-card free-plan">
                    <div className="plan-header">
                        <h3>AIRH Freemium</h3>
                        <div className="plan-price">
                            <span className="amount">Gratuit</span>
                        </div>
                    </div>
                    <div className="plan-features">
                        <ul>
                            <li><i className="fas fa-check"></i> 1 analyse de CV par mois</li>
                            <li><i className="fas fa-check"></i> 5 entretiens & feedbacks par mois</li>
                        </ul>
                    </div>
                    <div className="plan-action">
                        {/* Always visible as current if free, or fallback */}
                        <button className="btn-current-plan" disabled>Forfait Actuel</button>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="pricing-card premium-plan highlight">
                    <div className="plan-header">
                        <h3>AIRH Premium</h3>
                        <div className="plan-price">
                            <span className="amount">9.99€</span>
                            <span className="period">/ mois</span>
                        </div>
                    </div>
                    <div className="plan-features">
                        <ul>
                            <li><i className="fas fa-check"></i> <strong>10</strong> analyses de CV par mois</li>
                            <li><i className="fas fa-check"></i> <strong>20</strong> entretiens & feedbacks par mois</li>
                            <li><i className="fas fa-check"></i> accés exclusif aux nouvelles fonctionnalités</li>
                        </ul>
                    </div>
                    <div className="plan-action">
                        <button
                            className="btn-subscribe"
                            onClick={handleSubscribe}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><i className="fas fa-circle-notch fa-spin"></i> Redirection...</>
                            ) : (
                                "Passer Premium"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionTab;
