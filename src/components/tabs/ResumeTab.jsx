import React, { useState, useEffect, useCallback, useRef } from 'react';
import { resumeService } from '../../services/resumeService';
import '../../style/ResumeTab.css';

const CvDataDisplay = ({ cvData }) => (
    <div>
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
        
        {/* NOUVELLE SECTION : Projets */}
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


const ResumeTab = ({ user }) => {
    const [cvData, setCvData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const fetchCvData = useCallback(async (userId) => {
        setIsLoading(true);
        try {
            const data = await resumeService.getResumeData(userId);
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
            setCvData(response?.user_profile?.candidate_mongo_id ? response.parsed_data?.candidat : null);
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
            </div>
            <div className="resume-grid">
                {/* Colonne de gauche : Upload */}
                <div className="upload-card">
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
                    <button onClick={handleUpload} disabled={!selectedFile || isUploading} className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
                        {isUploading ? 'Analyse en cours...' : 'Analyser mon CV'}
                    </button>
                    {cvData && (
                        <button onClick={handleDelete} className="btn-danger" style={{width: '100%', marginTop: '1rem'}}>
                            Supprimer le CV actuel
                        </button>
                    )}
                </div>

                {/* Colonne de droite : Analyse */}
                <div className="analysis-card">
                    <div className="analysis-header cv-section-header">Profil Analysé</div>
                    {(isLoading || isUploading) && (
                        <div className="analysis-loading-overlay">
                            <div className="spinner"></div>
                            <p style={{marginTop: '1rem', color: '#6b7280'}}>{isUploading ? 'Analyse en cours...' : 'Chargement...'}</p>
                        </div>
                    )}
                    <div className="cv-section-body">
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
            </div>
        </div>
    );
};

export default ResumeTab;
