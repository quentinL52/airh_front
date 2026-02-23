import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import EnterpriseLayout from '../components/dashboard/EnterpriseLayout';
import '../style/EnterpriseOffers.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EnterpriseInterviewDetailPage = () => {
    const { feedbackId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    const [detail, setDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                const token = await getToken();
                const response = await fetch(
                    `${API_BASE_URL}/enterprise/interviews/${feedbackId}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setDetail(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Erreur lors du chargement.');
                }
            } catch (err) {
                console.error('Error fetching interview detail:', err);
                setError('Erreur réseau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [feedbackId, getToken]);

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
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
                    <span>Chargement du détail...</span>
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

        if (!detail) return null;

        const fb = detail.entreprise_feedback || {};
        const dashboard = fb.dashboard || {};
        const qualitative = fb.qualitative_analysis || {};
        const decision = fb.decision || {};
        const fraud = fb.fraud_detection || {};
        const metrics = fb.metrics || {};

        return (
            <div className="enterprise-detail-container">
                {/* Header */}
                <div className="enterprise-content-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => navigate(-1)}
                            className="enterprise-back-btn"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h2 className="enterprise-section-title">
                                Détail de l'entretien — {detail.candidate_name || 'Candidat'}
                            </h2>
                            <p className="enterprise-section-subtitle">
                                {formatDate(detail.interview_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Correspondance profil */}
                {fb.correspondance_profil_offre && (
                    <div className="enterprise-detail-card">
                        <h3><i className="fas fa-user-check"></i> Correspondance profil / offre</h3>
                        <p>{fb.correspondance_profil_offre}</p>
                    </div>
                )}

                {/* Dashboard scores */}
                <div className="enterprise-detail-card">
                    <h3><i className="fas fa-chart-bar"></i> Scores</h3>
                    <div className="enterprise-scores-grid">
                        {[
                            { label: 'Technique', value: dashboard.technique },
                            { label: 'Cognitive', value: dashboard.cognitive },
                            { label: 'Comportementale', value: dashboard.comportementale },
                            { label: 'Score moyen', value: dashboard.average_score },
                        ].map(item => (
                            <div key={item.label} className="enterprise-score-item">
                                <div
                                    className="enterprise-score-circle"
                                    style={{ borderColor: getScoreColor(item.value) }}
                                >
                                    <span style={{ color: getScoreColor(item.value) }}>
                                        {item.value ?? '—'}
                                    </span>
                                </div>
                                <span className="enterprise-score-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                {Object.keys(metrics).length > 0 && (
                    <div className="enterprise-detail-card">
                        <h3><i className="fas fa-tachometer-alt"></i> Métriques</h3>
                        <div className="enterprise-metrics-grid">
                            {Object.entries(metrics).map(([key, value]) => (
                                <div key={key} className="enterprise-metric-item">
                                    <span className="enterprise-metric-label">
                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                                    </span>
                                    <div className="enterprise-metric-bar-container">
                                        <div
                                            className="enterprise-metric-bar"
                                            style={{ width: `${(value / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="enterprise-metric-value">{value}/10</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Qualitative analysis */}
                {(qualitative.rols_summary || qualitative.pcd_analysis) && (
                    <div className="enterprise-detail-card">
                        <h3><i className="fas fa-search"></i> Analyse qualitative</h3>
                        {qualitative.rols_summary && (
                            <div className="enterprise-detail-section">
                                <h4>Résumé ROLS</h4>
                                <p>{qualitative.rols_summary}</p>
                            </div>
                        )}
                        {qualitative.pcd_analysis && (
                            <div className="enterprise-detail-section">
                                <h4>Analyse PCD</h4>
                                <p>{qualitative.pcd_analysis}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Decision */}
                {decision.recommendation && (
                    <div className="enterprise-detail-card">
                        <h3><i className="fas fa-gavel"></i> Décision</h3>
                        <div className="enterprise-decision-badge" data-recommendation={decision.recommendation?.toLowerCase()}>
                            {decision.recommendation}
                        </div>
                        {decision.action_plan && (
                            <div className="enterprise-detail-section">
                                <h4>Plan d'action</h4>
                                <p>{decision.action_plan}</p>
                            </div>
                        )}
                        {decision.so_what && (
                            <div className="enterprise-detail-section">
                                <h4>Conclusion</h4>
                                <p>{decision.so_what}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Fraud detection */}
                {fraud.score_global !== undefined && (
                    <div className="enterprise-detail-card">
                        <h3>
                            <i className="fas fa-shield-alt"></i> Détection de fraude
                            {fraud.red_flag && (
                                <span className="enterprise-red-flag">🚩 Alerte</span>
                            )}
                        </h3>
                        <p>{fraud.resume}</p>
                        <div className="enterprise-fraud-scores">
                            <span>Score global : <strong>{fraud.score_global}/100</strong></span>
                            {fraud.details && (
                                <div className="enterprise-fraud-details">
                                    {Object.entries(fraud.details).map(([key, value]) => (
                                        <span key={key} className="enterprise-fraud-item">
                                            {key.replace(/_/g, ' ')}: {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Conversation */}
                {detail.conversation && detail.conversation.length > 0 && (
                    <div className="enterprise-detail-card">
                        <h3><i className="fas fa-comments"></i> Historique de conversation</h3>
                        <div className="enterprise-conversation">
                            {detail.conversation.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`enterprise-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
                                >
                                    <div className="enterprise-message-role">
                                        {msg.role === 'user' ? 'Candidat' : 'IA'}
                                    </div>
                                    <div className="enterprise-message-content">
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default EnterpriseInterviewDetailPage;
