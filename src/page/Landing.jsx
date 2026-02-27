import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import '../style/Landing.css';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';


function Landing() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setIsRedirecting(true);
      const isEnterprise = user.publicMetadata?.profil === 'entreprise';
      const target = isEnterprise ? '/enterprise/dashboard' : '/home';
      navigate(target, { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Écran de chargement pendant la redirection post-connexion
  if (isRedirecting || (isLoaded && isSignedIn)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        gap: '1rem'
      }}>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

export default Landing;