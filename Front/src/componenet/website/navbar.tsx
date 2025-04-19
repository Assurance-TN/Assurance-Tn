import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo1 from './images/logo1.jpg';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const dropdownMenus = {
    'mon-auto': [
      { title: 'Assurance Auto Basique', path: '/assurance-auto-basique' },
      { title: 'Assurance Dommages Collisions', path: '/assurance-dommages-collisions' },
      { title: 'Assurance Tous Risques', path: '/assurance-tous-risques' },
      { title: 'Assurance Auto Vecturis', path: '/assurance-auto-vecturis' },
    ],
    'ma-maison': [
      { title: 'Mon assurance habitation MRH', path: '/assurance-habitation-mrh' },
      { title: 'Assurance Incendie Habitation', path: '/assurance-incendie-habitation' },
    ],
    'ma-sante': [
      { title: 'Assurance santé individuelle Vialis', path: '/assurance-sante-vialis' },
      { title: 'Assurance santé Vialis étudiants', path: '/assurance-sante-etudiants' },
      { title: 'Assurance santé internationale', path: '/assurance-sante-internationale' },
      { title: 'Assurance individuelle accident', path: '/assurance-individuelle-accident' },
    ],
    'mes-loisirs': [
      { title: 'Assurance voyage', path: '/assurance-voyage' },
      { title: 'Assurance Corps de Plaisance NAVIS', path: '/assurance-corps-plaisance' },
    ],
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = Object.keys(dropdownRefs.current).every(key => {
        const ref = dropdownRefs.current[key];
        return !ref || !ref.contains(target);
      });
      
      if (isOutside) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, key: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveDropdown(activeDropdown === key ? null : key);
    } else if (event.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  const handleDropdownClick = (key: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      {/* Top bar with logo, contact, and social icons */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/homepage" className="flex-shrink-0 transition-transform hover:scale-105">
                <img className="h-14 w-auto" src={logo1} alt="Seven Assurances" />
              </Link>
            </div>
            
            {/* Social icons and contact */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Contact Information */}
              <div className="flex items-center">
                <a href="mailto:sevenservicecommercial@gmail.com" className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center mr-6">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>sevenservicecommercial@gmail.com</span>
                </a>
                <a href="tel:+2252722423318" className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+225 2722423318</span>
                </a>
              </div>
              
              {/* Client buttons */}
              <div className="flex items-center space-x-2">
                <Link to="/parrainez" className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors duration-200 transform hover:scale-105 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  PARRAINEZ
                </Link>
                <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 transform hover:scale-105 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ESPACE CLIENT
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Categories and Dropdowns */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Category navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/particuliers" className="text-gray-700 hover:text-red-600 px-3 py-2 transition-colors duration-200 font-semibold">PARTICULIERS</Link>
            <Link to="/professionnels" className="text-gray-500 hover:text-red-600 px-3 py-2 transition-colors duration-200">PROFESSIONNELS</Link>
            <Link to="/entreprises" className="text-gray-500 hover:text-red-600 px-3 py-2 transition-colors duration-200">ENTREPRISES</Link>
            <Link to="/seven-assurance" className="text-gray-500 hover:text-red-600 px-3 py-2 transition-colors duration-200">SEVEN ASSURANCES</Link>
          </div>
        </div>
        
        {/* Desktop Navigation Dropdown */}
        <div className="hidden md:flex space-x-8 py-2 relative border-t border-gray-100">
          {Object.entries(dropdownMenus).map(([key, items]) => (
            <div 
              key={key}
              className="relative"
              ref={(el) => dropdownRefs.current[key] = el}
              onMouseEnter={() => setActiveDropdown(key)}
            >
              <button
                onClick={(e) => handleDropdownClick(key, e)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                className="text-gray-700 hover:text-red-600 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md transition-colors duration-200"
                aria-expanded={activeDropdown === key}
                aria-haspopup="true"
              >
                {key === 'mon-auto' ? 'Mon auto' : 
                 key === 'ma-maison' ? 'Ma maison' : 
                 key === 'ma-sante' ? 'Ma santé' : 
                 'Mes loisirs'} 
                <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === key && (
                <div 
                  className="absolute left-0 mt-1 w-72 bg-white rounded-md shadow-lg z-50 transform transition-all duration-200 opacity-100 scale-100"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="py-1 rounded-md ring-1 ring-black ring-opacity-5">
                    {items.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/particuliers" className="block px-3 py-2 text-gray-700 font-medium hover:text-red-600 hover:bg-gray-50 rounded-md">PARTICULIERS</Link>
              <Link to="/professionnels" className="block px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-md">PROFESSIONNELS</Link>
              <Link to="/entreprises" className="block px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-md">ENTREPRISES</Link>
              <Link to="/Seven Assurances" className="block px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-md">SEVEN ASSURANCES</Link>
            </div>
            
            <div className="px-2 pt-2 pb-3 border-t border-gray-200">
              {Object.entries(dropdownMenus).map(([key, items]) => (
                <div key={key} className="space-y-1">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md flex justify-between items-center"
                  >
                    <span>
                      {key === 'mon-auto' ? 'Mon auto' : 
                      key === 'ma-maison' ? 'Ma maison' : 
                      key === 'ma-sante' ? 'Ma santé' : 
                      'Mes loisirs'}
                    </span>
                    <svg className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === key && (
                    <div className="pl-4 space-y-1">
                      {items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="px-2 pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link to="/parrainez" className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  PARRAINEZ
                </Link>
                <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ESPACE CLIENT
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
