import React, { useState } from 'react';
import '../../../style/EnterpriseForm.css'; // Independent styles

const CompanyProfileTab = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user?.fullName || 'Entreprise',
        description: 'Une entreprise innovante.',
        website: 'https://example.com',
        industry: 'Technologie',
        location: 'Paris, France'
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log('Profile saved:', formData);
        setIsEditing(false);
    };

    return (
        <div className="enterprise-form-container">
            <div className="enterprise-content-header">
                <h2 className="enterprise-section-title">Profil Entreprise</h2>
                <p className="enterprise-section-subtitle">Gérez les informations de votre entreprise.</p>
            </div>

            <div className="enterprise-form-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#6b7280' }}>
                            <i className='fas fa-building'></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>{formData.name}</h3>
                            <p style={{ margin: 0, color: '#6b7280' }}>{formData.industry} • {formData.location}</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="enterprise-btn secondary"
                        >
                            <i className="fas fa-pen" style={{ marginRight: '0.5rem' }}></i>
                            Modifier
                        </button>
                    )}
                </div>

                <div className="enterprise-form-group">
                    <label>Nom de l'entreprise</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="enterprise-input"
                        disabled={!isEditing}
                    />
                </div>

                <div className="enterprise-form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="enterprise-textarea"
                        rows="4"
                        disabled={!isEditing}
                    />
                </div>

                <div className="enterprise-form-group">
                    <label>Site Web</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="enterprise-input"
                        disabled={!isEditing}
                    />
                </div>

                <div className="enterprise-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="enterprise-form-group">
                        <label>Secteur d'activité</label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="enterprise-input"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="enterprise-form-group">
                        <label>Localisation</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="enterprise-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="enterprise-btn secondary"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className="enterprise-btn primary"
                        >
                            Enregistrer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfileTab;
