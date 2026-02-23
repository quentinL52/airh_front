import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import '../../../style/EnterpriseOffers.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyOffersTab = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOffers = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/enterprise/offers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOffers(data);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Erreur lors du chargement des offres.');
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Erreur réseau. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const handleOfferClick = (offerId) => {
        navigate(`/enterprise/offers/${offerId}`);
    };

    if (isLoading) {
        return (
            <div className="enterprise-offers-container">
                <div className="enterprise-content-header">
                    <h2 className="enterprise-section-title">Mes offres</h2>
                </div>
                <div className="enterprise-offers-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Chargement des offres...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="enterprise-offers-container">
                <div className="enterprise-content-header">
                    <h2 className="enterprise-section-title">Mes offres</h2>
                </div>
                <div className="enterprise-offers-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                    <button onClick={fetchOffers} className="enterprise-btn-retry">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="enterprise-offers-container">
            <div className="enterprise-content-header">
                <h2 className="enterprise-section-title">Mes offres</h2>
                <p className="enterprise-section-subtitle">
                    {offers.length > 0
                        ? `${offers.length} offre${offers.length > 1 ? 's' : ''} publiée${offers.length > 1 ? 's' : ''}`
                        : 'Aucune offre publiée pour le moment.'}
                </p>
            </div>

            {offers.length === 0 ? (
                <div className="enterprise-offers-empty">
                    <i className="fas fa-briefcase"></i>
                    <p>Vous n'avez pas encore publié d'offres.</p>
                    <p className="enterprise-offers-empty-hint">
                        Ajoutez votre première offre depuis l'onglet "Ajouter une offre".
                    </p>
                </div>
            ) : (
                <div className="enterprise-offers-list">
                    {offers.map(offer => (
                        <div
                            key={offer.id}
                            className="enterprise-offer-row"
                            onClick={() => handleOfferClick(offer.id)}
                        >
                            <div className="enterprise-offer-row-main">
                                <div className="enterprise-offer-icon">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                <div className="enterprise-offer-info">
                                    <h3 className="enterprise-offer-title">{offer.poste}</h3>
                                    <span className="enterprise-offer-company">{offer.entreprise}</span>
                                </div>
                            </div>
                            <div className="enterprise-offer-row-meta">
                                <div className="enterprise-offer-date">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>{formatDate(offer.created_at)}</span>
                                </div>
                                <div className="enterprise-offer-interviews">
                                    <i className="fas fa-users"></i>
                                    <span>{offer.interview_count} entretien{offer.interview_count !== 1 ? 's' : ''}</span>
                                </div>
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

export default MyOffersTab;
