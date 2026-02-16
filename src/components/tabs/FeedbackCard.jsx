import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FeedbackCard = ({ feedback, onViewDetails }) => {
    // Format date nicely
    const dateStr = feedback.interview_date
        ? format(new Date(feedback.interview_date), 'd MMMM yyyy', { locale: fr })
        : 'Date inconnue';

    // Score display (if available) - Assuming feedback has compatibility_score from backend
    const score = feedback.compatibility_score !== undefined
        ? Math.round(feedback.compatibility_score * 100)
        : null;

    return (
        <div
            className="job-card feedback-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onViewDetails(feedback.id)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="job-title" title={feedback.job_title}>
                    {feedback.job_title}
                </h3>
                {score !== null && (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${score >= 70 ? 'bg-green-100 text-green-800' :
                            score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {score}%
                    </span>
                )}
            </div>

            <div className="job-company">{feedback.company || "Entreprise inconnue"}</div>

            <div className="job-spacer"></div>

            <div className="job-date text-sm text-gray-500 mt-4">
                Passé le {dateStr}
            </div>
        </div>
    );
};

export default FeedbackCard;
