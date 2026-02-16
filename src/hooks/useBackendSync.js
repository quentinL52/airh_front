import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useBackendSync = () => {
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isSignedIn && user) {
                try {
                    const token = await getToken();
                    if (!token) return;

                    const response = await fetch(`${API_BASE_URL}/auth/sync`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // const data = await response.json();
                        // Optional: Store backend user ID in context
                    } else {
                        console.error('Failed to sync user:', await response.text());
                    }
                } catch (error) {
                    console.error('Error syncing user:', error);
                }
            }
        };

        syncUser();
    }, [isSignedIn, user, getToken]);
};
