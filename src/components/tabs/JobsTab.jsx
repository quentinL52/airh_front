import React, { useState, useEffect } from 'react';
import { jobsService } from '../../services/jobService';
import JobCard from './JobCard'; 
import Fuse from 'fuse.js'; 
import '../../style/JobsTab.css'; 

const JobsTab = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 
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

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobsData = await jobsService.getJobs();
                setJobs(jobsData);
                setFilteredJobs(jobsData);
                fuse = new Fuse(jobsData, fuseOptions); 
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadJobs();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setFilteredJobs(jobs);
        } else {
            const results = fuse.search(value);
            setFilteredJobs(results.map(result => result.item));
        }
    };

    const renderContent = () => {
        if (filteredJobs.length === 0 && searchTerm) {
            return <div className="jobs-error">Aucune offre ne correspond à votre recherche.</div>;
        }
        if (filteredJobs.length === 0) {
            return <div className="jobs-error">Aucune offre d'emploi disponible pour le moment.</div>;
        }
        return (
            <div className="jobs-grid">
                {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        );
    };

    return (
        <div className="tab-content">
            <div className="content-header">
                <p className="section-subtitle">Découvrez les opportunités et lancez votre entretien.</p>
                <input
                    type="text"
                    className="job-search-bar"
                    placeholder="Rechercher par poste, entreprise, ou mots-clés..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {renderContent()}
        </div>
    );
};

export default JobsTab;