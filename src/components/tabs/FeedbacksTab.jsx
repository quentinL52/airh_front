import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { feedbackService } from '../../services/feedbackService';
import FeedbackCard from './FeedbackCard';
import FeedbackDetailModal from './FeedbackDetailModal';
import '../../style/JobsTab.css'; // Reuse Job styles for grid and cards

const FeedbacksTab = () => {
    const { getToken } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const token = await getToken();
                const data = await feedbackService.getMyFeedbacks(token);
                setFeedbacks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const handleViewDetails = async (feedbackId) => {
        setLoadingDetail(true);
        try {
            const token = await getToken();
            const detail = await feedbackService.getFeedbackById(feedbackId, token);
            setSelectedFeedback(detail);
            setShowDetailModal(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedFeedback(null);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            );
        }

        if (error) {
            return <div className="jobs-error text-red-600">{error}</div>;
        }

        if (feedbacks.length === 0) {
            return (
                <div className="jobs-error">
                    <p className="text-xl mb-2">Aucun feedback disponible pour le moment.</p>
                    <p>Passez un entretien pour recevoir votre premier feedback !</p>
                </div>
            );
        }

        return (
            <div className="jobs-grid">
                {feedbacks.map((feedback) => (
                    <FeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        onViewDetails={() => handleViewDetails(feedback.id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="tab-content">
            <div className="content-header mb-8">
                <p className="section-subtitle">Retrouvez ici vos analyses de performance et conseils personnalisés.</p>
            </div>

            {renderContent()}

            {/* Global Loader for when fetching details (optional overlay, or just quick load) */}
            {loadingDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedFeedback && (
                <FeedbackDetailModal
                    feedback={selectedFeedback}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default FeedbacksTab;
