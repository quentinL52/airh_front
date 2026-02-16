import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

import EnterpriseLayout from '../components/dashboard/EnterpriseLayout';
import AddOfferTab from '../components/tabs/enterprise/AddOfferTab';
import MyOffersTab from '../components/tabs/enterprise/MyOffersTab';
import CompanyProfileTab from '../components/tabs/enterprise/CompanyProfileTab';

const EnterpriseDashboardPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');
    const { user, isLoaded, isSignedIn } = useUser();

    const [activeSection, setActiveSection] = useState(sectionParam || 'add-offer');

    useEffect(() => {
        if (sectionParam) {
            setActiveSection(sectionParam);
        }
    }, [sectionParam]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setSearchParams({ section });
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'add-offer':
                return <AddOfferTab />;
            case 'my-offers':
                return <MyOffersTab />;
            case 'profile':
                return <CompanyProfileTab user={user} />;
            default:
                return <AddOfferTab />;
        }
    };

    if (!isLoaded || !isSignedIn) {
        return <div>Chargement...</div>;
    }

    return (
        <EnterpriseLayout
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            user={user}
        >
            {renderContent()}
        </EnterpriseLayout>
    );
};

export default EnterpriseDashboardPage;
