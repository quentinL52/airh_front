import React, { useState } from 'react';
import '../../../style/EnterpriseForm.css'; // Independent styles

const AddOfferTab = () => {
    const [formData, setFormData] = useState({
        entreprise: '',
        poste: '',
        mission: '',
        profil_recherche: '',
        competences: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Offer submitted:', formData);
            setIsLoading(false);
            setSuccessMessage('Offre ajoutée avec succès !');
            setFormData({
                entreprise: '',
                poste: '',
                mission: '',
                profil_recherche: '',
                competences: ''
            });
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1500);
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
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="enterprise-form-group">
                        <label>Entreprise *</label>
                        <input
                            type="text"
                            name="entreprise"
                            value={formData.entreprise}
                            onChange={handleChange}
                            className="enterprise-input"
                            placeholder="Ex: TechSolutions"
                            required
                        />
                    </div>

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
                            {isLoading ? 'Publication...' : "Publier l'offre"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOfferTab;
