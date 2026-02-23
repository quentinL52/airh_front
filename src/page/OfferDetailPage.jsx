import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import EnterpriseLayout from '../components/dashboard/EnterpriseLayout';
import { useUser } from '@clerk/clerk-react';
import '../style/EnterpriseOffers.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OfferDetailPage = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setIsLoading(true);
                const token = await getToken();
                const response = await fetch(
                    `${API_BASE_URL}/enterprise/offers/${offerId}/interviews`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setInterviews(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Erreur lors du chargement.');
                }
            } catch (err) {
                console.error('Error fetching interviews:', err);
                setError('Erreur réseau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviews();
    }, [offerId, getToken]);

    const sortedInterviews = [...interviews].sort((a, b) => {
        const scoreA = a.score ?? -1;
        const scoreB = b.score ?? -1;
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const handleInterviewClick = (feedbackId) => {
        navigate(`/enterprise/interviews/${feedbackId}`);
    };

    const getScoreColor = (score) => {
        if (score === null || score === undefined) return '#94a3b8';
        if (score >= 70) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="enterprise-offers-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Chargement des entretiens...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="enterprise-offers-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                </div>
            );
        }

        return (
            <div className="enterprise-offers-container">
                <div className="enterprise-content-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/enterprise/dashboard?section=my-offers')}
                            className="enterprise-back-btn"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h2 className="enterprise-section-title">Entretiens pour cette offre</h2>
                            <p className="enterprise-section-subtitle">
                                {interviews.length} entretien{interviews.length !== 1 ? 's' : ''} réalisé{interviews.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    {interviews.length > 1 && (
                        <button onClick={toggleSort} className="enterprise-sort-btn">
                            <i className={`fas fa-sort-amount-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
                            Trier par score ({sortOrder === 'desc' ? '↓' : '↑'})
                        </button>
                    )}
                </div>

                {interviews.length === 0 ? (
                    <div className="enterprise-offers-empty">
                        <i className="fas fa-comment-slash"></i>
                        <p>Aucun entretien réalisé pour cette offre.</p>
                    </div>
                ) : (
                    <div className="enterprise-offers-list">
                        {sortedInterviews.map(interview => (
                            <div
                                key={interview.feedback_id}
                                className="enterprise-interview-row"
                                onClick={() => handleInterviewClick(interview.feedback_id)}
                            >
                                <div className="enterprise-interview-row-main">
                                    <div
                                        className="enterprise-interview-score-badge"
                                        style={{ backgroundColor: getScoreColor(interview.score) }}
                                    >
                                        {interview.score !== null && interview.score !== undefined
                                            ? Math.round(interview.score)
                                            : '—'}
                                    </div>
                                    <div className="enterprise-interview-info">
                                        <h3 className="enterprise-interview-name">
                                            {interview.candidate_name || 'Candidat'}
                                        </h3>
                                        <span className="enterprise-interview-date">
                                            {formatDate(interview.interview_date)}
                                        </span>
                                    </div>
                                </div>
                                <div className="enterprise-interview-row-meta">
                                    <span className="enterprise-interview-score-label">
                                        Score : {interview.score !== null && interview.score !== undefined
                                            ? `${Math.round(interview.score)}/100`
                                            : 'N/A'}
                                    </span>
                                    <div className="enterprise-offer-arrow">
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <EnterpriseLayout
            activeSection="my-offers"
            onSectionChange={(section) => navigate(`/enterprise/dashboard?section=${section}`)}
            user={user}
        >
            {renderContent()}
        </EnterpriseLayout>
    );
};

export default OfferDetailPage;
