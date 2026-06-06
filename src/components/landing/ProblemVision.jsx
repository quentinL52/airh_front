import React from 'react';

function ProblemVision() {
  return (
    <section className="problem-section" style={{ paddingTop: '2rem' }}>
      <div className="stats-container" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-number" style={{ fontSize: '1.3rem', lineHeight: '1.3', marginBottom: '1rem' }}>Ton CV est filtré avant d'être lu.</div>
          <p className="stat-text">Roni l'analyse en profondeur et révèle ta vraie valeur, au-delà des mots-clés.</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ fontSize: '1.3rem', lineHeight: '1.3', marginBottom: '1rem' }}>Tu décroches trop peu d'entretiens.</div>
          <p className="stat-text">Ton profil dynamique te rend visible des recruteurs qui cherchent exactement tes compétences.</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ fontSize: '1.3rem', lineHeight: '1.3', marginBottom: '1rem' }}>Et quand tu en décroches un, tu n'es pas préparé.</div>
          <p className="stat-text">Normal, on en passe trop rarement. L'entretien avec Roni t'entraîne en conditions réelles et te donne un vrai retour pour progresser.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '0 1rem' }}>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-color)', fontStyle: 'italic' }}>
          "Recalé sans entretien ? Le problème n'est pas toi, c'est ce qu'un CV ne dit pas."
        </p>
      </div>
    </section>
  );
}

export default ProblemVision;
