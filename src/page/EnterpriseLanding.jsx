import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import AuthPopup from '../components/landing/AuthPopup';
import DemoPopup from '../components/landing/DemoPopup';
import Footer from '../components/landing/Footer';
import '../style/EnterpriseLanding.css';

const EnterpriseLanding = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [showDemoPopup, setShowDemoPopup] = useState(false);

    // Auto-redirect if already signed in
    React.useEffect(() => {
        if (isSignedIn && user) {
            const isEnterprise = user.publicMetadata?.profil === 'entreprise';
            const target = isEnterprise ? '/enterprise/dashboard' : '/home';

            const timer = setTimeout(() => {
                navigate(target);
            }, 1000); // 1 second delay
            return () => clearTimeout(timer);
        }
    }, [isSignedIn, user, navigate]);

    return (
        <div className="enterprise-landing">
            <Navbar isEnterprise={true} />

            {/* Section 1 - Hero */}
            <main className="enterprise-hero">
                <div className="enterprise-hero-content">
                    <h1 className="hero-title">Recrutez mieux, sans perdre un seul talent.</h1>
                    <p className="hero-description">
                        Automatisez le tri des candidatures grâce à un entretien IA structuré. Chaque candidat est évalué, scoré, et vous recevez un rapport de compatibilité, pour que les bons profils ne passent plus entre les mailles.
                    </p>
                    <div className="hero-buttons">
                        <button className="cta-button primary large" onClick={() => setShowAuthPopup(true)}>
                            Publiez votre première offre
                        </button>
                        <button className="cta-button outline large" onClick={() => setShowDemoPopup(true)}>
                            Demander une démo
                        </button>
                    </div>
                </div>
            </main>

            {/* Section 2 - Points de friction */}
            <section className="problem-section enterprise-problem">
                <h2 className="section-title">Le recrutement tech, un processus qui vous coûte du temps, et des talents.</h2>
                
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">Volume</div>
                        <p className="stat-text">En moyenne, une offre tech attire environ 250 candidatures. À 7,4 secondes par CV, trier objectivement cette masse relève de l'impossible. Le résultat : un filtre qui élimine vite, mais pas toujours bien.</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">Talents cachés</div>
                        <p className="stat-text">Parmi les candidatures écartées par les filtres classiques (parcours atypiques, reconvertis, profils non linéaires) se cachent des candidats potentiellement plus adaptés au poste. Sans évaluation systématique, ces profils ne sont jamais vus.</p>
                    </div>
                </div>

                <div className="vision-transition">
                    <p>Et si aucun candidat n'était exclu du processus ? C'est ce que nous avons construit.</p>
                    <p>C'est pourquoi AIRH ne se contente pas d'évaluer vos candidats : nous maintenons un vivier de profils tech évalués et scorés, prêts à être consultés pour vos offres.</p>
                </div>
            </section>

            {/* Section 3 - Comment ça marche */}
            <section className="how-it-works-section enterprise-how-it-works">
                <h2 className="section-title">Du dépôt d'offre au choix du candidat, en 3 étapes.</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">01</div>
                        <h3 className="step-title">Publiez votre offre</h3>
                        <p className="step-desc">Décrivez le poste, les compétences recherchées et le profil attendu. AIRH la diffuse aux candidats du vivier : des profils tech qui ont déjà été évalués par Roni, avec un score de compétences à jour.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">02</div>
                        <h3 className="step-title">Roni évalue chaque candidat</h3>
                        <p className="step-desc">Notre agent IA conduit un entretien structuré avec chaque candidat, évalue ses compétences techniques et comportementales, et génère un rapport détaillé avec un score de compatibilité.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">03</div>
                        <h3 className="step-title">Vous décidez, en connaissance de cause</h3>
                        <p className="step-desc">Consultez le dashboard de votre offre : score de chaque candidat en un coup d'œil, rapport complet accessible en un clic. Comparez, présélectionnez, recrutez.</p>
                        

                    </div>
                </div>
            </section>

            {/* Section 4bis - Vivier */}
            <section className="problem-section enterprise-problem" style={{ paddingTop: '0' }}>
                <h2 className="section-title">Un vivier tech, toujours à jour.</h2>
                <div className="vision-transition" style={{ marginBottom: '3rem', marginTop: '1rem' }}>
                    <p>Les candidats qui utilisent AIRH construisent un profil dynamique, passent des entretiens avec Roni, et sont évalués en continu. Ce vivier constitue votre première source de candidats qualifiés, avant même de publier une offre.</p>
                </div>
                
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">Profils pré-évalués</div>
                        <p className="stat-text">Les candidats sont déjà scorés avant même que vous ne publiiez votre offre.</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">Rotation 6 mois</div>
                        <p className="stat-text">Pour garantir la pertinence des profils dans un secteur où les compétences évoluent rapidement, les données du vivier sont actualisées sur un cycle de 6 mois. Un profil inactif depuis plus de 6 mois est archivé. Vous ne consultez que des candidats à jour.</p>
                    </div>
                </div>
            </section>

            <Footer isEnterprise={true} />

            <AuthPopup
                isOpen={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
                isEnterprise={true}
            />

            <DemoPopup 
                isOpen={showDemoPopup}
                onClose={() => setShowDemoPopup(false)}
            />
        </div>
    );
};

export default EnterpriseLanding;
