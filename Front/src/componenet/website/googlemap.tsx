import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Globe } from 'lucide-react';

const API_KEY = "AIzaSyB5gnUWjb84t6klt5vcPjMOQylhQRFB5Wc";

function LocationMap() {
    const [map, setMap] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [country, setCountry] = useState('');
    const mapRef = useRef(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        };

        window.initMap = () => {
            if (mapRef.current) {
                const newMap = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 0, lng: 0 },
                    zoom: 2,
                });
                setMap(newMap);
            }
        };

        loadGoogleMapsScript();
    }, []);

    const fetchRestaurantDetails = (placeId) => {
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails({ placeId, fields: ['name', 'formatted_address', 'geometry', 'website', 'formatted_phone_number'] }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                setSelectedRestaurant({
                    name: place.name,
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    website: place.website || 'N/A',
                    phone: place.formatted_phone_number || 'N/A',
                    menu: [] // Future enhancement: Fetch menu data from an external API
                });
            }
        });
    };

    const handleCountrySearch = () => {
        if (!map) return;
        const service = new window.google.maps.places.PlacesService(map);
        const request = {
            query: `restaurants in ${country}`,
            fields: ['name', 'formatted_address', 'geometry', 'place_id']
        };

        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setRestaurants(results);
                map.setCenter(results[0].geometry.location);
                map.setZoom(10);

                results.forEach((restaurant) => {
                    const marker = new window.google.maps.Marker({
                        position: restaurant.geometry.location,
                        map,
                        title: restaurant.name
                    });

                    marker.addListener('click', () => {
                        fetchRestaurantDetails(restaurant.place_id);
                    });
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <Globe className="text-yellow-500 h-8 w-8" />
                        Find Restaurants
                    </h1>
                    <p className="text-gray-600">Search for restaurants by country</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-yellow-500 h-6 w-6" />
                                    <h2 className="text-xl font-semibold text-gray-800">Search Location</h2>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="Enter country name"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                    <button
                                        onClick={handleCountrySearch}
                                        className="absolute right-2 top-2 bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div ref={mapRef} id="map" className="w-full h-[600px]" />
                    </div>
                </div>
                {selectedRestaurant && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Selected Restaurant:</h2>
                        <p className="text-gray-700"><span className="font-medium">Name:</span> {selectedRestaurant.name}</p>
                        <p className="text-gray-700"><span className="font-medium">Address:</span> {selectedRestaurant.address}</p>
                        <p className="text-gray-700"><span className="font-medium">Latitude:</span> {selectedRestaurant.latitude}</p>
                        <p className="text-gray-700"><span className="font-medium">Longitude:</span> {selectedRestaurant.longitude}</p>
                        <p className="text-gray-700"><span className="font-medium">Website:</span> <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">{selectedRestaurant.website}</a></p>
                        <p className="text-gray-700"><span className="font-medium">Phone:</span> {selectedRestaurant.phone}</p>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">Menu:</h3>
                        <p className="text-gray-600">(Menu data not available)</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LocationMap;