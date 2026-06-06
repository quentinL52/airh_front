import React from 'react';
import { Link } from 'react-router-dom';

function Footer({ isEnterprise = false }) {
  return (
    <footer className="footer-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', width: '100%' }}>
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">AIRH</span>
            <p className="footer-baseline">Votre talent mérite bien plus qu'un CV</p>
          </div>
          <div className="footer-links-group">
            <Link to="/about" className="footer-text-link">À propos</Link>
            <a href="mailto:contact@airh.info" className="footer-text-link">Contact</a>
            <a href="https://www.linkedin.com/company/112043111" target="_blank" rel="noopener noreferrer" className="footer-text-link">LinkedIn</a>
            <a href="mailto:contact@airh.info?subject=Contact%20Ecole%20ou%20Bootcamp" className="footer-text-link">Vous êtes une école ou un bootcamp ?</a>
          </div>
          <div className="footer-links-group">
            <a href="#" className="footer-text-link">Mentions légales</a>
            <a href="#" className="footer-text-link">Confidentialité</a>
            <a href="#" className="footer-text-link">CGU</a>
            {isEnterprise && <Link to="/" className="footer-text-link" style={{ marginTop: '1rem', fontWeight: 'bold' }}>Vous êtes candidat ?</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;