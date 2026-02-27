import React from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';

function Pricing() {
    const { isSignedIn } = useAuth();
    const { openSignIn } = useClerk();

    const handleFreemiumClick = () => {
        if (isSignedIn) {
            window.location.href = '/home';
        } else {
            openSignIn();
        }
    };

    const handlePremiumClick = () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }
        // Redirige vers le tab abonnement (PricingTable Clerk gère le checkout)
        window.location.href = '/home?section=abonnement';
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
