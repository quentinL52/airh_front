import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import '../style/EnterpriseLanding.css';
import { SignIn } from "@clerk/clerk-react";


<SignIn
    appearance={{
        elements: {
            socialButtonsBlockButton: "hidden", // Cache Google, GitHub, LinkedIn
            dividerRow: "hidden",               // Cache le séparateur "ou"
        }
    }}
/>
const EnterpriseLanding = () => {
    const [formData, setFormData] = useState({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        company_size: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${apiBaseUrl}/enterprise/lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    company_name: '',
                    contact_name: '',
                    email: '',
                    phone: '',
                    company_size: '',
                    message: ''
                });
            } else {
                const errorData = await response.json();
                console.error('Error submitting lead:', errorData);
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="enterprise-landing">
            <Navbar isEnterprise={true} />

            <main className="enterprise-hero">
                <div className="enterprise-hero-content">
                    <h1 className="hero-title">Optimisez vos recrutements Tech avec l'IA</h1>
                    <p className="hero-description">
                        Recrutez les meilleurs talents grâce à nos outils de parsing de CV intelligent
                        et notre simulateur d'entretien assisté par IA.
                        Solicitez une démo pour en savoir plus.
                    </p>

                    <div className="lead-form-container">
                        <h2>Demander une démo</h2>
                        <form onSubmit={handleSubmit} className="enterprise-lead-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nom de l'entreprise</label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: AIRH Tech"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom du contact</label>
                                    <input
                                        type="text"
                                        name="contact_name"
                                        value={formData.contact_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email professionnel</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="contact@entreprise.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="01 23 45 67 89"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Taille de l'entreprise</label>
                                    <select name="company_size" value={formData.company_size} onChange={handleChange} required>
                                        <option value="">Sélectionnez une taille</option>
                                        <option value="1-10">1-10 employés</option>
                                        <option value="11-50">11-50 employés</option>
                                        <option value="51-200">51-200 employés</option>
                                        <option value="201-500">201-500 employés</option>
                                        <option value="500+">500+ employés</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Comment pouvons-nous vous aider ?</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Parlez-nous de vos besoins en recrutement..."
                                    ></textarea>
                                </div>
                            </div>

                            <button type="submit" className="cta-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                            </button>

                            {submitStatus === 'success' && (
                                <p className="success-msg">Merci ! Notre équipe vous contactera prochainement.</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="error-msg">Une erreur est survenue. Veuillez réessayer.</p>
                            )}
                        </form>
                    </div>
                </div>
            </main>

            <section className="enterprise-features">
                <div className="container">
                    <h2 className="section-title">Pourquoi choisir AIrh ?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <i className="fas fa-file-invoice"></i>
                            <h3>Parsing Intelligent</h3>
                            <p>Extrayez automatiquement les compétences, expériences et diplômes de milliers de CV en quelques secondes.</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-robot"></i>
                            <h3>Validation par l'IA</h3>
                            <p>Vérifiez la pertinence des candidats par rapport à vos fiches de poste grâce à notre moteur d'analyse.</p>
                        </div>
                        <div className="feature-card">
                            <i className="fas fa-comments"></i>
                            <h3>Simulateur d'Entretien</h3>
                            <p>Préparez vos recruteurs ou testez vos candidats avec des scénarios d'entretien ultra-réalistes.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EnterpriseLanding;
