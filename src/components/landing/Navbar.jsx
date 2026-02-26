import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPopup from './AuthPopup';
import logoImg from '../../assets/AIrh_logo.png';

function Navbar({ isEnterprise: isEnterprisePage = false }) {
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const { isSignedIn, signOut } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    // Mémoriser si le popup était ouvert avant la connexion (cas email/magic link)
    const popupWasOpen = useRef(false);

    // Si connecté : on vérifie la metadata profil. Sinon : on utilise la prop de la page.
    const isEnterpriseUser = user?.publicMetadata?.profil === 'entreprise';
    const isEnterprise = isSignedIn ? isEnterpriseUser : isEnterprisePage;
    const userRole = isEnterpriseUser ? 'enterprise' : 'candidate';

    // Suivre l'état du popup dans une ref pour le détecter dans l'effet de connexion
    useEffect(() => {
        popupWasOpen.current = showAuthPopup;
    }, [showAuthPopup]);

    // Rediriger automatiquement dès que Clerk confirme la connexion
    // Couvre le cas email/magic link où la page ne reload pas (pas d'OAuth redirect)
    useEffect(() => {
        if (isSignedIn && user && popupWasOpen.current) {
            popupWasOpen.current = false;
            setShowAuthPopup(false);
            const target = user.publicMetadata?.profil === 'entreprise'
                ? '/enterprise/dashboard'
                : '/home';
            navigate(target, { replace: true });
        }
    }, [isSignedIn, user, navigate]);

    const handleAuthButtonClick = () => {
        setShowAuthPopup(true);
    };

    const handleClosePopup = () => {
        setShowAuthPopup(false);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const dashboardPath = userRole === 'enterprise' ? '/enterprise/dashboard' : '/home';

    return (
        <>
            <nav className="navbar">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src={logoImg} alt="AIrh Logo" className="logo-icon" style={{ height: '40px' }} />
                        </Link>
                    </div>

                    <div className="navbar-auth">
                        {isSignedIn ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span>{user?.firstName || user?.username || 'Utilisateur'}</span>
                                <Link to={dashboardPath} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                    Dashboard
                                </Link>
                                {userRole === 'candidate' && (
                                    <Link to="/enterprise" className="enterprise-btn">
                                        Espace Entreprise
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="cta-button" style={{ backgroundColor: '#dc2626' }}>
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {!isEnterprise && (
                                    <Link to="/enterprise" className="enterprise-btn">
                                        Vous recrutez ?
                                    </Link>
                                )}
                                <button onClick={handleAuthButtonClick} className="cta-button">
                                    {isEnterprise ? "Connexion Entreprise" : "Se connecter / s'inscrire"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <AuthPopup
                isOpen={showAuthPopup}
                onClose={handleClosePopup}
                isEnterprise={isEnterprisePage}
            />
        </>
    );
}

export default Navbar;
