import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';
import image4 from './images/image4.jpg';
import santeImg from './images/santé.jpg';
import scolaireImg from './images/SCOLAIRE.jpg';
import transportImg from './images/TRANSPORT MARCHANDISE.jpg';
import voitureImg from './images/voiture.jpg';
import voyagesImg from './images/voyages.jpg';
import maison from './images/maison.jpg';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [image1, image2, image3, image4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const insuranceCards = [
    {
      title: "Votre voiture",
      description: "La meilleure offre sur le marché des assurances auto et des services d'assistance pour tous les budgets.",
      image: voitureImg,
      link: "/assurances-auto",
      linkText: "ASSURANCES AUTO",
      devisLink: "/devis-auto"
    },
    {
      title: "Votre Maison",
      description: "Assurez votre habitation contre les risques pour votre sécurité et celle de votre famille.",
      image: maison, // Placeholder, replace with actual house image if available
      link: "/assurances-habitation",
      linkText: "ASSURANCES HABITATION",
      devisLink: "/devis-habitation"
    },
    {
      title: "Votre santé",
      description: "Votre bien le plus précieux, en Tunisie ou à l'international, l'assurance maladie n'est plus une option !",
      image: santeImg,
      link: "/assurances-sante",
      linkText: "ASSURANCES SANTÉ",
      devisLink: "/devis-sante"
    },
    {
      title: "Transport Marchandise",
      description: "Sécurisez vos marchandises et protégez votre activité avec notre assurance transport adaptée à vos besoins.",
      image: transportImg,
      link: "/assurances-transport",
      linkText: "ASSURANCES TRANSPORT",
      devisLink: "/devis-transport"
    },
    {
      title: "Assurance Scolaire",
      description: "Protégez vos enfants à l'école et lors des activités périscolaires avec notre assurance dédiée.",
      image: scolaireImg,
      link: "/assurances-scolaire",
      linkText: "ASSURANCES SCOLAIRE",
      devisLink: "/devis-scolaire"
    },
    {
      title: "Voyages",
      description: "Voyagez l'esprit tranquille avec notre couverture complète pour tous vos déplacements à l'étranger.",
      image: voyagesImg,
      link: "/assurances-voyage",
      linkText: "ASSURANCES VOYAGE",
      devisLink: "/devis-voyage"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Carousel */}
        <div className="relative h-[500px] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay content if needed */}
              {index === 0 && (
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="flex justify-between">
                 
                      
                
                      <div className="w-1/4"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Carousel Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Center Paragraph */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Une assurance pour chaque détail de votre vie</h2>
              <p className="text-xl text-gray-600 mb-4">Ne laissez plus votre vie et celle de votre famille entre les mains du hasard.</p>
              <p className="text-xl font-semibold text-red-600">Seven Assurances vous protège en toutes circonstances</p>
            </div>
          </div>
        </div>

        {/* Insurance Cards Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insuranceCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="flex flex-col space-y-3">
                      <a 
                        href={card.link} 
                        className="text-red-600 font-bold hover:text-red-800 flex items-center"
                      >
                        {card.linkText}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                      <a 
                        href={card.devisLink} 
                        className="inline-block text-center border border-gray-300 rounded-full py-2 px-4 text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        Devis en ligne
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Sidebar */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-lg z-50">
          <div className="flex flex-col space-y-8 p-4">
            <a href="/assistance" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Assistance</span>
            </a>
            <a href="/devis" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Demande<br/>de devis</span>
            </a>
            <a href="/nos-agences" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Nos<br/>agences</span>
            </a>
            <a href="/contact" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Contactez<br/>nous</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

