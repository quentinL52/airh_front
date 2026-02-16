import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FeedbackDetailModal = ({ feedback, onClose }) => {
    if (!feedback) return null;

    const { job_title, company, interview_date, feedback_content, conversation } = feedback;
    const candidateFeedback = feedback_content?.candidat || {};

    // Safety check for candidate feedback sections
    const pointsForts = candidateFeedback.points_forts || [];
    const pointsAmeliorer = candidateFeedback.points_a_ameliorer || [];
    const conseils = candidateFeedback.conseils_apprentissage || [];
    const feedbackGlobal = candidateFeedback.feedback_constructif || "";
    const score = candidateFeedback.score_global;

    const dateStr = interview_date
        ? format(new Date(interview_date), 'd MMMM yyyy', { locale: fr })
        : 'Date inconnue';

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal-content" onClick={e => e.stopPropagation()}>
                <button className="detail-close-btn" onClick={onClose}>&times;</button>

                <div className="detail-header">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2>{job_title}</h2>
                            <p className="detail-subtitle">{company} • {dateStr}</p>
                        </div>
                        {score !== undefined && (
                            <div className="text-center bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
                                <span className="block text-2xl font-bold text-indigo-600">{score}/100</span>
                                <span className="text-xs text-indigo-400 font-medium">Score Global</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="detail-scroll-container">
                    <div className="detail-body">

                        {/* Summary / Constructive Feedback */}
                        {feedbackGlobal && (
                            <div className="detail-section">
                                <h3>Synthèse</h3>
                                <p className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-gray-600">
                                    "{feedbackGlobal}"
                                </p>
                            </div>
                        )}

                        {/* Points Forts */}
                        {pointsForts.length > 0 && (
                            <div className="detail-section">
                                <h3 className="text-green-600 border-green-200">Points Forts</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    {pointsForts.map((pt, idx) => (
                                        <li key={idx}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Points à Améliorer */}
                        {pointsAmeliorer.length > 0 && (
                            <div className="detail-section">
                                <h3 className="text-amber-600 border-amber-200">Axes d'Amélioration</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    {pointsAmeliorer.map((pt, idx) => (
                                        <li key={idx}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Conseils d'apprentissage */}
                        {conseils.length > 0 && (
                            <div className="detail-section">
                                <h3 className="text-blue-600 border-blue-200">Conseils & Ressources</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    {conseils.map((pt, idx) => (
                                        <li key={idx}>{pt}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                    <div className="h-16"></div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDetailModal;
