import React, { useState } from 'react';
import '../../style/EnterpriseLanding.css';
import '../../style/AuthPopup.css'; // Reusing popup base styles

function DemoPopup({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        company_size: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/enterprise/lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    company_name: '',
                    contact_name: '',
                    email: '',
                    phone: '',
                    company_size: '',
                    message: ''
                });
                
                setTimeout(() => {
                    setSubmitStatus(null);
                    onClose();
                }, 3000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-popup-overlay" onClick={onClose} style={{ padding: '1rem' }}>
            <div className="auth-popup-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', borderRadius: '16px', margin: 'auto' }}>
                <div className="auth-popup-header" style={{ padding: '1rem 1.5rem 0', borderBottom: 'none' }}>
                    <div style={{ flex: 1 }}></div>
                    <button className="auth-popup-close" onClick={onClose} aria-label="Fermer" style={{ width: '32px', height: '32px', padding: '0' }}>
                        &times;
                    </button>
                </div>
                
                <div className="auth-popup-body" style={{ padding: '0 1.5rem 1.5rem' }}>
                    {submitStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                            <div style={{ 
                                width: '60px', height: '60px', borderRadius: '50%', 
                                background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontSize: '2rem', margin: '0 auto 1.5rem' 
                            }}>
                                ✓
                            </div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Demande envoyée !</h3>
                            <p style={{ color: 'var(--text-color)' }}>Merci. Nos équipes vous contacteront très prochainement.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                <h2 className="auth-popup-title" style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>Demander une démo</h2>
                                <p className="auth-popup-description" style={{ marginBottom: '0', fontSize: '0.9rem' }}>Nos équipes vous contacteront rapidement pour organiser une présentation.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="enterprise-lead-form">
                                <div className="form-grid" style={{ marginBottom: '1rem', textAlign: 'left', gap: '0.75rem' }}>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Nom de l'entreprise</label>
                                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Ex: AIRH Tech" style={{ padding: '0.5rem' }} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Nom du contact</label>
                                        <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} required placeholder="Votre nom" style={{ padding: '0.5rem' }} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email professionnel</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@entreprise.com" style={{ padding: '0.5rem' }} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Téléphone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01 23 45 67 89" style={{ padding: '0.5rem' }} />
                                    </div>
                                    <div className="form-group full-width" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Taille de l'entreprise</label>
                                        <select name="company_size" value={formData.company_size} onChange={handleChange} required style={{ padding: '0.5rem' }}>
                                            <option value="">Sélectionnez une taille</option>
                                            <option value="1-10">1-10 employés</option>
                                            <option value="11-50">11-50 employés</option>
                                            <option value="51-200">51-200 employés</option>
                                            <option value="201-500">201-500 employés</option>
                                            <option value="500+">500+ employés</option>
                                        </select>
                                    </div>
                                    <div className="form-group full-width" style={{ marginBottom: '0' }}>
                                        <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Comment pouvons-nous vous aider ?</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="2" placeholder="Parlez-nous de vos besoins en recrutement..." style={{ padding: '0.5rem' }}></textarea>
                                    </div>
                                </div>

                                <button type="submit" className="cta-button primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }} disabled={isSubmitting}>
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                                </button>

                                {submitStatus === 'error' && (
                                    <p className="error-msg" style={{ marginTop: '0.5rem', marginBottom: '0', textAlign: 'center', color: 'var(--color-danger)', fontSize: '0.85rem' }}>Une erreur est survenue. Veuillez réessayer.</p>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DemoPopup;
