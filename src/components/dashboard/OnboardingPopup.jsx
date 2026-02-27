import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const OnboardingPopup = ({ onClose }) => {
    const { user } = useUser();
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValidate = async () => {
        if (!agreed || !user) return;
        setIsSubmitting(true);
        try {
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    onboarded: true,
                },
            });
            onClose();
        } catch (error) {
            console.error("Error updating user metadata:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2.5rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <h2 style={{ margin: 0, color: '#111827', fontSize: '1.75rem', fontWeight: 700 }}>
                    Bienvenue sur Airh
                </h2>
                <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' }}>
                    Votre nom sera utilisé uniquement à des fins de personnalisation lors de l'entretien,
                    et sera masqué lors de l'analyse afin d'éviter tout biais.
                </p>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.2rem', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#374151', fontSize: '1rem', fontWeight: 500 }}>
                        J'ai lu et j'en ai pris connaissance
                    </span>
                </label>

                <button
                    onClick={handleValidate}
                    disabled={!agreed || isSubmitting}
                    style={{
                        padding: '0.875rem 2rem',
                        backgroundColor: agreed ? '#2563eb' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: agreed && !isSubmitting ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        alignSelf: 'stretch',
                        marginTop: '1rem',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Validation...' : 'Valider'}
                </button>
            </div>
        </div>
    );
};

export default OnboardingPopup;
