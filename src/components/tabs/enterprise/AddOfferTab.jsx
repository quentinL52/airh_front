import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import '../../../style/EnterpriseForm.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddOfferTab = ({ onOfferCreated }) => {
    const { getToken } = useAuth();
    const [formData, setFormData] = useState({
        poste: '',
        mission: '',
        profil_recherche: '',
        competences: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/enterprise/offers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccessMessage('Offre ajoutée avec succès !');
                setFormData({
                    poste: '',
                    mission: '',
                    profil_recherche: '',
                    competences: ''
                });
                // Notify parent to refresh offers list
                if (onOfferCreated) onOfferCreated();
                setTimeout(() => setSuccessMessage(''), 4000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || 'Erreur lors de la création de l\'offre.');
            }
        } catch (error) {
            console.error('Error creating offer:', error);
            setErrorMessage('Erreur réseau. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="enterprise-form-container">
            <div className="enterprise-content-header">
                <h2 className="enterprise-section-title">Ajouter une nouvelle offre</h2>
                <p className="enterprise-section-subtitle">Définissez les critères du poste pour publier une offre.</p>
            </div>

            <div className="enterprise-form-body">
                {successMessage && (
                    <div className="enterprise-success-message">
                        <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="enterprise-error-message">
                        <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="enterprise-form-group">
                        <label>Intitulé du poste *</label>
                        <input
                            type="text"
                            name="poste"
                            value={formData.poste}
                            onChange={handleChange}
                            className="enterprise-input"
                            placeholder="Ex: Chef de Projet Digital"
                            required
                        />
                    </div>

                    <div className="enterprise-form-group">
                        <label>Missions principales *</label>
                        <textarea
                            name="mission"
                            value={formData.mission}
                            onChange={handleChange}
                            className="enterprise-textarea"
                            placeholder="Décrivez les responsabilités et tâches quotidiennes..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="enterprise-form-group">
                        <label>Profil recherché *</label>
                        <textarea
                            name="profil_recherche"
                            value={formData.profil_recherche}
                            onChange={handleChange}
                            className="enterprise-textarea"
                            placeholder="Années d'expérience, diplômes, soft skills..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="enterprise-form-group">
                        <label>Compétences clés *</label>
                        <textarea
                            name="competences"
                            value={formData.competences}
                            onChange={handleChange}
                            className="enterprise-textarea"
                            placeholder="Outils, langages, méthodologies..."
                            rows="3"
                            required
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            className="enterprise-btn primary"
                            disabled={isLoading}
                            style={{ minWidth: '150px' }}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                    Publication...
                                </>
                            ) : (
                                "Publier l'offre"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOfferTab;
