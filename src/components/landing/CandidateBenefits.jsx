import React from 'react';

function CandidateBenefits() {
  return (
    <section className="benefits-section">
      <h2 className="section-title hidden">Tes bénéfices</h2>
      <div className="benefits-grid">
        <div className="benefit-card">
          <h3 className="benefit-title">Fais valoir tes compétences réelles.</h3>
          <p className="benefit-description">Quel que soit ton parcours, montre ce que tu sais faire, pas seulement ce que tu as écrit.</p>
        </div>
        <div className="benefit-card">
          <h3 className="benefit-title">Vise juste.</h3>
          <p className="benefit-description">Identifie les postes faits pour toi et arrête de candidater à l'aveugle.</p>
        </div>
        <div className="benefit-card">
          <h3 className="benefit-title">Comprends comment tu es vraiment lu.</h3>
          <p className="benefit-description">Découvre ce qu'un recruteur voit et ne voit pas dans ton CV.</p>
        </div>
        <div className="benefit-card">
          <h3 className="benefit-title">Entraîne-toi en conditions réelles.</h3>
          <p className="benefit-description">L'entretien avec Roni te prépare aussi au jour J.</p>
        </div>
        <div className="benefit-card">
          <h3 className="benefit-title">Sois visible des entreprises qui comptent.</h3>
          <p className="benefit-description">Ton profil dynamique te rend accessible aux recruteurs tech qui cherchent exactement tes compétences.</p>
        </div>
      </div>
    </section>
  );
}

export default CandidateBenefits;
