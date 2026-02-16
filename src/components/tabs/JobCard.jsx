// src/components/tabs/JobCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, isActive, feedback, onStart, onViewFeedback }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Always open Job Details on card click
        if (onStart) {
            onStart(job, 'view');
        }
    };

    return (
        <div
            className="job-card"
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={handleCardClick}
        >
            {/* Status Badges */}
            {feedback ? (
                <div className="completed-badge">Terminé</div>
            ) : isActive ? (
                <div className="active-badge">En cours</div>
            ) : null}

            <h3 className="job-title" title={job.poste}>{job.poste}</h3>

            <div className="job-company">{job.entreprise}</div>

            <div className="job-spacer"></div>

            <div className="job-badges">
                <span className="job-badge">{job.ville}</span>
                <span className="job-badge">{job.contrat}</span>
            </div>

            <div className="job-date">{job.publication}</div>

        </div>
    );
};

export default JobCard;