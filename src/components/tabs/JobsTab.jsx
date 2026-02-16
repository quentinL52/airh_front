import React, { useState, useEffect } from 'react';
import { jobsService } from '../../services/jobService';
import JobCard from './JobCard';
import Fuse from 'fuse.js';
import '../../style/JobsTab.css';
import JobDetailsModal from './JobDetailsModal';
import CVOptimizationModal from './CVOptimizationModal';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { interviewService } from '../../services/interviewService';
import { cvOptimizationService } from '../../services/cvOptimizationService';
import { feedbackService } from '../../services/feedbackService';
import FeedbackDetailModal from './FeedbackDetailModal';

const JobCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-company skeleton-shimmer"></div>
        <div className="skeleton-badges">
            <div className="skeleton-badge skeleton-shimmer"></div>
            <div className="skeleton-badge skeleton-shimmer"></div>
        </div>
        <div className="skeleton-actions">
            <div className="skeleton-btn skeleton-shimmer"></div>
            <div className="skeleton-btn skeleton-shimmer"></div>
        </div>
    </div>
);

const JobsTab = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [activeInterviews, setActiveInterviews] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [availableContracts, setAvailableContracts] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Detail Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailJob, setDetailJob] = useState(null);

    // Feedback Modal State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // CV Optimization Modal State
    const [showOptimizationModal, setShowOptimizationModal] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState(null);
    const [optimizationJob, setOptimizationJob] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const fuseOptions = {
        keys: [
            { name: 'poste', weight: 0.7 },
            { name: 'entreprise', weight: 0.5 },
            { name: 'description_poste', weight: 0.3 },
            { name: 'competences', weight: 0.4 }
        ],
        threshold: 0.3,
        minMatchCharLength: 2,
    };

    let fuse;

    const normalizeContract = (contract) => {
        if (!contract) return '';
        const trimmed = contract.toString().trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await getToken();

                // Fetch jobs, active interviews, AND feedbacks
                const [jobsData, activeData, feedbacksData] = await Promise.all([
                    jobsService.getJobs(),
                    jobsService.getActiveInterviews(token),
                    feedbackService.getMyFeedbacks(token)
                ]);

                setJobs(jobsData);
                setFilteredJobs(jobsData);
                setActiveInterviews(activeData);
                setFeedbacks(feedbacksData);

                // Extract unique contracts with normalization
                const contracts = [...new Set(jobsData.map(job => normalizeContract(job.contrat)))].filter(Boolean).sort();
                setAvailableContracts(contracts);

                fuse = new Fuse(jobsData, fuseOptions);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        let results = jobs;

        // 1. Filter by Search Term
        if (searchTerm.trim() !== '') {
            const tempFuse = new Fuse(jobs, fuseOptions);
            const searchResults = tempFuse.search(searchTerm);
            results = searchResults.map(result => result.item);
        }

        // 2. Filter by Contract
        if (selectedContracts.length > 0) {
            results = results.filter(job => selectedContracts.includes(normalizeContract(job.contrat)));
        }

        setFilteredJobs(results);

    }, [searchTerm, selectedContracts, jobs]);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleContract = (contract) => {
        setSelectedContracts(prev => {
            if (prev.includes(contract)) {
                return prev.filter(c => c !== contract);
            } else {
                return [...prev, contract];
            }
        });
    };

    const handleJobClick = (job, action = 'interview') => {
        if (action === 'view') {
            setDetailJob(job);
            setShowDetailModal(true);
            return;
        }

        if (activeInterviews.includes(job.id)) {
            setSelectedJob(job);
            setShowModal(true);
        } else {
            navigate(`/home?section=interview&jobId=${job.id}`);
        }
    };

    const handleContinue = () => {
        navigate(`/home?section=interview&jobId=${selectedJob.id}`);
        setShowModal(false);
    };

    const handleNewInterview = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            await interviewService.deleteHistory(selectedJob.id, token);
            // Refresh active list locally or just navigate (since it's now "new")
            navigate(`/home?section=interview&jobId=${selectedJob.id}`);
            setShowModal(false);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression de l'ancien entretien");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimizeCV = async (job) => {
        setOptimizationJob(job);
        setShowDetailModal(false);
        setShowOptimizationModal(true);
        setIsOptimizing(true);
        setOptimizationResult(null);

        try {
            const token = await getToken();
            const result = await cvOptimizationService.analyzeMatch(job.id, token);
            setOptimizationResult(result);
        } catch (e) {
            console.error("Erreur lors de l'optimisation:", e);
            alert(e.message || "Erreur lors de l'analyse. Assurez-vous d'avoir téléchargé votre CV.");
            setShowOptimizationModal(false);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleCloseOptimization = () => {
        setShowOptimizationModal(false);
        setOptimizationResult(null);
        setOptimizationJob(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="jobs-grid">
                    {[...Array(6)].map((_, index) => (
                        <JobCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (filteredJobs.length === 0 && (searchTerm || selectedContracts.length > 0)) {
            return <div className="jobs-error">Aucune offre ne correspond à votre recherche.</div>;
        }
        if (filteredJobs.length === 0) {
            return <div className="jobs-error">Aucune offre d'emploi disponible pour le moment.</div>;
        }
        return (
            <div className="jobs-grid">
                {filteredJobs.map(job => {
                    // Robust ID matching: Convert both to string
                    const feedback = feedbacks.find(fb => String(fb.job_offer_id) === String(job.id));

                    return (
                        <JobCard
                            key={job.id}
                            job={job}
                            feedback={feedback}
                            isActive={activeInterviews.includes(job.id)}
                            onStart={handleJobClick}
                            onViewFeedback={async () => {
                                try {
                                    if (feedback) {
                                        const token = await getToken();
                                        const detail = await feedbackService.getFeedbackById(feedback.id, token);
                                        setSelectedFeedback(detail);
                                        setShowFeedbackModal(true);
                                    }
                                } catch (e) {
                                    console.error("Error fetching feedback detail", e);
                                }
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="tab-content">
            <div className="content-header">
                <p className="section-subtitle">Découvrez les opportunités et lancez votre entretien.</p>
                <div className="search-filter-container">
                    <input
                        type="text"
                        className="job-search-bar"
                        placeholder="Rechercher par poste, entreprise, compétences (exemple: python)"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="contract-selector-wrapper">
                        {/* Simple elegant dropdown placeholder or implementation */}
                        <div className="contract-selector">
                            <span className="selector-label">Type de contrat</span>
                            <div className="selector-dropdown">
                                {availableContracts.map(contract => (
                                    <label key={contract} className="contract-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedContracts.includes(contract)}
                                            onChange={() => toggleContract(contract)}
                                        />
                                        {contract}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {renderContent()}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Entretien en cours</h3>
                        <p>Vous avez déjà commencé un entretien pour <strong>{selectedJob?.poste}</strong>.</p>
                        <p>Que souhaitez-vous faire ?</p>
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleContinue}>Continuer</button>
                            <button className="secondary-btn" onClick={handleNewInterview}>Nouvel Entretien</button>
                        </div>
                        <button className="close-btn" onClick={() => setShowModal(false)}>Annuler</button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && (
                <JobDetailsModal
                    job={detailJob}
                    feedback={detailJob && feedbacks.find(fb => String(fb.job_offer_id) === String(detailJob.id))}
                    isActive={detailJob && activeInterviews.includes(detailJob.id)}
                    onStartInterview={() => handleJobClick(detailJob, 'interview')}
                    onOptimizeCV={handleOptimizeCV}
                    onViewFeedback={async (feedbackId) => {
                        try {
                            setShowDetailModal(false);
                            const token = await getToken();
                            const detail = await feedbackService.getFeedbackById(feedbackId, token);
                            setSelectedFeedback(detail);
                            setShowFeedbackModal(true);
                        } catch (e) {
                            console.error("Error fetching feedback", e);
                        }
                    }}
                    onClose={() => setShowDetailModal(false)}
                />
            )}

            {/* Feedback Modal */}
            {showFeedbackModal && selectedFeedback && (
                <FeedbackDetailModal
                    feedback={selectedFeedback}
                    onClose={() => {
                        setShowFeedbackModal(false);
                        setSelectedFeedback(null);
                    }}
                />
            )}

            {/* CV Optimization Modal */}
            {showOptimizationModal && (
                <CVOptimizationModal
                    result={optimizationResult}
                    job={optimizationJob}
                    isLoading={isOptimizing}
                    onClose={handleCloseOptimization}
                />
            )}
        </div>
    );
};

export default JobsTab;