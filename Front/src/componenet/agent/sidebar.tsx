import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-purple-800 mb-6">Menu</h2>
        <nav className="space-y-2">
          <Link
            to="/agent/create-contract"
            className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-800 rounded-md transition-colors"
          >
            Ajouter Contract
          </Link>
          <Link
            to="/agent/reclamation"
            className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-800 rounded-md transition-colors"
          >
            Reclamation
          </Link>
          <Link
            to="/agent/utilisateurs"
            className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-800 rounded-md transition-colors"
          >
            Tous les utilisateurs
          </Link>
        </nav>
      </div>
    </div>
  );
} 