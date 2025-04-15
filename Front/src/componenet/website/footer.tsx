import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center mb-8">
          <Link to="/particuliers" className="px-4 py-2 text-gray-600 hover:text-red-600">Particuliers</Link>
          <Link to="/professionnels" className="px-4 py-2 text-gray-600 hover:text-red-600">Professionnels</Link>
          <Link to="/entreprises" className="px-4 py-2 text-gray-600 hover:text-red-600">Entreprises</Link>
          <Link to="/a-propos" className="px-4 py-2 text-gray-600 hover:text-red-600">A propos</Link>
          <Link to="/actualites" className="px-4 py-2 text-gray-600 hover:text-red-600">Actualités</Link>
          <Link to="/nous-rejoindre" className="px-4 py-2 text-gray-600 hover:text-red-600">Nous rejoindre</Link>
          <Link to="/contacts" className="px-4 py-2 text-gray-600 hover:text-red-600">Contacts</Link>
          <Link to="/glossaire" className="px-4 py-2 text-gray-600 hover:text-red-600">Glossaire</Link>
          <Link to="/guide-assurances" className="px-4 py-2 text-gray-600 hover:text-red-600">Guide des assurances pour les entreprises</Link>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-gray-700 mb-2">ADRESSE</h3>
            <p className="text-gray-600">
              13 BP 1769 Abidjan 13,<br />
              Abidjan, Côte d'Ivoire
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-700 mb-2">E-MAIL</h3>
            <a href="mailto:sevenservicecommercial@gmail.com" className="text-gray-600 hover:text-red-600">
              sevenservicecommercial@gmail.com
            </a>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-bold text-gray-700 mb-2">TÉLÉPHONE</h3>
            <p className="text-gray-600">
              Siège social : +225 2722423318<br />
              Centre de Relation Client :<br />
              +225 2722423318
            </p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-4">Suivez-nous !</h3>
          <p className="text-gray-600 mb-4">
            Rejoignez notre communauté sur les réseaux sociaux et partagez avec nous vos avis et feedbacks !
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
              </svg>
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-red-600 hover:text-red-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-wrap justify-center text-sm text-gray-600">
            <span className="px-2">© 2025 Seven Assurances</span>
            <Link to="/conditions" className="px-2 hover:text-red-600">Conditions générales d'utilisation</Link>
            <Link to="/cookies" className="px-2 hover:text-red-600">Cookies</Link>
            <Link to="/mentions-legales" className="px-2 hover:text-red-600">Mentions légales</Link>
            <Link to="/plan-site" className="px-2 hover:text-red-600">Plan du site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
