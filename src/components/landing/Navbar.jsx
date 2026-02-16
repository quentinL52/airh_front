import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPopup from './AuthPopup';
import logoImg from '../../assets/AIrh_logo.png';

function Navbar({ isEnterprise = false }) {
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const { isSignedIn, signOut } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

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
                                <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>Dashboard</Link>
                                {!isEnterprise && (
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
                isEnterprise={isEnterprise}
            />
        </>
    );
}

export default Navbar;
