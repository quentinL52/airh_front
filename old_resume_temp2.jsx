import React, { useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { resumeService } from '../../services/resumeService';
import { ResumeSkeleton } from '../ui/SkeletonLoader';
import ContactPopup from '../dashboard/ContactPopup';
import '../../style/ResumeTab.css';

// Normalisation utilitaire pour s├®curiser les rendus
const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    return [value];
};

// --- COMPOSANT EXISTANT MODIFI├ë : CvDataDisplay ---
const CvDataDisplay = ({ cvData }) => (
    <div className="cv-data-container">
        <div className="cv-inner-layout">
            {/* Colonne Gauche (Sidebar) : Comp├®tences & Formations */}
            <div className="cv-sidebar">
                {/* Comp├®tences */}
                <div className="cv-section">
                    <div className="cv-section-header">Comp├®tences</div>
                    <div className="cv-section-body">
                        <h6>Techniques</h6>
                        <div className="skills-container">
                            {toArray(cvData.comp├®tences?.hard_skills).length > 0
                                ? toArray(cvData.comp├®tences?.hard_skills).map(skill => <span key={skill} className="skill-badge hard">{skill}</span>)
                                : <small>Aucune</small>}
                        </div>
                        <h6 style={{ marginTop: '1rem' }}>Comportementales</h6>
                        <div className="skills-container">
                            {toArray(cvData.comp├®tences?.soft_skills).length > 0
                                ? toArray(cvData.comp├®tences?.soft_skills).map(skill => <span key={skill} className="skill-badge soft">{skill}</span>)
                                : <small>Aucune</small>}
                        </div>
                    </div>
                </div>

                {/* Formations */}
                <div className="cv-section">
                    <div className="cv-section-header">Formations</div>
                    <div className="cv-section-body">
                        {toArray(cvData.formations).length > 0 ? (
                            toArray(cvData.formations).map((formation, index) => (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <p className="font-bold">{formation.degree}</p>
                                    <p className="text-sm text-gray-600">{formation.institution}</p>
                                    <p className="text-xs text-gray-500">{formation.start_date} - {formation.end_date}</p>
                                </div>
                            ))
                        ) : <small>Aucune</small>}
                    </div>
                </div>
            </div>

            {/* Colonne Droite (Main) : Exp├®riences & Projets */}
            <div className="cv-main">
                {/* Exp├®riences Professionnelles */}
                <div className="cv-section">
                    <div className="cv-section-header">Exp├®riences Professionnelles</div>
                    <div className="cv-section-body">
                        {toArray(cvData.exp├®riences).length > 0 ? (
                            toArray(cvData.exp├®riences).map((exp, index) => (
                                <div key={index} className="experience-item">
                                    <div className="experience-header">
                                        <h5 className="experience-title">{exp.Poste}</h5>
                                        <span className="experience-company">{exp.Entreprise}</span>
                                        <span className="experience-dates">{exp.start_date} - {exp.end_date}</span>
                                    </div>
                                    {toArray(exp.responsabilit├®s).length > 0 && (
                                        <ul className="experience-responsibilities">
                                            {toArray(exp.responsabilit├®s).map((resp, i) => <li key={i}>{resp}</li>)}
                                        </ul>
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
                        {toArray(cvData.projets?.professional).length > 0 || toArray(cvData.projets?.personal).length > 0 ? (
                            <>
                                {toArray(cvData.projets?.professional).length > 0 && (
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h6 className="subsection-title">Projets Professionnels</h6>
                                        {toArray(cvData.projets?.professional).map((proj, index) => (
                                            <div key={`prof-${index}`} className="project-item">
                                                <p><strong>{proj.title || 'N/A'}</strong></p>
                                                <p className="text-sm">Technologies: {toArray(proj.technologies).join(', ') || 'N/A'}</p>
                                                {toArray(proj.outcomes).length > 0 && (
                                                    <ul className="project-outcomes">
                                                        {toArray(proj.outcomes).map((outcome, i) => <li key={i}>{outcome}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {toArray(cvData.projets?.personal).length > 0 && (
                                    <div>
                                        <h6 className="subsection-title">Projets Personnels</h6>
                                        {toArray(cvData.projets?.personal).map((proj, index) => (
                                            <div key={`pers-${index}`} className="project-item">
                                                <p><strong>{proj.title || 'N/A'}</strong></p>
                                                <p className="text-sm">Technologies: {toArray(proj.technologies).join(', ') || 'N/A'}</p>
                                                {toArray(proj.outcomes).length > 0 && (
                                                    <ul className="project-outcomes">
                                                        {toArray(proj.outcomes).map((outcome, i) => <li key={i}>{outcome}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : <small>Aucun</small>}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- FIN COMPOSANT EXISTANT MODIFI├ë : CvDataDisplay ---

const ResumeTab = ({ user, cvData, isLoading, onRefresh }) => {
    const { getToken } = useAuth();
    // cvData et isLoading viennent maintenant des props
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isDragOver, setIsDragOver] = useState(false);
    const [isContactPopupOpen, setContactPopupOpen] = useState(false);
    const fileInputRef = useRef(null);

    // fetchCvData supprim├® car g├®r├® par le parent (HomePage)

    const handleFileSelect = (file) => {
        if (!file) {
            setSelectedFile(null);
            setStatusMessage({ text: '', type: '' });
            return;
        }

        setSelectedFile(file); // On garde toujours la trace du fichier s├®lectionn├®

        if (file.type !== 'application/pdf') {
            setStatusMessage({ text: 'Erreur : Veuillez s├®lectionner un fichier PDF.', type: 'error' });
        } else if (file.size > 800 * 1024) {
            setStatusMessage({ text: 'Erreur : Le fichier d├®passe la taille maximale (800 Ko).', type: 'error' });
        } else {
            setStatusMessage({ text: `Fichier pr├¬t : ${file.name}`, type: 'success' });
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
            setStatusMessage({ text: 'Analyse termin├®e avec succ├¿s !', type: 'success' });
            setSelectedFile(null);
            // Rafra├«chir les donn├®es via le parent
            if (onRefresh) onRefresh();
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('├ètes-vous s├╗r de vouloir supprimer votre CV ?')) return;
        // On utilise un ├®tat local pour loading lors de la suppression si on veut bloquer l'UI,
        // mais ici on peut juste utiliser setIsUploading ou un ├®tat local temporaire si besoin.
        // Pour rester simple, on ne bloque pas tout l'├®cran via isLoading parent, mais on pourrait.
        try {
            const token = await getToken();
            await resumeService.deleteResume(token);
            setStatusMessage({ text: 'CV supprim├® avec succ├¿s.', type: 'success' });
            if (onRefresh) onRefresh();
        } catch (error) {
            setStatusMessage({ text: error.message, type: 'error' });
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
                {/* La mise en page du header de la page a ├®t├® d├®plac├®e dans resume-top-control */}
            </div>

            {/* PARTIE SUP├ëRIEURE : Upload et Boutons (Layout horizontal) */}
            <div className="resume-top-control">
                {/* Carr├® d'import r├®duit (upload-card-content & upload-area) */}
                <div className="upload-card-content">
                    <div
                        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                        onDragEnter={(e) => handleDragEvents(e, true)}
                        onDragLeave={(e) => handleDragEvents(e, false)}
                        onDragOver={(e) => handleDragEvents(e, true)}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                        <p className="upload-text">Glissez-d├®posez ou cliquez ici</p>
                        <p className="upload-hint">Format PDF uniquement (Max 800 Ko)</p>
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

                {/* Boutons ├á c├┤t├® du carr├® d'import (upload-actions) */}
                <div className="upload-actions">
                    <button
                        onClick={handleUpload}
                        disabled={!canUpload || isUploading}
                        className="btn-primary"
                    >
                        {isUploading ? 'Analyse...' : 'Analyser'}
                    </button>
                    {cvData && (
                        <button
                            onClick={handleDelete}
                            className="btn-danger-custom"
                        >
                            Supprimer
                        </button>
                    )}
                </div>

                {/* Explication Roni */}
                <div className="roni-explanation">
                    <p>
                        C'est ici que vous pouvez ajouter votre CV. L'analyse de vote CV va permettre ├á <strong>Roni</strong> de mieux vous connaitre et de vous aider au mieux pour vos futurs entretiens.
                    </p>
                    <button
                        className="btn-link-contact"
                        onClick={() => setContactPopupOpen(true)}
                    >
                        Une erreur dans l'analyse, une question ?
                    </button>
                </div>
            </div>

            {/* SECTION INF├ëRIEURE : Affichage du CV UNIQUEMENT */}
            <div className="resume-data-container">
                {(isLoading && !cvData) && (
                    <ResumeSkeleton />
                )}
                {!isLoading && cvData ? (
                    <div className="cv-display-wrapper">
                        <div className="analysis-header cv-section-header">D├®tails du CV</div>
                        <div className="cv-section-body">
                            <CvDataDisplay cvData={cvData} />
                        </div>
                    </div>
                ) : !isLoading && (
                    <div className="empty-state-container">
                        <i className="fas fa-eye-slash fa-2x" style={{ color: '#9ca3af' }}></i>
                        <h4 style={{ marginTop: '1rem' }}>Aucune donn├®e ├á afficher</h4>
                        <p>Veuillez t├®l├®charger un CV pour visualiser les donn├®es extraites par l'IA.</p>
                    </div>
                )}
            </div>

            <ContactPopup
                isOpen={isContactPopupOpen}
                onClose={() => setContactPopupOpen(false)}
                user={user}
                initialValues={{
                    name: cvData?.first_name || '',
                    subject: 'Support Analyse CV'
                }}
                hideSubject={true}
            />
        </div>
    );
};

export default ResumeTab;
