import React, { useState } from 'react';
import '../../style/CustomJobModal.css';

const CustomJobModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        entreprise: '',
        poste: '',
        mission: '',
        profil_recherche: '',
        competences: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.entreprise || !formData.poste || !formData.mission || !formData.profil_recherche || !formData.competences) return;
        onSubmit(formData);
    };

    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal" onClick={e => e.stopPropagation()}>
                <div className="custom-modal-header">
                    <h2>Offre Personnalisée</h2>
                    <button className="close-btn-icon" onClick={onClose}>&times;</button>
                </div>

                <div className="custom-modal-body">
                    <p className="form-group" style={{ marginBottom: '24px', color: '#64748b', lineHeight: '1.5' }}>
                        Configurez votre propre simulation d'entretien en définissant les critères du poste.
                        L'IA s'adaptera à ces informations pour mener l'entretien.
                    </p>

                    <div className="form-group">
                        <label>Entreprise *</label>
                        <input
                            type="text"
                            name="entreprise"
                            value={formData.entreprise}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="Ex: TechSolutions"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Intitulé du poste *</label>
                        <input
                            type="text"
                            name="poste"
                            value={formData.poste}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="Ex: Chef de Projet Digital"
                        />
                    </div>

                    <div className="form-group">
                        <label>Missions principales *</label>
                        <textarea
                            name="mission"
                            value={formData.mission}
                            onChange={handleChange}
                            className="custom-textarea"
                            placeholder="Décrivez les responsabilités et tâches quotidiennes..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Profil recherché *</label>
                        <textarea
                            name="profil_recherche"
                            value={formData.profil_recherche}
                            onChange={handleChange}
                            className="custom-textarea"
                            placeholder="Années d'expérience, diplômes, soft skills..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Compétences clés *</label>
                        <textarea
                            name="competences"
                            value={formData.competences}
                            onChange={handleChange}
                            className="custom-textarea"
                            placeholder="Outils, langages, méthodologies..."
                            rows="2"
                        />
                        <span className="input-hint">* Tous les champs sont obligatoires pour garantir la qualité de la simulation.</span>
                    </div>
                </div>

                <div className="custom-modal-footer">
                    <button className="modal-btn secondary" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="modal-btn primary"
                        onClick={handleSubmit}
                        disabled={!formData.entreprise || !formData.poste || !formData.mission || !formData.profil_recherche || !formData.competences || isLoading}
                    >
                        {isLoading ? 'Démarrage...' : "Simuler l'entretien"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomJobModal;
