import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import '../style/Landing.css';
import founderImg from '../assets/Founder.png';

function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="landing-container about-page">
        {/* Section 1 - Manifeste */}
        <section className="manifesto-section">
          <div className="manifesto-content">
            <h2 className="about-section-title">Notre Manifeste</h2>
            <p>
              <strong>AIRH est né d'un constat :</strong> dans le recrutement tech, les CV atypiques finissent souvent sous la pile. Non par manque de talent, mais parce que les systèmes classiques ne sont pas construits pour les lire.
            </p>
            <p>
              Une offre reçoit des centaines de candidatures. Les recruteurs disposent de quelques secondes par CV. Dans ce tri, <strong>les profils qui ne cochent pas exactement les bonnes cases</strong>, les reconvertis, les autodidactes, les parcours non-linéaires, disparaissent.
            </p>
            <p>
              Dans ce lot de candidats oubliés se cachent <strong>des talents réels</strong> que les approches traditionnelles ne savent pas valoriser.
            </p>
            <p>
              <strong>Nous avons construit AIRH pour changer ça :</strong> une plateforme qui construit un profil dynamique, au-delà du CV, pour révéler ce que les filtres classiques ne voient pas, et connecter les bons profils aux bonnes entreprises.
            </p>
          </div>
        </section>

        {/* Section 2 - Meet the Founder */}
        <section className="founder-section">
          <h2 className="about-section-title text-center">Meet the Founder</h2>
          <div className="founder-container">
            <div className="founder-visual">
              <img src={founderImg} alt="Quentin Loumeau" className="founder-photo" />
            </div>
            <div className="founder-text">
              <p>
                <strong>Pendant 14 ans, j'ai travaillé avec mes mains.</strong> La pâtisserie m'a appris quelque chose que peu d'écoles enseignent vraiment : la rigueur, la précision, et la capacité à produire quelque chose de concret à partir de presque rien.
              </p>
              <p>
                <strong>Puis j'ai tout repris à zéro.</strong> Un bootcamp, une reconversion vers la data, et un premier contact avec le marché tech. J'ai envoyé des candidatures. J'ai attendu. Vu mes messages disparaître dans le silence. Pas parce que je manquais de compétences, mais parce que mon CV ne ressemblait à rien de balisé. Pas de parcours linéaire, pas de grandes écoles, pas les bons mots-clés au bon endroit.
              </p>
              <p>
                <strong>C'est cette expérience qui est devenue AIRH.</strong> D'abord un sujet de mémoire : une tentative de comprendre pourquoi les systèmes classiques échouent à valoriser les profils atypiques. Puis un produit concret. Je sais ce que c'est de finir sous la pile, et c'est précisément ce que nous construisons pour changer.
              </p>
              <div className="founder-identity">
                <span className="founder-name">Quentin Loumeau</span>
                <div className="founder-title-row">
                    <span className="founder-title">Founder</span>
                    <a href="https://www.linkedin.com/in/loumeau-quentin/" target="_blank" rel="noopener noreferrer" className="founder-linkedin" title="Profil LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default AboutPage;
