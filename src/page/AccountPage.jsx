import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/tabs/Layout';
import '../style/AccountPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AccountPage = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form State - Only First Name
    const [firstName, setFirstName] = useState('');

    // Credit State
    const [creditData, setCreditData] = useState(null);

    useEffect(() => {
        if (isLoaded && user) {
            setFirstName(user.firstName || '');
        }
    }, [isLoaded, user]);

    useEffect(() => {
        const fetchCredits = async () => {
            if (!isLoaded || !user) return;
            try {
                const token = await getToken();
                if (!token) return;
                const response = await fetch(`${API_BASE_URL}/auth/validate`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCreditData(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch credits:", err);
            }
        };
        fetchCredits();
    }, [isLoaded, user, getToken]);

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        try {
            const updateParams = {};
            const currentFirst = user.firstName || '';
            const newFirst = firstName.trim();

            if (currentFirst !== newFirst) {
                updateParams.firstName = newFirst === '' ? null : newFirst;
            }

            if (Object.keys(updateParams).length > 0) {
                await user.update(updateParams);
                alert("Prénom mis à jour avec succès !");
            } else {
                // No changes
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            let errorMessage = "Une erreur est survenue lors de la mise à jour.";

            if (error.errors && error.errors.length > 0) {
                const firstError = error.errors[0];
                errorMessage = `${firstError.message} ${firstError.longMessage ? `(${firstError.longMessage})` : ''}`;
            }
            alert(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous ABSOLUMENT sûr ? Cette action est irréversible.")) {
            return;
        }

        setIsDeleting(true);

        try {
            const token = await getToken();
            if (!token) {
                alert("Session expirée. Veuillez vous reconnecter.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok || response.status === 204) {
                await signOut();
                navigate('/');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Delete failed", response.status, errorData);
                alert(`Erreur lors de la suppression: ${errorData.message || "Erreur inconnue"}`);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Une erreur est survenue lors de la communication avec le serveur.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isLoaded) {
        return (
            <Layout user={user} activeSection="account">
                <div className="account-page-container">
                    <p>Chargement...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout user={user} activeSection="account" onSectionChange={(section) => navigate(section === 'home' ? '/home' : `/home?section=${section}`)}>
            <div className="account-page-container">
                <div className="account-page-header">
                    <h1 className="account-page-title">Mon Compte</h1>
                    <p className="account-page-subtitle">Gérez vos informations personnelles</p>
                </div>

                <div className="user-info-card">
                    <img
                        src={user?.imageUrl}
                        alt="Profile"
                        className="user-avatar-large"
                    />
                    <div className="user-details">
                        <span className="user-name-large">{user?.firstName || user?.fullName || 'Utilisateur'}</span>
                        <span className="user-email-large">{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                </div>

                <div className="account-section">
                    <h2 className="section-title">Informations Personnelles</h2>
                    <div className="form-group">
                        <label>Prénom</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-input"
                            placeholder="Votre prénom"
                        />
                    </div>

                    <div className="action-buttons-profile">
                        <button
                            className="btn-primary"
                            onClick={handleUpdateProfile}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                    Mise à jour...
                                </>
                            ) : (
                                "Enregistrer"
                            )}
                        </button>
                    </div>
                </div>

                {/* Subscriptions & Credits Section (Read-Only) */}
                <div className="account-section">
                    <h2 className="section-title">Abonnement & Crédits</h2>
                    <div className="credits-display-grid">
                        <div className="credit-item">
                            <span className="credit-label">Formule :</span>
                            <span className="credit-value">{creditData?.subscription_plan || 'Gratuite'}</span>
                        </div>
                        <div className="credit-item">
                            <span className="credit-label">Entretiens restants :</span>
                            <span className="credit-value">{creditData ? creditData.interview_credits : '...'}</span>
                        </div>
                        <div className="credit-item">
                            <span className="credit-label">Analyses de CV restantes :</span>
                            <span className="credit-value">{creditData ? creditData.cv_credits : '...'}</span>
                        </div>
                    </div>
                </div>


                <div className="danger-zone">
                    <h2 className="danger-zone-title">Zone de danger</h2>
                    <div className="warning-box">
                        <div className="warning-title">
                            <i className="fas fa-exclamation-triangle warning-icon"></i>
                            Suppression du compte
                        </div>
                        <p className="warning-text">
                            En supprimant votre compte, vous perdrez définitivement l'accès à toutes vos données,
                            y compris vos historiques d'entretiens, vos CVs analysés et vos paramètres personnels.
                            Cette action ne peut pas être annulée.
                        </p>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn-delete-confirm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                    Suppression...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-trash-alt" style={{ marginRight: '0.5rem' }}></i>
                                    Supprimer mon compte définitivement
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AccountPage;
