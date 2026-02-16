import React from 'react';
import '../../style/CVOptimizationModal.css';

const CVOptimizationModal = ({ result, job, onClose, isLoading }) => {

    if (isLoading) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="cv-optimization-modal loading-state" onClick={e => e.stopPropagation()}>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h3>Analyse en cours...</h3>
                        <p>Notre IA compare votre CV avec l'offre d'emploi.</p>
                        <p className="loading-tip">Cela peut prendre jusqu'à 30 secondes.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) return null;

    const { match_score, domain_analysis, skills_analysis, recommendations } = result;

    const getScoreClass = (score) => {
        if (score >= 75) return 'score-excellent';
        if (score >= 50) return 'score-good';
        if (score >= 25) return 'score-average';
        return 'score-low';
    };

    const getScoreLabel = (score) => {
        if (score >= 75) return 'Excellent match !';
        if (score >= 50) return 'Bon potentiel';
        if (score >= 25) return 'À améliorer';
        return 'Écart important';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="cv-optimization-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn-icon" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>Analyse de compatibilité</h2>
                    <p className="job-target">
                        <strong>{job?.poste}</strong> chez {job?.entreprise}
                    </p>
                </div>

                {/* Score global */}
                <div className="score-section">
                    <div className={`score-gauge ${getScoreClass(match_score)}`}>
                        <div
                            className="score-fill"
                            style={{ width: `${match_score}%` }}
                        ></div>
                        <span className="score-value">{match_score}%</span>
                    </div>
                    <p className="score-label">{getScoreLabel(match_score)}</p>
                </div>

                <div className="modal-body">
                    {/* Analyse des domaines */}
                    {domain_analysis && (
                        <div className="section domain-section">
                            <h3>Analyse des domaines</h3>
                            <div className="domain-comparison">
                                <div className="domain-column">
                                    <h4>Vos domaines</h4>
                                    <div className="domain-tags">
                                        {domain_analysis.candidate_domains?.map((domain, i) => (
                                            <span key={i} className="tag candidate-tag">{domain}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="domain-column">
                                    <h4>Domaines requis</h4>
                                    <div className="domain-tags">
                                        {domain_analysis.job_domains?.map((domain, i) => (
                                            <span key={i} className="tag job-tag">{domain}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analyse des compétences */}
                    {skills_analysis && (
                        <div className="section skills-section">
                            <h3>Compétences</h3>

                            {skills_analysis.matched?.length > 0 && (
                                <div className="skill-category matched">
                                    <h4>Compétences maîtrisées</h4>
                                    <div className="skill-list">
                                        {skills_analysis.matched.map((skill, i) => (
                                            <span key={i} className="skill-tag matched">
                                                {skill.skill}
                                                {skill.candidate_level && <small>({skill.candidate_level})</small>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills_analysis.partial?.length > 0 && (
                                <div className="skill-category partial">
                                    <h4>À développer</h4>
                                    <div className="skill-list">
                                        {skills_analysis.partial.map((skill, i) => (
                                            <span key={i} className="skill-tag partial" title={skill.gap_description}>
                                                {skill.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {skills_analysis.missing?.length > 0 && (
                                <div className="skill-category missing">
                                    <h4>Compétences manquantes</h4>
                                    <div className="skill-list">
                                        {skills_analysis.missing.map((skill, i) => (
                                            <span key={i} className="skill-tag missing">
                                                {skill.skill}
                                                {skill.importance === 'high' && <span className="priority-badge">Prioritaire</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recommandations */}
                    {recommendations && (
                        <div className="section recommendations-section">
                            <h3>Recommandations</h3>

                            {recommendations.projects_to_highlight?.length > 0 && (
                                <div className="recommendation-group">
                                    <h4>Projets à mettre en avant</h4>
                                    {recommendations.projects_to_highlight.map((proj, i) => (
                                        <div key={i} className="recommendation-card">
                                            <strong>{proj.project_name}</strong>
                                            <p>{proj.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recommendations.suggested_trainings?.length > 0 && (
                                <div className="recommendation-group">
                                    <h4>Formations suggérées</h4>
                                    {recommendations.suggested_trainings.map((training, i) => (
                                        <div key={i} className="recommendation-card training">
                                            <div className="training-header">
                                                <span className="training-type">{training.type}</span>
                                                <span className={`priority priority-${training.priority}`}>
                                                    {training.priority}
                                                </span>
                                            </div>
                                            <strong>{training.name}</strong>
                                            {training.reason && <p>{training.reason}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recommendations.cv_improvements?.length > 0 && (
                                <div className="recommendation-group">
                                    <h4>Améliorations du CV</h4>
                                    {recommendations.cv_improvements.map((improvement, i) => (
                                        <div key={i} className="recommendation-card improvement">
                                            <span className="section-badge">{improvement.section}</span>
                                            <p>{improvement.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recommendations.overall_recommendations_summary && (
                                <div className="summary-box">
                                    <p>{recommendations.overall_recommendations_summary}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="close-btn" onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default CVOptimizationModal;
