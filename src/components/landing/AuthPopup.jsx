import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../../style/AuthPopup.css';

const AuthPopup = ({ isOpen, onClose, isEnterprise = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-popup-overlay" onClick={handleOverlayClick}>
      <div className="auth-popup-container" style={{ padding: 0, overflow: 'hidden', maxWidth: 'fit-content' }}>
        {/* Clerk's SignIn component handles everything */}
        <SignIn
          signUpUrl="/sign-up" // Optional: custom logic if needed, but default works for many
          forceRedirectUrl={isEnterprise ? "/enterprise/dashboard" : "/home"} // Redirect based on user type
          appearance={
            isEnterprise
              ? {
                elements: {
                  socialButtonsBlockButton: "hidden",
                  dividerRow: "hidden",
                  footerAction: "hidden", // Hide "Don't have an account? Sign up"
                  footer: "hidden"       // Hide entire footer including Clerk branding/links if desired
                },
              }
              : undefined
          }
        />
        {/* Close button overlay or separate button if needed, but clicking outside closes it */}
        <button
          className="auth-popup-close"
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100, background: 'white', borderRadius: '50%', width: '30px', height: '30px', border: 'none', cursor: 'pointer' }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;