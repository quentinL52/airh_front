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
    const { user, isLoaded } = useUser();
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
        // Wait until Clerk user object is fully loaded
        if (!isLoaded) return;

        if (!isSignedIn) {
            setSyncDone(false);
            setEnterpriseRejected(false);
            syncedRef.current = false;
            return;
        }

        if (!user || syncedRef.current) return;

        let isMounted = true;
        let attempt = 0;
        const maxAttempts = 6;
        const delayMs = 3000; // 3 seconds between retries, giving Supabase/Clerk time

        const attemptSync = async () => {
            if (!isMounted) return;
            try {
                const token = await getTokenRef.current();
                if (!token) {
                    if (isMounted) {
                        syncedRef.current = true;
                        setSyncDone(true);
                    }
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/auth/sync`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    if (isMounted) {
                        syncedRef.current = true;
                        setSyncDone(true);
                    }
                } else if (response.status === 403) {
                    const isEnterprise = user?.publicMetadata?.profil === 'entreprise';
                    if (isEnterprise) {
                        console.warn('Enterprise access denied: user not registered in company_users');
                        if (isMounted) setEnterpriseRejected(true);
                        await signOutRef.current();
                    } else {
                        // Pour les candidats, un 403 ne doit pas provoquer une déconnexion
                        console.warn('Sync 403 for candidate user, proceeding without sign-out');
                        if (isMounted) {
                            syncedRef.current = true;
                            setSyncDone(true);
                        }
                    }
                } else if (response.status >= 500 || response.status === 404) {
                    attempt++;
                    if (attempt < maxAttempts) {
                        console.warn(`Backend sync waiting for Supabase (attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`);
                        setTimeout(attemptSync, delayMs);
                    } else {
                        console.error('Failed to sync user after max attempts:', await response.text());
                        if (isMounted) {
                            syncedRef.current = true;
                            setSyncDone(true);
                        }
                    }
                } else {
                    console.error('Failed to sync user:', await response.text());
                    if (isMounted) {
                        syncedRef.current = true;
                        setSyncDone(true);
                    }
                }
            } catch (error) {
                attempt++;
                if (attempt < maxAttempts) {
                    console.warn(`Error resolving sync, retrying in ${delayMs}ms...`, error);
                    setTimeout(attemptSync, delayMs);
                } else {
                    console.error('Error syncing user:', error);
                    if (isMounted) {
                        syncedRef.current = true;
                        setSyncDone(true);
                    }
                }
            }
        };

        attemptSync();

        return () => {
            isMounted = false;
        };
    }, [isSignedIn, user, isLoaded]); // Only re-run when auth state, user, or loading state changes

    return { syncDone, enterpriseRejected };
};
