import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Layout from '../components/tabs/Layout';
import ResumeTab from '../components/tabs/ResumeTab';
import JobsTab from '../components/tabs/JobsTab';
import InterviewTab from '../components/tabs/InterviewTab';
import FeedbacksTab from '../components/tabs/FeedbacksTab';

import WelcomeAlert from '../components/dashboard/WelcomeAlert';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import GettingStarted from '../components/dashboard/GettingStarted';
import Support from '../components/dashboard/Support';
import { resumeService } from '../services/resumeService';
import { useAuth } from '@clerk/clerk-react';

import '../style/HomePage.css';

const HomePage = ({ user }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');
    const jobIdParam = searchParams.get('jobId');

    const [activeSection, setActiveSection] = useState(sectionParam || 'home');
    const [isAlertVisible, setAlertVisible] = useState(true);
    const [cvData, setCvData] = useState(null);
    const [isLoadingCv, setIsLoadingCv] = useState(true);
    const { getToken } = useAuth();
    const userName = user?.firstName || user?.username || 'Candidat';

    // Sync activeSection with URL search params (e.g. when navigating from JobsTab)
    useEffect(() => {
        setActiveSection(sectionParam || 'home');
    }, [sectionParam]);

    const fetchCvData = async (userId) => {
        setIsLoadingCv(true);
        try {
            const token = await getToken();
            const data = await resumeService.getResumeData(userId, token);
            setCvData(data?.parsed_data?.candidat || null);
        } catch (error) {
            console.error("Erreur chargement CV:", error);
            setCvData(null);
        } finally {
            setIsLoadingCv(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchCvData(user.id);
        }
    }, [user]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setSearchParams({ section });
    };

    const HomeContent = () => (
        <div className="home-dashboard">
            <DashboardHeader userName={userName} />
            <GettingStarted onStepClick={handleSectionChange} />
            <Support user={user} cvData={cvData} />
            {isAlertVisible && (
                <WelcomeAlert userName={userName} onClose={() => setAlertVisible(false)} />
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'home':
                return <HomeContent />;
            case 'resume':
                return (
                    <ResumeTab
                        user={user}
                        cvData={cvData}
                        isLoading={isLoadingCv}
                        onRefresh={() => fetchCvData(user.id)}
                    />
                );
            case 'jobs':
                return <JobsTab />;
            case 'interview':
                return <InterviewTab jobId={jobIdParam} />;
            case 'feedbacks':
                return <FeedbacksTab />;
            default:
                return <HomeContent />;
        }
    };

    return (
        <Layout
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
        >
            {renderContent()}
        </Layout>
    );
};

export default HomePage;