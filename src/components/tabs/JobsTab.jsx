import React, { useState, useEffect } from 'react';
import { jobsService } from '../../services/jobService';
import JobCard from './JobCard';
import Fuse from 'fuse.js';
import '../../style/JobsTab.css';
import Pagination from '../ui/Pagination';
import JobDetailsModal from './JobDetailsModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { interviewService } from '../../services/interviewService';
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

    // Client-side Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Detail Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailJob, setDetailJob] = useState(null);

    // Feedback Modal State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const normalizeContract = (contract) => {
        if (!contract) return '';
        const trimmed = contract.toString().trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    const fuseOptions = {
        keys: [
            { name: 'poste', weight: 0.7 },
            { name: 'entreprise', weight: 0.5 },
            { name: 'description_nettoyee', weight: 0.3 }, // Changed from description_poste
            { name: 'competences', weight: 0.4 }
        ],
        threshold: 0.3,
        minMatchCharLength: 2,
    };

    // 0. Load ALL data once
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const token = await getToken();

                // Fetch ALL jobs (lite version), active interviews, AND feedbacks
                const [jobsResponse, activeData, feedbacksData] = await Promise.all([
                    jobsService.getJobs(1, 1000, true), // Explicitly request lite version
                    jobsService.getActiveInterviews(token),
                    feedbackService.getMyFeedbacks(token)
                ]);

                // Handle response - assuming backend returns { items: [...], total: ... }
                const jobsData = jobsResponse.items || [];

                setJobs(jobsData);
                // Initial filter set to all
                setFilteredJobs(jobsData);

                setActiveInterviews(activeData);
                setFeedbacks(feedbacksData);

                // Extract unique contracts from ALL loaded jobs
                const contracts = [...new Set(jobsData.map(job => normalizeContract(job.contrat)))].filter(Boolean).sort();
                setAvailableContracts(contracts);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // 1. Client-Side Filtering (Search + Contracts)
    useEffect(() => {
        let results = jobs;

        // Filter by Search Term (Fuse.js)
        if (searchTerm.trim() !== '') {
            const fuse = new Fuse(jobs, fuseOptions);
            const searchResults = fuse.search(searchTerm);
            results = searchResults.map(result => result.item);
        }

        // Filter by Contract
        if (selectedContracts.length > 0) {
            results = results.filter(job => selectedContracts.includes(normalizeContract(job.contrat)));
        }

        setFilteredJobs(results);
        // Reset to page 1 on filter change
        setCurrentPage(1);

    }, [searchTerm, selectedContracts, jobs]);

    // 2. Pagination Calculation
    const totalItems = filteredJobs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

    const fetchFullJobDetails = async (job) => {
        // If job already has 'mission', we assume it's full details
        if (job.mission) {
            return job;
        }
        try {
            // Fetch validation and merging
            const fullJob = await jobsService.getJob(job.id);
            // Merge with existing job to keep any local state/props if needed, though usually full replace is fine
            return { ...job, ...fullJob };
        } catch (error) {
            console.error("Error fetching full job details:", error);
            return job; // Return partial as fallback
        }
    };

    const handleJobClick = async (job, action = 'interview') => {
        if (action === 'view') {
            setDetailJob(job); // Open immediately with lite data (Optimistic UI)
            setShowDetailModal(true);

            // Fetch full details in background
            const fullJob = await fetchFullJobDetails(job);
            setDetailJob(fullJob); // Update modal with full data

            // Also update the job in the main list so we don't fetch again
            setJobs(prevJobs => prevJobs.map(j => j.id === fullJob.id ? fullJob : j));
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

    const handleNewInterview = () => {
        navigate(`/home?section=interview&jobId=${selectedJob.id}&reset=true`);
        setShowModal(false);
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
            <>
                <div className="jobs-grid">
                    {currentJobs.map(job => {
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

                {/* Pagination Controls */}
                {!isLoading && filteredJobs.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
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

        </div>
    );
};

export default JobsTab;