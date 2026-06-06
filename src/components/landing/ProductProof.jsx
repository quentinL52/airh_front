import React from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';

function ProductProof() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const handleCtaClick = () => {
    if (isSignedIn) {
      window.location.href = '/home';
    } else {
      openSignIn();
    }
  };

  return (
    <section className="product-proof-section">
      <div className="proof-container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap-reverse', padding: '0 1rem' }}>
        
        {/* Partie gauche : Illustration */}
        <div className="proof-visual" style={{ flex: '1 1 500px', width: '100%' }}>
          <div className="cv-mockup-container" style={{ margin: '0 auto' }}>
            <div className="cv-mockup-header">
              <div className="cv-mockup-title">
                <h3>Analyse de CV : Développeur React</h3>
                <span className="cv-badge success">Score Global: 85/100</span>
              </div>
            </div>
            
            <div className="cv-mockup-body">
              <div className="cv-mockup-section">
                <h4>Scoring Multi-Critères</h4>
                <div className="criteria-list">
                  <div className="criteria-item">
                    <span>Clarté et Structure</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '90%' }}></div></div>
                  </div>
                  <div className="criteria-item">
                    <span>Impact des Projets</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '75%' }}></div></div>
                  </div>
                  <div className="criteria-item">
                    <span>Adéquation Compétences</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '88%' }}></div></div>
                  </div>
                </div>
              </div>

              <div className="cv-mockup-section">
                <h4>Analyse par Projet</h4>
                <div className="project-analysis">
                  <div className="project-item">
                    <div className="project-header">
                      <strong>Refonte Dashboard E-commerce</strong>
                      <span className="project-score">Excellent impact</span>
                    </div>
                    <p className="project-feedback">Bonne mise en avant des résultats (+25% de conversion).<br/>Suggestion Roni : Précise les technologies utilisées pour le state management.</p>
                  </div>
                  <div className="project-item">
                    <div className="project-header">
                      <strong>Migration API vers GraphQL</strong>
                      <span className="project-score warning">À détailler</span>
                    </div>
                    <p className="project-feedback">Suggestion Roni : Le rôle exact et les défis techniques rencontrés manquent de clarté. Nous pourrons l'explorer lors de l'entretien.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Partie droite : Texte et CTA */}
        <div className="proof-content" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.4', color: 'var(--text-primary)', margin: 0, textAlign: 'left' }}>
            Comprends exactement ce qui cloche dans ton CV et comment le corriger.
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-color)', margin: 0, lineHeight: '1.6' }}>
            Roni évalue expériences, projets et compétences, point par point, et te donne des axes d'amélioration concrets.
          </p>
          <div style={{ marginTop: '0.5rem' }}>
            <button className="cta-button primary large" onClick={handleCtaClick}>Faire analyser mon CV</button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductProof;
