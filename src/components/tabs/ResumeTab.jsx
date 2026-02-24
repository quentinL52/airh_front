import React, { useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { resumeService } from '../../services/resumeService';
import { ResumeSkeleton } from '../ui/SkeletonLoader';
import ContactPopup from '../dashboard/ContactPopup';
import '../../style/ResumeTab.css';

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
};

// --- Barre de score ---
const ScoreBar = ({ label, score, details }) => {
    const color = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
    return (
        <div className="score-bar-item">
            <div className="score-bar-header">
                <span className="score-bar-label">{label}</span>
                <span className="score-bar-value" style={{ color }}>{score}/100</span>
            </div>
            <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${score}%`, backgroundColor: color }} />
            </div>
            {details && <p className="score-bar-details">{details}</p>}
        </div>
    );
};

// --- Carte d'un projet analysé ---
const ProjectCard = ({ project, rang, raison }) => {
    const score = project.score_coherence ?? 0;
    const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
    const scoreLabel = score >= 75 ? 'Très pertinent' : score >= 50 ? 'Pertinent' : 'Peu pertinent';
    const pointsForts = toArray(project.points_forts);
    const pointsAmelio = toArray(project.points_amelioration);
    const conseilsDesc = toArray(project.conseils_description);

    return (
        <div className="project-analysis-card">
            <div className="project-analysis-header">
                <div className="project-analysis-title-row">
                    {rang != null && <span className="project-rank">#{rang}</span>}
                    <h5 className="project-analysis-title">{project.titre || 'Projet sans titre'}</h5>
                </div>
                <div className="project-score-badge" style={{ color: scoreColor, borderColor: scoreColor }}>
                    <span className="project-score-number">{score}</span>
                    <span className="project-score-label">/100 · {scoreLabel}</span>
                </div>
            </div>

            <div className="project-analysis-body">
                {raison && (
                    <div className="project-field">
                        <span className="project-field-label">Cohérence poste visé</span>
                        <p className="project-field-value">{raison}</p>
                    </div>
                )}

                {pointsForts.length > 0 && (
                    <div className="project-field">
                        <span className="project-field-label">Points forts</span>
                        <ul className="project-list">
                            {pointsForts.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                )}

                {pointsAmelio.length > 0 && (
                    <div className="project-field">
                        <span className="project-field-label">Points d'amélioration</span>
                        <ul className="project-list">
                            {pointsAmelio.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                )}

                {conseilsDesc.length > 0 && (
                    <div className="project-field">
                        <span className="project-field-label">Conseils rédaction</span>
                        <ul className="project-list">
                            {conseilsDesc.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Affichage principal des recommandations ---
const RecommandationsDisplay = ({ cvData }) => {
    const header = cvData.header_analysis || {};
    const postes = toArray(cvData.postes_recommandes);
    const qualite = cvData.qualite_cv || {};
    const projets = toArray(cvData.analyse_projets);
    const ordreProjets = toArray(cvData.ordre_mise_en_avant_projets);
    const coherenceGlobale = cvData.coherence_globale_projets || {};

    const scoreGlobal = qualite.score_global ?? 0;
    const scoreGlobalColor = scoreGlobal >= 75 ? '#16a34a' : scoreGlobal >= 50 ? '#d97706' : '#dc2626';

    // Map titre -> { rang, raison } depuis l'ordre de mise en avant
    const projetMeta = {};
    ordreProjets.forEach(item => {
        if (item.titre) projetMeta[item.titre] = { rang: item.rang, raison: item.raison };
    });

    const criteres = [
        { key: 'compatibilite_ats', label: 'Compatibilité ATS' },
        { key: 'quantification_resultats', label: 'Quantification des résultats' },
        { key: 'structure_lisibilite', label: 'Structure et lisibilité' },
        { key: 'presentation_projets', label: 'Présentation des projets' },
        { key: 'preuves_competences', label: 'Preuves de compétences' },
    ];

    return (
        <div className="reco-container">

            {/* Postes recommandés */}
            {postes.length > 0 && (
                <div className="reco-block">
                    <div className="reco-block-header">Postes recommandés</div>
                    <div className="reco-block-body">
                        <div className="postes-grid">
                            {postes.map((poste, i) => (
                                <span key={i} className="poste-chip">
                                    {typeof poste === 'string'
                                        ? poste
                                        : poste.nom || poste.titre || String(poste)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Qualité du CV */}
            {Object.keys(qualite).length > 0 && (
                <div className="reco-block">
                    <div className="reco-block-header">
                        <span>Qualité du CV</span>
                        <span className="score-global-badge" style={{ backgroundColor: scoreGlobalColor }}>
                            {scoreGlobal}/100
                        </span>
                    </div>
                    <div className="reco-block-body">
                        <div className="scores-grid">
                            {criteres.map(({ key, label }) => {
                                const critere = qualite[key];
                                if (!critere || typeof critere.score !== 'number') return null;
                                return (
                                    <ScoreBar
                                        key={key}
                                        label={label}
                                        score={critere.score}
                                        details={critere.details}
                                    />
                                );
                            })}
                        </div>

                        {toArray(qualite.red_flags).length > 0 && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Points d'attention</h6>
                                <ul className="quality-list">
                                    {toArray(qualite.red_flags).map((flag, i) => <li key={i}>{flag}</li>)}
                                </ul>
                            </div>
                        )}

                        {toArray(qualite.conseils_prioritaires).length > 0 && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Conseils prioritaires</h6>
                                <ul className="quality-list">
                                    {toArray(qualite.conseils_prioritaires).map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Analyse des projets — triés par rang de pertinence */}
            {projets.length > 0 && (
                <div className="reco-block">
                    <div className="reco-block-header">
                        <span>Analyse des projets</span>
                        <span className="reco-block-header-sub">(par ordre de pertinence)</span>
                        {typeof coherenceGlobale.score === 'number' && (
                            <span className="coherence-badge">
                                Cohérence globale : {coherenceGlobale.score}/100
                            </span>
                        )}
                    </div>
                    <div className="reco-block-body">
                        {coherenceGlobale.commentaire && (
                            <p className="coherence-comment">{coherenceGlobale.commentaire}</p>
                        )}
                        <div className="projects-analysis-list">
                            {[...projets]
                                .sort((a, b) => {
                                    const rangA = projetMeta[a.titre]?.rang ?? 99;
                                    const rangB = projetMeta[b.titre]?.rang ?? 99;
                                    return rangA - rangB;
                                })
                                .map((project, i) => (
                                    <ProjectCard
                                        key={i}
                                        project={project}
                                        rang={projetMeta[project.titre]?.rang ?? null}
                                        raison={projetMeta[project.titre]?.raison ?? null}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Composant principal ResumeTab ---
const ResumeTab = ({ user, cvData, isLoading, onRefresh }) => {
    const { getToken } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isDragOver, setIsDragOver] = useState(false);
    const [isContactPopupOpen, setContactPopupOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (!file) {
            setSelectedFile(null);
            setStatusMessage({ text: '', type: '' });
            return;
        }
        setSelectedFile(file);
        if (file.type !== 'application/pdf') {
            setStatusMessage({ text: 'Erreur : Veuillez sélectionner un fichier PDF.', type: 'error' });
        } else if (file.size > 800 * 1024) {
            setStatusMessage({ text: 'Erreur : Le fichier dépasse la taille maximale (800 Ko).', type: 'error' });
        } else {
            setStatusMessage({ text: `Fichier prêt : ${file.name}`, type: 'success' });
        }
    };

    const isFileTooLarge = selectedFile && selectedFile.size > 800 * 1024;
    const isInvalidType = selectedFile && selectedFile.type !== 'application/pdf';
    const canUpload = selectedFile && !isFileTooLarge && !isInvalidType;

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setStatusMessage({ text: 'Analyse de votre CV en cours, veuillez patienter...', type: 'info' });
        try {
            const token = await getToken();
            await resumeService.uploadResume(selectedFile, token);
            setStatusMessage({ text: 'Analyse terminée avec succès !', type: 'success' });
            setSelectedFile(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;
        try {
            const token = await getToken();
            await resumeService.deleteResume(token);
            setStatusMessage({ text: 'CV supprimé avec succès.', type: 'success' });
            if (onRefresh) onRefresh();
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        }
    };

    const handleDragEvents = (e, over) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(over);
    };

    const handleDrop = (e) => {
        handleDragEvents(e, false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    return (
        <div className="tab-content">

            {/* Zone upload */}
            <div className="resume-top-control">
                <div className="upload-card-content">
                    <div
                        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                        onDragEnter={(e) => handleDragEvents(e, true)}
                        onDragLeave={(e) => handleDragEvents(e, false)}
                        onDragOver={(e) => handleDragEvents(e, true)}
                        onDrop={handleDrop}
                    >
                        <p className="upload-text">Glissez-déposez ou cliquez ici</p>
                        <p className="upload-hint">Format PDF uniquement · Max 800 Ko</p>
                        <input
                            type="file"
                            accept=".pdf"
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {selectedFile && <p className="file-name-display">{selectedFile.name}</p>}
                    {statusMessage.text && (
                        <p className={`status-message ${statusMessage.type}`}>{statusMessage.text}</p>
                    )}
                </div>

                <div className="upload-actions">
                    <button
                        onClick={handleUpload}
                        disabled={!canUpload || isUploading}
                        className="btn-primary"
                    >
                        Analyser
                    </button>
                    {cvData && (
                        <button onClick={handleDelete} className="btn-danger-custom">
                            Supprimer
                        </button>
                    )}
                </div>

                <div className="roni-explanation">
                    <p>
                        Ajoutez votre CV pour que <strong>Roni</strong> puisse mieux vous connaître
                        et vous accompagner efficacement lors de vos entretiens.
                    </p>
                    <button className="btn-link-contact" onClick={() => setContactPopupOpen(true)}>
                        Une erreur dans l'analyse, une question ?
                    </button>
                </div>
            </div>

            {/* Zone recommandations */}
            <div className="resume-data-container">
                {isLoading && !cvData && <ResumeSkeleton />}

                {!isLoading && cvData ? (
                    <div className="cv-display-wrapper">
                        <div className="reco-main-header">L'analyse de Roni</div>
                        <div className="reco-main-body">
                            <RecommandationsDisplay cvData={cvData} />
                        </div>
                    </div>
                ) : !isLoading && (
                    <div className="empty-state-container">
                        <h4>Aucune analyse à afficher</h4>
                        <p>Téléchargez votre CV pour obtenir les recommandations personnalisées de Roni.</p>
                    </div>
                )}
            </div>

            <ContactPopup
                isOpen={isContactPopupOpen}
                onClose={() => setContactPopupOpen(false)}
                user={user}
                initialValues={{ name: '', subject: 'Support Analyse CV' }}
                hideSubject={true}
            />
        </div>
    );
};

export default ResumeTab;
