import React from 'react';

function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <h2 className="section-title">De ton CV à ton vrai profil, en 3 étapes.</h2>
      
      <div className="steps-container">
        <div className="step-card">
          <div className="step-number">01</div>
          <h3 className="step-title">Dépose ton CV</h3>
          <p className="step-description">Roni l'analyse en profondeur : qualité, lisibilité, points forts, axes d'amélioration concrets.</p>
        </div>
        <div className="step-card">
          <div className="step-number">02</div>
          <h3 className="step-title">Passe un entretien avec Roni</h3>
          <p className="step-description">Un échange adapté à ton profil qui enrichit ce que ton CV ne dit pas : tes compétences réelles, ton contexte, tes projets.</p>
        </div>
        <div className="step-card">
          <div className="step-number">03</div>
          <h3 className="step-title">Découvre ton profil dynamique</h3>
          <p className="step-description">Le résultat des deux : un profil qui révèle ta vraie valeur et les postes où tu ressors le mieux... et les recruteurs qui recherchent ton profil peuvent t'identifier directement.</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
