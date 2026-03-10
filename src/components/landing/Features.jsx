import candidatImg from '../../assets/candidat.png';
import recruteurImg from '../../assets/recruteur.png';

function Features() {
  return (
    <section className="features-section">
      <div className="feature-card">
        <img src={candidatImg} alt="Candidat" className="feature-image" />
        <h2 className="feature-title">Pour les Candidats</h2>
        <ul className="feature-list">
          <li><strong>Gagnez en assurance :</strong> L'étape d'entretien est souvent celle pour laquelle les candidats sont le moins préparés, Roni est la pour vous y aider. </li>
          <li><strong>Recevez des retours constructifs :</strong> A l'issue de votre entretien, Roni vous fournit une analyse de vos réponses pour vous aider à identifier vos points forts et les aspects à améliorer.</li>
          <li><strong>Evaluez votre CV :</strong> Avec notre moteur d'analyse, vous pouvez obtenir des retours constructifs sur votre CV.</li>
        </ul>
      </div>

      <div className="feature-card">
        <img src={recruteurImg} alt="Recruteur" className="feature-image" />
        <h2 className="feature-title">Pour les Recruteurs</h2>
        <ul className="feature-list">
          <li><strong>Optimisez votre processus de sélection :</strong> Nous cherchons à vous offrir un outil pour évaluer les candidats de manière plus efficace et structurée.</li>
          <li><strong>Gagnez du temps dans la présélection :</strong> Nous souhaitons vous aider à identifier rapidement les profils les plus prometteurs pour les postes à pourvoir.</li>
          <li><strong>Obtenez des informations pertinentes :</strong> Notre objectif est de vous fournir des rapports d'évaluation pour faciliter vos décisions d'embauche.</li>
        </ul>
      </div>
    </section>
  );
}

export default Features;
