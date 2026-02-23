import React, { useEffect } from 'react';
import '../../style/JobsTab.css';

const JobDetailsModal = ({ job, onClose, isActive, onStartInterview, feedback, onViewFeedback }) => {
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
                            // Check if we have content OR if it's a field that might be missing in lite version
                            // If it's missing and we don't have it, show skeleton
                            // Note: 'mission', 'profil_recherche', 'description_nettoyee' are missing in lite
                            // 'competences' IS in lite, so it should show immediately if present

                            const isHeavyField = ['description_nettoyee', 'mission', 'profil_recherche'].includes(section.key);
                            const isLoadingField = isHeavyField && !content;

                            if (isLoadingField) {
                                return (
                                    <div key={section.key} className="detail-section">
                                        <h3>{section.title}</h3>
                                        <div className="description-skeleton">
                                            <div className="skeleton-line full"></div>
                                            <div className="skeleton-line full"></div>
                                            <div className="skeleton-line three-quarter"></div>
                                        </div>
                                    </div>
                                );
                            }

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
