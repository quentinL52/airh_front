import React, { useState } from 'react';
import { authService } from '../../services/authService';
import AuthPopup from './AuthPopup';
import airh_logo from '../../assets/AIRH_logo.png';

function Navbar() {
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    
    const handleAuthButtonClick = () => {
        setShowAuthPopup(true);
    };
    
    const handleClosePopup = () => {
        setShowAuthPopup(false);
    };
    
    const handleGoogleAuth = () => {
        setShowAuthPopup(false);
        authService.authenticateWithGoogle();
    };

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <img src={airh_logo} alt="AIrh Logo" className="logo-icon" />
                    </div>
                    <button onClick={handleAuthButtonClick} className="cta-button">
                        Se connecter / s'inscrire
                    </button>
                </div>
            </nav>
            
            <AuthPopup 
                isOpen={showAuthPopup}
                onClose={handleClosePopup}
                onGoogleLogin={handleGoogleAuth}
                onGoogleSignup={handleGoogleAuth}
            />
        </>
    );
}

export default Navbar;