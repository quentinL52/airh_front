import React from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import paymentService from '../../services/paymentService';

function Pricing() {
    const { isSignedIn, getToken } = useAuth();
    const { openSignIn } = useClerk();

    const handleFreemiumClick = () => {
        if (isSignedIn) {
            window.location.href = '/home';
        } else {
            openSignIn();
        }
    };

    const handlePremiumClick = async () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }
        try {
            const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
            if (!priceId) {
                console.error("Price ID not found in environment variables");
                alert("Erreur de configuration: ID de prix manquant.");
                return;
            }
            const token = await getToken();
            const session = await paymentService.createCheckoutSession(priceId, token);
            if (session && session.url) {
                window.location.href = session.url;
            }
        } catch (error) {
            console.error("Failed to start checkout", error);
            alert("Une erreur est survenue lors de l'initialisation du paiement.");
        }
    };

    return (
        <section className="pricing-section">
            <h2 className="section-title">Nos Abonnements</h2>
            <div className="pricing-container">
                {/* Freemium Card */}
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3 className="pricing-plan">AIRH Freemium</h3>
                        <div className="pricing-price">Gratuit</div>
                    </div>
                    <ul className="pricing-features">
                        <li>
                            <strong>1</strong> extraction de CV par mois
                        </li>
                        <li>
                            <strong>5</strong> entretiens et feedbacks par mois
                        </li>
                    </ul>
                    <button className="cta-button pricing-btn" onClick={handleFreemiumClick}>Choisir Freemium</button>
                </div>

                {/* Premium Card */}
                <div className="pricing-card premium">
                    <div className="pricing-header">
                        <h3 className="pricing-plan">AIRH Premium</h3>
                        <div className="pricing-price">9.99€ <span className="period">/mois</span></div>
                    </div>
                    <ul className="pricing-features">
                        <li>
                            <strong>Jusqu'à 10</strong> extractions de CV par mois
                        </li>
                        <li>
                            <strong>40</strong> entretiens et feedbacks par mois
                        </li>
                    </ul>
                    <button className="cta-button pricing-btn primary" onClick={handlePremiumClick}>Choisir Premium</button>
                </div>
            </div>
        </section>
    );
}

export default Pricing;
