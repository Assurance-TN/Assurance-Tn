import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import contactImg from './images/contact.jpg';
import { Link, useLocation } from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  const isDevisRoute = location.pathname === '/devis';

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    entreprise: '',
    fonction: '',
    objet: '',
    telephone: '',
    message: '',
    captcha: ''
  });

  // Set "Demande de devis" as the default object when coming from /devis route
  useEffect(() => {
    if (isDevisRoute) {
      setFormData(prevState => ({
        ...prevState,
        objet: 'Demande de devis'
      }));
    }
  }, [isDevisRoute]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }
    
    if (!formData.fonction.trim()) newErrors.fonction = "La fonction est requise";
    if (!formData.objet.trim()) newErrors.objet = "L'objet est requis";
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.telephone)) {
      newErrors.telephone = "Veuillez entrer un numéro de téléphone valide";
    }
    
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    
    if (!formData.captcha.trim()) {
      newErrors.captcha = "Veuillez résoudre le captcha";
    } else if (formData.captcha !== "19") {
      newErrors.captcha = "La réponse du captcha est incorrecte";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        entreprise: '',
        fonction: '',
        objet: '',
        telephone: '',
        message: '',
        captcha: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Banner with Parallax Effect */}
      <div className="relative h-[450px] overflow-hidden">
        <div className="absolute inset-0 transform scale-105" style={{
          backgroundImage: `url(${contactImg})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          transform: 'translateZ(0)',
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {isDevisRoute ? 'Demande de devis' : 'Contactez-nous'}
          </h1>
          {isDevisRoute && (
            <p className="text-xl text-gray-200 max-w-2xl">
              Remplissez le formulaire ci-dessous pour recevoir un devis personnalisé.
            </p>
          )}
        </div>
      </div>
      
      <main className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Nos coordonnées</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Adresse</h3>
                    <p className="text-gray-600">92W5+48G, Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                    <p className="text-gray-600 mb-1">
                      Siège social : <a href="tel:+2252722423318" className="text-red-600 hover:underline transition-colors">+225 27 22 42 33 18</a>
                    </p>
                    <p className="text-gray-600">
                      Centre de Relation Client : <a href="tel:+2252722423318" className="text-red-600 hover:underline transition-colors">+225 27 22 42 33 18</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:sevenservicecommercial@gmail.com" className="text-red-600 hover:underline transition-colors">
                      sevenservicecommercial@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Horaires d'ouverture</h3>
                    <p className="text-gray-600">Du lundi au vendredi : 8h - 18h</p>
                    <p className="text-gray-600">Samedi : 9h - 13h</p>
                  </div>
                </div>
                
                {/* Google Map */}
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.9333971747086!2d-3.9967925238807896!3d5.285564237118881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eba2b8870ffd%3A0xe8e92bfafaf4bfac!2s92W5%2B48G%2C%20Abidjan%2C%20C%C3%B4te%20d&#39;Ivoire!5e0!3m2!1sfr!2sus!4v1710869025362!5m2!1sfr!2sus" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                {isDevisRoute ? 'Formulaire de demande de devis' : 'Formulaire de contact'}
              </h2>
              {submitSuccess ? (
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Merci pour votre message !</h3>
                  <p className="text-gray-600 mb-6">
                    {isDevisRoute 
                      ? "Nous avons bien reçu votre demande de devis et nous vous répondrons dans les plus brefs délais."
                      : "Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais."
                    }
                  </p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {isDevisRoute ? "Faire une nouvelle demande" : "Envoyer un nouveau message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isDevisRoute && (
                    <p className="text-gray-600 mb-3">
                      Veuillez remplir ce formulaire pour recevoir un devis personnalisé selon vos besoins.
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nom" className="block text-gray-700 text-sm font-medium mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className={`w-full border ${errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                        placeholder="Entrez votre nom"
                      />
                      {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="prenom" className="block text-gray-700 text-sm font-medium mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className={`w-full border ${errors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                        placeholder="Entrez votre prénom"
                      />
                      {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                      placeholder="exemple@domaine.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="entreprise" className="block text-gray-700 text-sm font-medium mb-1">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        id="entreprise"
                        name="entreprise"
                        value={formData.entreprise}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fonction" className="block text-gray-700 text-sm font-medium mb-1">
                        Fonction <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fonction"
                        name="fonction"
                        value={formData.fonction}
                        onChange={handleChange}
                        className={`w-full border ${errors.fonction ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                        placeholder="Votre poste ou fonction"
                      />
                      {errors.fonction && <p className="text-red-500 text-xs mt-1">{errors.fonction}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="objet" className="block text-gray-700 text-sm font-medium mb-1">
                        Objet <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="objet"
                        name="objet"
                        value={formData.objet}
                        onChange={handleChange}
                        className={`w-full border ${errors.objet ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all bg-white`}
                      >
                        <option value="">Sélectionnez un objet</option>
                        <option value="Demande d'information">Demande d'information</option>
                        <option value="Demande de devis">Demande de devis</option>
                        <option value="Service client">Service client</option>
                        <option value="Réclamation">Réclamation</option>
                        <option value="Autre">Autre</option>
                      </select>
                      {errors.objet && <p className="text-red-500 text-xs mt-1">{errors.objet}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="telephone" className="block text-gray-700 text-sm font-medium mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className={`w-full border ${errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                        placeholder="+225 XX XX XX XX"
                      />
                      {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full border ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                      placeholder="Écrivez votre message ici..."
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2.5 bg-gray-100 rounded-md border border-gray-200">
                        <span className="font-semibold">16 + 3 =</span>
                      </div>
                      <input
                        type="text"
                        id="captcha"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleChange}
                        className={`w-24 border ${errors.captcha ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all`}
                        placeholder="?"
                      />
                    </div>
                    {errors.captcha && <p className="text-red-500 text-xs">{errors.captcha}</p>}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-gray-500 text-xs mb-3"><span className="text-red-500">*</span> Champs obligatoires</p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-red-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        isDevisRoute ? 'Demander un devis' : 'Envoyer'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Additional Content Section - Removed as per requirement */}
        </div>
      </main>
      
      {/* Fixed Sidebar */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-lg z-50">
        <div className="flex flex-col space-y-8 p-4">
          <Link to="/services-assistance" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
            <div className="rounded-full p-2 bg-gray-100 hover:bg-red-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Assistance</span>
          </Link>
          <Link 
            to="/devis" 
            className={`flex flex-col items-center ${isDevisRoute ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors`}
          >
            <div className={`rounded-full p-2 ${isDevisRoute ? 'bg-red-100' : 'bg-gray-100 hover:bg-red-50'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Demande<br/>de devis</span>
          </Link>
          <Link to="/nos-agences" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
            <div className="rounded-full p-2 bg-gray-100 hover:bg-red-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Nos<br/>agences</span>
          </Link>
          <Link 
            to="/contact" 
            className={`flex flex-col items-center ${!isDevisRoute ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors`}
          >
            <div className={`rounded-full p-2 ${!isDevisRoute ? 'bg-red-100' : 'bg-gray-100 hover:bg-red-50'} transition-colors`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Contactez<br/>nous</span>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
