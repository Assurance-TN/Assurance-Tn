import React, { useState, useEffect, useRef } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import agenceImg from './images/agence.jpg';
import { Link } from 'react-router-dom';

// Declare global window interface to add google maps and initMap
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Type definitions
interface AgencyPosition {
  lat: number;
  lng: number;
}

interface Agency {
  id: number;
  name: string;
  type: string;
  region: string;
  address: string;
  phone: string;
  email: string;
  position: AgencyPosition;
}

// Agency types and regions for filtering
const AGENCY_TYPES = ["Tout", "Bureaux", "Centres d'expertise", "Courtiers"];
const REGIONS = ["Tout", "Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro", "Korhogo", "Daloa"];

// Sample agency data (replace with your actual data)
const AGENCY_DATA: Agency[] = [
  {
    id: 1,
    name: "Agence Centrale Abidjan",
    type: "Bureaux",
    region: "Abidjan",
    address: "Boulevard de la République, Abidjan",
    phone: "+225 27 22 42 33 18",
    email: "centrale.abidjan@sevenassurances.ci",
    position: { lat: 5.3364, lng: -4.0266 }
  },
  {
    id: 2,
    name: "Centre d'Expertise Plateau",
    type: "Centres d'expertise",
    region: "Abidjan",
    address: "Rue des Jardins, Plateau, Abidjan",
    phone: "+225 27 22 42 33 19",
    email: "expertise.plateau@sevenassurances.ci",
    position: { lat: 5.3260, lng: -4.0217 }
  },
  {
    id: 3,
    name: "Seven Assurances Yamoussoukro",
    type: "Bureaux",
    region: "Yamoussoukro",
    address: "Avenue des Présidents, Yamoussoukro",
    phone: "+225 27 30 64 15 22",
    email: "agence.yamoussoukro@sevenassurances.ci",
    position: { lat: 6.8276, lng: -5.2893 }
  },
  {
    id: 4,
    name: "Cabinet KACI Assurances",
    type: "Courtiers",
    region: "Bouaké",
    address: "Rue du Commerce, Bouaké",
    phone: "+225 27 31 63 11 09",
    email: "kaci.bouake@sevenassurances.ci",
    position: { lat: 7.6906, lng: -5.0091 }
  },
  {
    id: 5,
    name: "Centre d'Expertise San-Pédro",
    type: "Centres d'expertise",
    region: "San-Pédro",
    address: "Boulevard Maritime, San-Pédro",
    phone: "+225 27 34 71 28 50",
    email: "expertise.sanpedro@sevenassurances.ci",
    position: { lat: 4.7492, lng: -6.6367 }
  },
  {
    id: 6,
    name: "Agence Nord Korhogo",
    type: "Bureaux",
    region: "Korhogo",
    address: "Avenue de la Paix, Korhogo",
    phone: "+225 27 36 86 45 12",
    email: "agence.korhogo@sevenassurances.ci",
    position: { lat: 9.4580, lng: -5.6296 }
  },
  {
    id: 7,
    name: "Seven Courtage Daloa",
    type: "Courtiers",
    region: "Daloa",
    address: "Rue du Marché, Daloa",
    phone: "+225 27 32 78 15 64",
    email: "courtage.daloa@sevenassurances.ci",
    position: { lat: 6.8701, lng: -6.4500 }
  }
];

