import React, { useEffect, useState } from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import '../style/Landing.css';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemVision from '../components/landing/ProblemVision';
import HowItWorks from '../components/landing/HowItWorks';
import ProductProof from '../components/landing/ProductProof';
import CandidateBenefits from '../components/landing/CandidateBenefits';
import FinalCta from '../components/landing/FinalCta';
import Footer from '../components/landing/Footer';

function Landing() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Clerk utilise #/sso-callback pour les callbacks OAuth en mode popup.
  // On traite le callback de manière programmatique pour éviter tout délai.
  useEffect(() => {
    if (window.location.hash.startsWith('#/sso-callback')) {
      clerk.handleRedirectCallback({
        afterSignInUrl: '/home',
        afterSignUpUrl: '/home',
        redirectUrl: '/home',
      }).catch((err) => {
        console.error('SSO callback error:', err);
        // Nettoyer le hash en cas d'erreur pour éviter une boucle
        window.location.hash = '';
      });
    }
  }, [clerk]);

  // Rediriger vers le dashboard dès que l'utilisateur est connecté
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setIsRedirecting(true);
      const isEnterprise = user.publicMetadata?.profil === 'entreprise';
      const target = isEnterprise ? '/enterprise/dashboard' : '/home';
      navigate(target, { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Éviter le flash de la landing pendant le SSO callback ou la redirection
  if (isRedirecting || (isLoaded && isSignedIn) || window.location.hash.startsWith('#/sso-callback')) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <Hero />
        <ProblemVision />
        <HowItWorks />
        <ProductProof />
        <CandidateBenefits />
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}

export default Landing;