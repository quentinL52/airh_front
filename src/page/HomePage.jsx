import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import Layout from '../components/tabs/Layout';
import ResumeTab from '../components/tabs/ResumeTab';
import JobsTab from '../components/tabs/JobsTab';
import InterviewTab from '../components/tabs/InterviewTab';
import FeedbacksTab from '../components/tabs/FeedbacksTab';
import SubscriptionTab from '../components/tabs/SubscriptionTab';

import OnboardingPopup from '../components/dashboard/OnboardingPopup';
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
    const resetParam = searchParams.get('reset') === 'true';

    // Derive activeSection directly from URL — single source of truth, no double render
    const activeSection = sectionParam || 'home';

    const needsOnboarding = user && !user.unsafeMetadata?.onboarded;
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(needsOnboarding);

    useEffect(() => {
        setIsOnboardingVisible(user && !user.unsafeMetadata?.onboarded);
    }, [user?.unsafeMetadata?.onboarded]);
    const [cvData, setCvData] = useState(null);
    const [isLoadingCv, setIsLoadingCv] = useState(true);
    const { getToken } = useAuth();
    const userName = user?.firstName || user?.username || 'Candidat';

    const fetchCvData = async (userId) => {
        setIsLoadingCv(true);
        try {
            const token = await getToken();
            const data = await resumeService.getResumeData(userId, token);
            setCvData(data?.parsed_data?.recommandations || null);
        } catch (error) {
            console.error("Erreur chargement CV:", error);
            setCvData(null);
        } finally {
            setIsLoadingCv(false);
        }
    };

    const cvFetchedRef = useRef(false);

    useEffect(() => {
        if (user?.id && !cvFetchedRef.current) {
            cvFetchedRef.current = true;
            fetchCvData(user.id);
        }
    }, [user?.id]);

    const handleSectionChange = (section) => {
        setSearchParams({ section });
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'home':
                return (
                    <div className="home-dashboard">
                        <DashboardHeader userName={userName} />
                        <GettingStarted onStepClick={handleSectionChange} />
                        <Support user={user} cvData={cvData} />
                        {isOnboardingVisible && (
                            <OnboardingPopup onClose={() => setIsOnboardingVisible(false)} />
                        )}
                    </div>
                );
            case 'resume':
                return (
                    <ResumeTab
                        user={user}
                        cvData={cvData}
                        isLoading={isLoadingCv}
                        onRefresh={() => {
                            cvFetchedRef.current = false;
                            fetchCvData(user.id);
                        }}
                    />
                );
            case 'jobs':
                return <JobsTab />;
            case 'interview':
                return <InterviewTab jobId={jobIdParam} reset={resetParam} />;
            case 'feedbacks':
                return <FeedbacksTab />;
            case 'abonnement':
                return <SubscriptionTab />;
            default:
                return (
                    <div className="home-dashboard">
                        <DashboardHeader userName={userName} />
                        <GettingStarted onStepClick={handleSectionChange} />
                        <Support user={user} cvData={cvData} />
                        {isOnboardingVisible && (
                            <OnboardingPopup onClose={() => setIsOnboardingVisible(false)} />
                        )}
                    </div>
                );
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