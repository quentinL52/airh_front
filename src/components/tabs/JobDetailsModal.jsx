import React, { useEffect } from 'react';
import '../../style/JobsTab.css';

const JobDetailsModal = ({ job, onClose, isActive, onStartInterview, onOptimizeCV, feedback, onViewFeedback }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (!job) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [job]);

    if (!job) return null;

    // Fields to display configuration
    const sections = [
        { key: 'description_nettoyee', title: 'Description du poste' },
        { key: 'mission', title: 'Missions' },
        { key: 'profil_recherche', title: 'Profil recherché' },
        { key: 'competences', title: 'Compétences requises' }
    ];

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal-content" onClick={e => e.stopPropagation()}>
                <button className="detail-close-btn" onClick={onClose}>&times;</button>

                <div className="detail-scroll-container">
                    <div className="detail-header">
                        <h2>{job.poste}</h2>
                        <p className="detail-subtitle">{job.entreprise} - {job.ville} ({job.contrat})</p>
                        <div className="detail-actions">
                            <button
                                className="job-btn optimize-cv-btn"
                                onClick={() => onOptimizeCV && onOptimizeCV(job)}
                            >
                                Optimiser mon CV
                            </button>

                            {feedback ? (
                                <button
                                    className="job-btn view-result"
                                    onClick={() => onViewFeedback && onViewFeedback(feedback.id)}
                                    style={{ backgroundColor: '#3b82f6', color: 'white' }}
                                >
                                    Mon feedback
                                </button>
                            ) : (
                                <button
                                    className={`job-btn start-interview ${isActive ? 'active' : ''}`}
                                    onClick={onStartInterview}
                                >
                                    {isActive ? "Reprendre" : "Entretien"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-body">
                        {sections.map(section => {
                            const content = job[section.key];
                            if (!content) return null;

                            return (
                                <div key={section.key} className="detail-section">
                                    <h3>{section.title}</h3>
                                    <p>{content}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="detail-footer">
                    {/* Action buttons are now in the header */}
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
