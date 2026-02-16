import React from 'react';
import '../../../style/EnterpriseJobs.css'; // Independent styles

const MyOffersTab = () => {
    // Mock data for enterprise offers
    const myOffers = [
        {
            id: 1,
            poste: 'Développeur Full Stack',
            entreprise: 'Ma Super Entreprise', // Implicitly the current user's company
            contrat: 'CDI',
            location: 'Paris, France',
            salaire: '50k - 65k',
            description_poste: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe.',
            competences: ['React', 'Node.js', 'PostgreSQL'],
            date_publication: '2023-10-27'
        },
        {
            id: 2,
            poste: 'Product Owner',
            entreprise: 'Ma Super Entreprise',
            contrat: 'Freelance',
            location: 'Remote',
            salaire: '400€ - 600€ / jour',
            description_poste: 'Product Owner pour gérer le backlog et les sprints de notre produit phare.',
            competences: ['Agile', 'Scrum', 'JIRA'],
            date_publication: '2023-11-05'
        }
    ];

    return (
        <div className="enterprise-jobs-container">
            <div className="enterprise-content-header">
                <p className="enterprise-section-subtitle">Gérez vos offres d'emploi publiées.</p>
            </div>

            <div className="enterprise-jobs-grid">
                {myOffers.map(offer => (
                    <div key={offer.id} className="enterprise-job-card">
                        <div className="enterprise-job-card-header">
                            <div className="enterprise-company-logo">
                                {offer.entreprise.charAt(0)}
                            </div>
                            <div className="enterprise-job-info">
                                <h3 className="enterprise-job-title">{offer.poste}</h3>
                                <p className="enterprise-job-company">{offer.entreprise}</p>
                            </div>
                        </div>
                        <div className="enterprise-job-tags">
                            <span className="enterprise-job-tag contract">{offer.contrat}</span>
                            <span className="enterprise-job-tag location">{offer.location}</span>
                        </div>
                        <div className="enterprise-job-description">
                            {offer.description_poste}
                        </div>
                        <div className="enterprise-job-actions">
                            <button className="enterprise-job-action-btn secondary" style={{ flex: 1 }}>
                                Modifier
                            </button>
                            <button className="enterprise-job-action-btn secondary" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOffersTab;
