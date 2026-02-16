import React, { useState } from 'react';
import { SignOutButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/AIrh_logo.png';
import '../../style/EnterpriseLayout.css'; // Independent styles

const EnterpriseLayout = ({ children, activeSection, onSectionChange, user }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        {
            section: 'main',
            title: 'GESTION',
            items: [
                { id: 'add-offer', label: 'Ajouter une offre', icon: 'fas fa-plus-circle' },
                { id: 'my-offers', label: 'Mes offres', icon: 'fas fa-list-alt' },
                { id: 'profile', label: 'Profil Entreprise', icon: 'fas fa-building' }
            ]
        }
    ];

    return (
        <div className="enterprise-layout">
            <div className="enterprise-sidebar">
                <div className="enterprise-sidebar-header">
                    <div className="enterprise-app-logo">
                        <img src={logoImg} alt="AIrh Logo" className="logo-icon" />
                    </div>
                    <div className="enterprise-workspace-title">Espace Entreprise</div>
                </div>
                <nav className="enterprise-sidebar-nav">
                    {menuItems.map((section) => (
                        <div key={section.section} className="enterprise-nav-section">
                            {section.title && (
                                <div className="enterprise-section-title">{section.title}</div>
                            )}
                            {section.items.map((item) => (
                                <button
                                    key={item.id}
                                    className={`enterprise-nav-item ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={() => onSectionChange(item.id)}
                                >
                                    <i className={item.icon}></i>
                                    <span className="enterprise-nav-label">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="enterprise-sidebar-footer">
                    <div className="enterprise-user-profile">
                        {user?.imageUrl ? (
                            <img src={user.imageUrl} alt="Profile" className="user-avatar-img" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <div className="user-avatar" style={{ width: 32, height: 32, backgroundColor: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{user?.initials || 'E'}</div>
                        )}
                        <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
                            <div className="user-name" style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || user?.name || 'Entreprise'}</div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button
                                className="user-menu-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <i className="fas fa-ellipsis-v"></i>
                            </button>
                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    marginBottom: '0.5rem',
                                    overflow: 'hidden'
                                }}>
                                    <SignOutButton redirectUrl="/">
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: 'none',
                                                background: 'none',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                color: '#374151',
                                                fontSize: '0.875rem',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
                                            Se déconnecter
                                        </button>
                                    </SignOutButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="enterprise-main-content">
                <div className="enterprise-content-wrapper">
                    {children}
                </div>
            </div>
            {showUserMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </div>
    );
};

export default EnterpriseLayout;
