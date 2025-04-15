import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import assistanceImg from './images/assistance.jpg';
import { Link } from 'react-router-dom';

const ServicesAssistance = () => {
  const assistanceCards = [
    {
      title: "Assistance auto",
      description: "Disponible 24h/24 et 7J/7",
      phone: "07 08 80 01 83 / 27 22 42 33 18"
    },
    {
      title: "Assistance MRH",
      description: "Assistance à domicile, disponible 24h/24 et 7J/7",
      phone: "71 104 580"
    },
    {
      title: "Assistance voyage",
      description: "Où que vous soyez, disponible 24h/24 et 7J/7",
      phone: "+33 1 45 16 66 92"
    },
    {
      title: "Assistance santé",
      description: "Pour tous vos besoins en assurance santé internationale",
      phone: "+225 27 22 42 33 18"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={assistanceImg} alt="Services d'assistance" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center">Services d'assistance</h1>
          </div>
        </div>

        {/* Assistance Description */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Services d'assistance</h2>
              <p className="text-xl text-gray-700">
                Seven ASSURANCES vous assiste et vous accompagne dans les moments où vous en avez le plus besoin.
              </p>
            </div>
          </div>
        </div>

        {/* Assistance Cards */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {assistanceCards.map((card, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                  <p className="text-gray-700 mb-6">{card.description}</p>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Téléphone</h4>
                    <p className="text-xl font-bold text-red-600">{card.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Online Services */}
        <div className="py-16 bg-gradient-to-r from-purple-800 to-red-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-6">Profitez également de nos services en ligne</h2>
                <p className="text-lg mb-4">
                  Seven ASSURANCES vous propose une panoplie de services via le compte client.
                </p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="text-xl">- Demander un devis d'assurance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-xl">- Consulter vos contrats</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-xl">- Déclarer et suivre un sinistre</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-xl">- Payer en ligne</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-xl">- Déposer vos demandes et réclamations</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a href="/espace-client" className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-full transition-colors hover:bg-gray-100">
                    Espace Client
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Sidebar */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-l-lg z-50">
          <div className="flex flex-col space-y-8 p-4">
            <Link to="/services-assistance" className="flex flex-col items-center text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-red-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Assistance</span>
            </Link>
            <Link to="/devis" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Demande<br/>de devis</span>
            </Link>
            <Link to="/nos-agences" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Nos<br/>agences</span>
            </Link>
            <Link to="/contact" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
              <div className="rounded-full p-2 bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Contactez<br/>nous</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesAssistance;
