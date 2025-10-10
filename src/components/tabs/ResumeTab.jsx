import React, { useState, useEffect, useCallback, useRef } from 'react';
import { resumeService } from '../../services/resumeService';
import '../../style/ResumeTab.css';

// --- NOUVEAU COMPOSANT : Affichage de l'Analyse Globale ---
const CvAnalysisDisplay = ({ analyseGlobale }) => {
    if (!analyseGlobale) return <small>Aucune analyse globale disponible.</small>;

    return (
        <div className="analysis-data-container">
            {/* 1. Profil Global et Évaluation */}
            <div className="cv-section">
                <div className="cv-section-header">Synthèse du Profil</div>
                <div className="cv-section-body">
                    <p><strong>Profil Global:</strong> {analyseGlobale.global_profile || 'N/A'}</p>
                    <p><strong>Évaluation de l'expérience:</strong> {analyseGlobale.experience_evaluation || 'N/A'}</p>
                    <p><strong>Analyse Soft Skills:</strong> {analyseGlobale.soft_skills_analysis || 'N/A'}</p>
                    {analyseGlobale.reconversion?.is_reconversion && (
                        <p><strong>Reconversion:</strong> {analyseGlobale.reconversion.details || 'N/A'}</p>
                    )}
                </div>
            </div>

            {/* 2. Analyse des Compétences par Domaine */}
            <div className="cv-section">
                <div className="cv-section-header">Compétences par Domaine</div>
                <div className="cv-section-body">
                    {analyseGlobale.competence_analysis?.map((domainData, domainIndex) => (
                        <div key={domainIndex} style={{ marginBottom: '1rem' }}>
                            <h6>{domainData.domain}</h6>
                            <div className="skills-container">
                                {domainData.skills?.map((skillData, skillIndex) => (
                                    <span 
                                        key={skillIndex} 
                                        // Utilisation du niveau comme classe CSS pour la couleur
                                        className={`skill-badge ${skillData.level}`}
                                    >
                                        {skillData.name} ({skillData.level})
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Analyse des Projets */}
            <div className="cv-section">
                <div className="cv-section-header">Analyse des Projets Pertinents</div>
                <div className="cv-section-body">
                    {analyseGlobale.project_analysis?.length > 0 ? (
                        analyseGlobale.project_analysis.map((project, index) => (
                            <div key={index} style={{ marginBottom: '1rem' }}>
                                <p><strong>Titre:</strong> {project.title || 'N/A'}</p>
                                <p><strong>Objectifs:</strong> {project.objectives?.join(' / ') || 'N/A'}</p>
                                <p><strong>Skills démontrés:</strong> {project.skills_demonstrated?.join(', ') || 'N/A'}</p>
                            </div>
                        ))
                    ) : <small>Aucune analyse de projet.</small>}
                </div>
            </div>

            {/* 4. Recommandations */}
            <div className="cv-section">
                <div className="cv-section-header">Recommandations & Améliorations</div>
                <div className="cv-section-body">
                    <h6>Suggestions de carrière</h6>
                    <ul>
                        {analyseGlobale.career_recommendations?.map((rec, index) => <li key={`car-${index}`}>{rec}</li>)}
                    </ul>
                    <h6 style={{marginTop: '1rem'}}>Améliorations du CV</h6>
                    <ul>
                        {analyseGlobale.cv_improvement_suggestions?.map((sug, index) => <li key={`cv-${index}`}>{sug}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};
// --- FIN NOUVEAU COMPOSANT ---


// --- COMPOSANT EXISTANT MODIFIÉ : CvDataDisplay ---
const CvDataDisplay = ({ cvData }) => (
    <div className="cv-data-container">
        {/* Informations Personnelles (Ajouté car essentiel pour les données du CV) */}
        <div className="cv-section">
            <div className="cv-section-header">Informations Personnelles</div>
            <div className="cv-section-body">
                <p><strong>Nom:</strong> {cvData.informations_personnelles?.nom || 'N/A'}</p>
                <p><strong>Email:</strong> {cvData.informations_personnelles?.email || 'N/A'}</p>
                <p><strong>Téléphone:</strong> {cvData.informations_personnelles?.numero_de_telephone || 'N/A'}</p>
                <p><strong>Localisation:</strong> {cvData.informations_personnelles?.localisation || 'N/A'}</p>
            </div>
        </div>

        {/* Compétences */}
        <div className="cv-section">
            <div className="cv-section-header">Compétences</div>
            <div className="cv-section-body">
                <h6>Compétences Techniques</h6>
                <div className="skills-container">
                    {cvData.compétences?.hard_skills?.map(skill => <span key={skill} className="skill-badge hard">{skill}</span>) || <small>Aucune</small>}
                </div>
                <h6 style={{marginTop: '1rem'}}>Compétences Comportementales</h6>
                <div className="skills-container">
                    {cvData.compétences?.soft_skills?.map(skill => <span key={skill} className="skill-badge soft">{skill}</span>) || <small>Aucune</small>}
                </div>
            </div>
        </div>
        
        {/* Expériences Professionnelles */}
        <div className="cv-section">
            <div className="cv-section-header">Expériences Professionnelles</div>
            <div className="cv-section-body">
                {cvData.expériences?.length > 0 ? (
                    cvData.expériences.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <p><strong>Poste:</strong> {exp.Poste}</p>
                            <p><strong>Entreprise:</strong> {exp.Entreprise}</p>
                            <p><strong>Dates:</strong> {exp.start_date} - {exp.end_date}</p>
                            {exp.responsabilités?.length > 0 && (
                                <>
                                    <strong>Responsabilités:</strong>
                                    <ul>
                                        {exp.responsabilités.map((resp, i) => <li key={i}>{resp}</li>)}
                                    </ul>
                                </>
                            )}
                        </div>
                    ))
                ) : <small>Aucune</small>}
            </div>
        </div>
        
        {/* Projets */}
        <div className="cv-section">
            <div className="cv-section-header">Projets</div>
            <div className="cv-section-body">
                {cvData.projets?.professional?.length > 0 || cvData.projets?.personal?.length > 0 ? (
                    <>
                        {cvData.projets.professional?.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                <h6>Projets Professionnels</h6>
                                {cvData.projets.professional.map((proj, index) => (
                                    <div key={`prof-${index}`} style={{ marginBottom: '0.75rem' }}>
                                        <p><strong>Titre:</strong> {proj.title || 'N/A'}</p>
                                        <p><strong>Technologies:</strong> {proj.technologies?.join(', ') || 'N/A'}</p>
                                        {proj.outcomes?.length > 0 && (
                                            <>
                                                <strong>Résultats:</strong>
                                                <ul>
                                                    {proj.outcomes.map((outcome, i) => <li key={i}>{outcome}</li>)}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {cvData.projets.personal?.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                <h6>Projets Personnels</h6>
                                {cvData.projets.personal.map((proj, index) => (
                                    <div key={`pers-${index}`} style={{ marginBottom: '0.75rem' }}>
                                        <p><strong>Titre:</strong> {proj.title || 'N/A'}</p>
                                        <p><strong>Technologies:</strong> {proj.technologies?.join(', ') || 'N/A'}</p>
                                        {proj.outcomes?.length > 0 && ( 
                                            <>
                                                <strong>Résultats:</strong>
                                                <ul>
                                                    {proj.outcomes.map((outcome, i) => <li key={i}>{outcome}</li>)}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : <small>Aucun</small>}
            </div>
        </div>
        
        {/* Formations */}
        <div className="cv-section">
            <div className="cv-section-header">Formations</div>
            <div className="cv-section-body">
                {cvData.formations?.length > 0 ? (
                    cvData.formations.map((formation, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <p><strong>Diplôme:</strong> {formation.degree}</p>
                            <p><strong>Établissement:</strong> {formation.institution}</p>
                            <p><strong>Dates:</strong> {formation.start_date} - {formation.end_date}</p>
                        </div>
                    ))
                ) : <small>Aucune</small>}
            </div>
        </div>
    </div>
);

// --- FIN COMPOSANT EXISTANT MODIFIÉ : CvDataDisplay ---


const ResumeTab = ({ user }) => {
    const [cvData, setCvData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const analyseGlobale = cvData?.analyse_globale;
    const hasAnalysisData = !!analyseGlobale;

    const fetchCvData = useCallback(async (userId) => {
        setIsLoading(true);
        try {
            const data = await resumeService.getResumeData(userId);
            // Stocker directement le candidat pour simplifier l'accès
            setCvData(data?.parsed_data?.candidat || null);
        } catch (error) {
            setStatusMessage({ text: 'Erreur de chargement du CV.', type: 'error' });
            setCvData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchCvData(user.id);
        }
    }, [fetchCvData, user]);

    const handleFileSelect = (file) => {
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setStatusMessage({ text: `Fichier prêt : ${file.name}`, type: 'success' });
        } else {
            setSelectedFile(null);
            setStatusMessage({ text: 'Erreur : Veuillez sélectionner un fichier PDF.', type: 'error' });
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setStatusMessage({ text: 'Analyse de votre CV en cours...', type: 'info' });
        try {
            const response = await resumeService.uploadResume(selectedFile);
            setStatusMessage({ text: 'Analyse terminée avec succès !', type: 'success' });
            setSelectedFile(null);
            // Mettre à jour cvData avec les données du nouvel upload si disponibles.
            // Sinon, refetch via fetchCvData.
            // On peut s'assurer de récupérer toutes les données, y compris l'analyse globale, via fetchCvData.
            fetchCvData(user.id);
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;
        setIsLoading(true);
        try {
            await resumeService.deleteResume();
            setCvData(null);
            setStatusMessage({ text: 'CV supprimé avec succès.', type: 'success' });
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Fonctions pour le Drag & Drop
    const handleDragEvents = (e, over) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(over);
    };
    
    const handleDrop = (e) => {
        handleDragEvents(e, false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    return (
        <div className="tab-content">
            <div className="content-header">
                {/* La mise en page du header de la page a été déplacée dans resume-top-control */}
            </div>

            {/* PARTIE SUPÉRIEURE : Upload et Boutons (Layout horizontal) */}
            <div className="resume-top-control">
                {/* Carré d'import réduit (upload-card-content & upload-area) */}
                <div className="upload-card-content">
                    <h3>Gérer mon CV</h3>
                    <div 
                        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                        onDragEnter={(e) => handleDragEvents(e, true)}
                        onDragLeave={(e) => handleDragEvents(e, false)}
                        onDragOver={(e) => handleDragEvents(e, true)}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                        <p className="upload-text">Glissez-déposez ou cliquez ici</p>
                        <p className="upload-hint">Format PDF uniquement</p>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            style={{ display: 'none' }}
                        />
                    </div>
                    {selectedFile && <p className="file-name-display">{selectedFile.name}</p>}
                    {statusMessage.text && <p className={`status-message ${statusMessage.type}`}>{statusMessage.text}</p>}
                </div>

                {/* Boutons à côté du carré d'import (upload-actions) */}
                <div className="upload-actions">
                    <button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isUploading} 
                        className="btn-primary"
                    >
                        {isUploading ? 'Analyse en cours...' : 'Analyser mon CV'}
                    </button>
                    {cvData && (
                        <button 
                            onClick={handleDelete} 
                            className="btn-danger-custom" // Class CSS spécifique pour le rouge
                        >
                            Supprimer mon CV
                        </button>
                    )}
                </div>
            </div>

            {/* SECTION INFÉRIEURE : Affichage du CV et de l'Analyse (Grid 2 colonnes) */}
            <div className="resume-data-analysis-grid">
                
                {/* PARTIE GAUCHE : Détails du CV (Ancien contenu de la colonne droite adapté) */}
                <div className="analysis-card cv-data-section">
                    <div className="analysis-header cv-section-header">Détails du CV</div>
                    <div className="cv-section-body">
                        {(isLoading && !cvData) && (
                            <div className="analysis-loading-overlay">
                                <div className="spinner"></div>
                                <p style={{marginTop: '1rem', color: '#6b7280'}}>Chargement...</p>
                            </div>
                        )}
                        {!isLoading && cvData ? (
                            <CvDataDisplay cvData={cvData} />
                        ) : !isLoading && (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <i className="fas fa-eye-slash fa-2x" style={{color: '#9ca3af'}}></i>
                                <h4 style={{ marginTop: '1rem' }}>Aucune donnée à afficher</h4>
                                <p>Veuillez télécharger un CV pour que notre IA l'analyse.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PARTIE DROITE : Analyse Globale du CV (Nouvelle section) */}
                <div className="analysis-card cv-analysis-section">
                    <div className="analysis-header cv-section-header">Analyse du CV</div>
                    <div className="cv-section-body">
                        {(isLoading && !hasAnalysisData) && (
                            <div className="analysis-loading-overlay">
                                <div className="spinner"></div>
                                <p style={{marginTop: '1rem', color: '#6b7280'}}>Chargement...</p>
                            </div>
                        )}
                        {!isLoading && hasAnalysisData ? (
                            <CvAnalysisDisplay analyseGlobale={analyseGlobale} />
                        ) : !isLoading && (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <i className="fas fa-brain fa-2x" style={{color: '#6366f1'}}></i>
                                <h4 style={{ marginTop: '1rem' }}>Analyse IA non disponible</h4>
                                <p>Téléchargez et analysez votre CV pour générer le rapport IA.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeTab;