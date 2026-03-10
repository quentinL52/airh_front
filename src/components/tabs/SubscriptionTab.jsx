import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import '../../style/SubscriptionTab.css'; // We'll create this CSS next

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubscriptionTab = () => {
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        setIsLoading(true);
        try {
            if (!userId) {
                alert("Session non valide ou expirée. Veuillez vous reconnecter.");
                setIsLoading(false);
                return;
            }

            // Lien de paiement Stripe direct avec l'ID Clerk en référence
            const stripeUrl = `https://buy.stripe.com/9B65kw2WS0fCdpq0br1Nu00?client_reference_id=${userId}`;
            window.location.href = stripeUrl;

        } catch (error) {
            console.error("Erreur de redirection vers le paiement :", error);
            alert("Une erreur inattendue s'est produite.");
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
                            <li><i className="fas fa-check"></i> 4 analyse de CV par mois</li>
                            <li><i className="fas fa-check"></i> 10 entretiens & feedbacks par mois</li>
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
                            <li><i className="fas fa-check"></i> <strong>40</strong> analyses de CV par mois</li>
                            <li><i className="fas fa-check"></i> <strong>100</strong> entretiens & feedbacks par mois</li>
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
