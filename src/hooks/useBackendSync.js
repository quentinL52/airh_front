import { useEffect, useState, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Sync Clerk user with backend.
 * Returns { syncDone, enterpriseRejected } so ProtectedRoute
 * can gate enterprise pages until verification completes.
 */
export const useBackendSync = () => {
    const { getToken, isSignedIn, signOut } = useAuth();
    const { user } = useUser();
    const [syncDone, setSyncDone] = useState(false);
    const [enterpriseRejected, setEnterpriseRejected] = useState(false);

    // Stable refs to avoid re-triggering the effect when Clerk functions change reference
    const signOutRef = useRef(signOut);
    const getTokenRef = useRef(getToken);
    signOutRef.current = signOut;
    getTokenRef.current = getToken;

    // Track if we already synced for this user to avoid duplicate calls
    const syncedRef = useRef(false);

    useEffect(() => {
        if (!isSignedIn) {
            setSyncDone(false);
            setEnterpriseRejected(false);
            syncedRef.current = false;
            return;
        }

        if (!user || syncedRef.current) return;

        const syncUser = async () => {
            try {
                const token = await getTokenRef.current();
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/auth/sync`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    syncedRef.current = true;
                    setSyncDone(true);
                } else if (response.status === 403) {
                    const isEnterprise = user?.publicMetadata?.profil === 'entreprise';
                    if (isEnterprise) {
                        console.warn('Enterprise access denied: user not registered in company_users');
                        setEnterpriseRejected(true);
                        await signOutRef.current();
                    } else {
                        // Pour les candidats, un 403 ne doit pas provoquer une déconnexion
                        console.warn('Sync 403 for candidate user, proceeding without sign-out');
                        syncedRef.current = true;
                        setSyncDone(true);
                    }
                } else {
                    console.error('Failed to sync user:', await response.text());
                    syncedRef.current = true;
                    setSyncDone(true);
                }
            } catch (error) {
                console.error('Error syncing user:', error);
                syncedRef.current = true;
                setSyncDone(true);
            }
        };

        syncUser();
    }, [isSignedIn, user]); // Only re-run when auth state or user changes

    return { syncDone, enterpriseRejected };
};
