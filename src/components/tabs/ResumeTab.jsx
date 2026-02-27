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

// --- Helper pour formater les textes longs ---
// Divise le texte par point (ou point-virgule) pour en faire des paragraphes distincts
// Idéal pour aérer les longs blocs d'analyse
const formatLongText = (text) => {
    if (!text) return null;

    // Si c'est déjà un tableau, on le retourne tel quel
    if (Array.isArray(text)) return text.map((t, i) => <p key={i} className="formatted-paragraph">{t}</p>);

    // Séparation basique par points (suivis d'un espace pour éviter de couper les URLs ou nombres décimaux)
    // On nettoie aussi les tirets de liste natifs si l'IA en a généré dans le texte brut
    const sentences = text
        .split(/(?<=\.)\s+/)
        .map(s => s.trim().replace(/^[-•]\s*/, ''))
        .filter(s => s.length > 0);

    return (
        <div className="formatted-text-block">
            {sentences.map((sentence, idx) => (
                <p key={idx} className="formatted-paragraph">{sentence}</p>
            ))}
        </div>
    );
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
            {details && <div className="score-bar-details">{formatLongText(details)}</div>}
        </div>
    );
};

// --- Carte d'un projet analysé ---
const ProjectCard = ({ project }) => {
    const score = project.note_globale ?? 0;
    const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
    const scoreLabel = score >= 75 ? 'Très pertinent' : score >= 50 ? 'Pertinent' : 'Peu pertinent';

    const pointsForts = toArray(project.points_forts);
    const pointsVigilance = toArray(project.points_vigilance);
    const evaluation = project.evaluation || {};

    const axes = [
        { key: 'pertinence', label: 'Pertinence' },
        { key: 'complexite', label: 'Complexité' },
        { key: 'stack', label: 'Tech Stack' },
        { key: 'innovation', label: 'Innovation' },
        { key: 'impact', label: 'Impact' },
        { key: 'ownership', label: 'Ownership' },
        { key: 'maturite', label: 'Maturité' },
    ];

    return (
        <div className="project-analysis-card">
            <div className="project-analysis-header">
                <div className="project-analysis-title-row">
                    <h5 className="project-analysis-title">{project.titre || 'Projet sans titre'}</h5>
                </div>
                <div className="project-score-badge" style={{ color: scoreColor, borderColor: scoreColor }}>
                    <span className="project-score-number">{score}</span>
                    <span className="project-score-label">/100 · {scoreLabel}</span>
                </div>
            </div>

            <div className="project-analysis-body">
                {project.resume && (
                    <div className="project-field-card">
                        <span className="project-field-label">Résumé</span>
                        <div className="project-field-value">{formatLongText(project.resume)}</div>
                    </div>
                )}

                <div className="project-axes-grid">
                    {axes.map(({ key, label }) => {
                        const axis = evaluation[key];
                        if (!axis) return null;
                        const axisColor = axis.score >= 7 ? '#16a34a' : axis.score >= 5 ? '#d97706' : '#dc2626';
                        return (
                            <div key={key} className="project-axis-card">
                                <div className="project-axis-header">
                                    <span className="project-axis-label">{label}</span>
                                    <span className="project-axis-score" style={{ color: axisColor }}>{axis.score}/10</span>
                                </div>
                                <p className="project-axis-justification">{axis.justification}</p>
                            </div>
                        );
                    })}
                </div>

                {pointsForts.length > 0 && (
                    <div className="project-field-card">
                        <span className="project-field-label">Points forts</span>
                        <ul className="project-list">
                            {pointsForts.map((p, i) => <li key={i}>{formatLongText(p)}</li>)}
                        </ul>
                    </div>
                )}

                {pointsVigilance.length > 0 && (
                    <div className="project-field-card">
                        <span className="project-field-label">Points de vigilance</span>
                        <ul className="project-list">
                            {pointsVigilance.map((p, i) => <li key={i}>{formatLongText(p)}</li>)}
                        </ul>
                    </div>
                )}

                {project.verdict_recruteur && (
                    <div className="project-verdict-box">
                        <span className="project-verdict-label">L'avis de Roni</span>
                        <div className="project-verdict-text">{formatLongText(project.verdict_recruteur)}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Affichage principal des recommandations ---
const RecommandationsDisplay = ({ cvData }) => {
    const postes = toArray(cvData.postes_recommandes);
    const qualite = cvData.qualite_cv || {};
    const projets = toArray(cvData.analyse_projets);

    const scoreGlobal = qualite.score_global ?? 0;
    const scoreGlobalColor = scoreGlobal >= 75 ? '#16a34a' : scoreGlobal >= 50 ? '#d97706' : '#dc2626';

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

                        {toArray(qualite.points_forts).length > 0 && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Points forts</h6>
                                <ul className="quality-list">
                                    {toArray(qualite.points_forts).map((p, i) => <li key={i}>{formatLongText(p)}</li>)}
                                </ul>
                            </div>
                        )}

                        {toArray(qualite.red_flags).length > 0 && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Points de vigilance</h6>
                                <ul className="quality-list">
                                    {toArray(qualite.red_flags).map((flag, i) => <li key={i}>{formatLongText(flag)}</li>)}
                                </ul>
                            </div>
                        )}

                        {toArray(qualite.conseils_prioritaires).length > 0 && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Conseils prioritaires</h6>
                                <ul className="quality-list">
                                    {toArray(qualite.conseils_prioritaires).map((c, i) => <li key={i}>{formatLongText(c)}</li>)}
                                </ul>
                            </div>
                        )}

                        {qualite.adaptation_seniorite && (
                            <div className="quality-section">
                                <h6 className="quality-section-title">Le point de vue de Roni</h6>
                                <div className="quality-text-box">{formatLongText(qualite.adaptation_seniorite)}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Analyse des projets */}
            {projets.length > 0 && (
                <div className="reco-block">
                    <div className="reco-block-header">
                        <span>Analyse des projets</span>
                    </div>
                    <div className="reco-block-body">
                        <div className="projects-analysis-list">
                            {projets.map((project, i) => (
                                <ProjectCard
                                    key={i}
                                    project={project}
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
    const [userCredits, setUserCredits] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch user credits
    React.useEffect(() => {
        const fetchCredits = async () => {
            try {
                const token = await getToken();
                if (!token) return;
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/auth/validate`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserCredits(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch credits in ResumeTab:", err);
            }
        };
        fetchCredits();
    }, [getToken]);

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
    const outOfCredits = userCredits && userCredits.cv_credits <= 0;
    const canUpload = selectedFile && !isFileTooLarge && !isInvalidType && !outOfCredits;

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
                        title={outOfCredits ? "Vous avez atteint la limite d'analyse gratuite (1 CV maximum)." : ""}
                    >
                        Analyser
                    </button>
                    {cvData && (
                        <button onClick={handleDelete} className="btn-danger-custom">
                            Supprimer
                        </button>
                    )}
                </div>

                {outOfCredits && (
                    <div style={{ color: '#dc2626', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        Vous avez atteint la limite d'analyse gratuite (1 CV maximum).
                    </div>
                )}

                {userCredits && !outOfCredits && (
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
                        Crédits restants : {userCredits.cv_credits}
                    </div>
                )}

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