const NosAgences = () => {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedType, setSelectedType] = useState<string>("Tout");
  const [selectedRegion, setSelectedRegion] = useState<string>("Tout");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const API_KEY = "AIzaSyB5gnUWjb84t6klt5vcPjMOQylhQRFB5Wc";

  // Filter agencies based on type, region, and search keyword
  const filteredAgencies = AGENCY_DATA.filter(agency => {
    const matchesType = selectedType === "Tout" || agency.type === selectedType;
    const matchesRegion = selectedRegion === "Tout" || agency.region === selectedRegion;
    const matchesSearch = 
      searchKeyword === "" || 
      agency.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      agency.address.toLowerCase().includes(searchKeyword.toLowerCase());
    
    return matchesType && matchesRegion && matchesSearch;
  });

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    // Define global initMap function
    window.initMap = () => {
      if (mapRef.current) {
        // Center on Côte d'Ivoire
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 7.54, lng: -5.55 }, // Center of Côte d'Ivoire
          zoom: 7,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        
        // Create info window instance
        const infoWindowInstance = new window.google.maps.InfoWindow();
        
        setMap(mapInstance);
        setInfoWindow(infoWindowInstance);
      }
    };

    loadGoogleMapsScript();

    // Clean up
    return () => {
      window.initMap = () => {}; // Empty function instead of undefined
      // Remove the script tag if needed
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // Update markers when map is ready or filters change
  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear existing markers
    markers.forEach((marker: any) => marker.setMap(null));
    
    // Create new markers for filtered agencies
    const newMarkers = filteredAgencies.map(agency => {
      const marker = new window.google.maps.Marker({
        position: agency.position,
        map: map,
        title: agency.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 10
        }
      });

      // Add click listener to marker
      marker.addListener('click', () => {
        // Set the selected agency
        setSelectedAgency(agency);
        
        // Create info window content 
        const content = `
          <div class="p-3 max-w-md">
            <h2 class="text-xl font-bold">${agency.name}</h2>
            <p><strong>Type :</strong> ${agency.type}</p>
            <p><strong>Région :</strong> ${agency.region}</p>
            <p><strong>Adresse :</strong> ${agency.address}</p>
            <p><strong>Tél. :</strong> ${agency.phone}</p>
            <p><strong>Email :</strong> ${agency.email}</p>
          </div>
        `;

        // Set info window content and open it
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Adjust map bounds to fit all markers if there are any
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker: any) => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
      
      // If only one marker, zoom in a bit
      if (newMarkers.length === 1) {
        map.setZoom(14);
      }
    }
  }, [map, infoWindow, filteredAgencies]);

  // Handle filter changes
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const clearFilters = () => {
    setSelectedType("Tout");
    setSelectedRegion("Tout");
    setSearchKeyword("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={agenceImg} alt="Nos Agences" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">Nos Agences</h1>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Type filter */}
              <div>
                <label htmlFor="type" className="block text-gray-700 mb-2 font-medium">
                  Type d'agence
                </label>
                <select
                  id="type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-white"
                >
                  {AGENCY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === "Tout" ? "- Tout -" : type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Region filter */}
              <div>
                <label htmlFor="region" className="block text-gray-700 mb-2 font-medium">
                  Région
                </label>
                <select
                  id="region"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-white"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region === "Tout" ? "- Tout -" : region}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Keyword search */}
              <div>
                <label htmlFor="keyword" className="block text-gray-700 mb-2 font-medium">
                  Mot clé
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="Rechercher par nom ou adresse"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agency list */}
            <div className="bg-white rounded-lg shadow-lg p-6 h-[500px] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                {filteredAgencies.length} Agence{filteredAgencies.length !== 1 ? 's' : ''} trouvée{filteredAgencies.length !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-6">
                {filteredAgencies.map((agency) => (
                  <div 
                    key={agency.id}
                    className={`p-4 border-l-4 border-red-500 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedAgency?.id === agency.id ? 'bg-red-50' : ''
                    }`}
                    onClick={() => {
                      if (map && markers.length > 0) {
                        // Find the marker for this agency
                        const marker = markers.find((m: any) => m.getTitle() === agency.name);
                        if (marker) {
                          // Center the map on this marker
                          map.setCenter(marker.getPosition());
                          map.setZoom(14);
                          // Trigger the click event on the marker
                          window.google.maps.event.trigger(marker, 'click');
                        }
                      }
                    }}
                  >
                    <h3 className="font-bold text-gray-800">{agency.name}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type :</span> {agency.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Région :</span> {agency.region}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Adresse :</span> {agency.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tél. :</span> {agency.phone}
                    </p>
                  </div>
                ))}
                
                {filteredAgencies.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune agence ne correspond à vos critères de recherche.
                  </div>
                )}
              </div>
            </div>
            
            {/* Map container */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px]">
                <div
                  ref={mapRef}
                  id="map"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
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
          <Link to="/devis" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
            <div className="rounded-full p-2 bg-gray-100 hover:bg-red-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Demande<br/>de devis</span>
          </Link>
          <Link to="/nos-agences" className="flex flex-col items-center text-red-600 transition-colors">
            <div className="rounded-full p-2 bg-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Nos<br/>agences</span>
          </Link>
          <Link to="/contact" className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors">
            <div className="rounded-full p-2 bg-gray-100 hover:bg-red-50 transition-colors">
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

export default NosAgences;
