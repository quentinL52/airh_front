import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import '../../style/SubscriptionTab.css';

const SubscriptionTab = () => {
    return (
        <div className="subscription-tab">
            <div className="subscription-header">
                <h2>Abonnements</h2>
                <p>Choisissez la formule qui correspond à vos besoins</p>
            </div>

            <div className="pricing-table-wrapper">
                <PricingTable />
            </div>
        </div>
    );
};

export default SubscriptionTab;
