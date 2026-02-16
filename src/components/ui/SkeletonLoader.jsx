import React from 'react';
import '../../style/ResumeTab.css'; // Reusing ResumeTab css for now or create new one

const SkeletonLoader = ({ type = 'text', count = 1, style = {}, className = '' }) => {
    // Array to render multiple skeletons if needed
    const skeletons = Array(count).fill(0);

    return (
        <>
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className={`skeleton skeleton-${type} ${className}`}
                    style={style}
                />
            ))}
        </>
    );
};

export const ResumeSkeleton = () => {
    return (
        <div className="resume-skeleton-container">
            {/* Header / Info Perso */}
            <div className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-body">
                    <SkeletonLoader type="text" count={3} style={{ marginBottom: '0.5rem' }} />
                </div>
            </div>

            {/* Skills */}
            <div className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-body">
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <SkeletonLoader type="badge" count={5} />
                    </div>
                </div>
            </div>

            {/* Expérience */}
            <div className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-body">
                    <SkeletonLoader type="block" count={2} style={{ height: '80px', marginBottom: '1rem' }} />
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
