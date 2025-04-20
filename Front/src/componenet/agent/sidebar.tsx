import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaExclamationTriangle, FaUsers, FaCarCrash } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#0e04c3] mb-6">Menu</h2>
        <nav className="space-y-2">
          <Link
            to="/agent/create-contract"
            className="flex items-center px-4 py-2 text-[#0e04c3] hover:bg-[#3c4191] hover:text-white rounded-md transition-colors"
          >
            <FaFileContract className="mr-3" />
            Ajouter Contract
          </Link>
          <Link
            to="/agent/reclamation"
            className="flex items-center px-4 py-2 text-[#0e04c3] hover:bg-[#3c4191] hover:text-white rounded-md transition-colors"
          >
            <FaExclamationTriangle className="mr-3" />
            Reclamation
          </Link>
          <Link
            to="/agent/utilisateurs"
            className="flex items-center px-4 py-2 text-[#0e04c3] hover:bg-[#3c4191] hover:text-white rounded-md transition-colors"
          >
            <FaUsers className="mr-3" />
            Tous les utilisateurs
          </Link>
          <Link
            to="/agent/utilisateurs"
            className="flex items-center px-4 py-2 text-[#0e04c3] hover:bg-[#3c4191] hover:text-white rounded-md transition-colors"
          >
            <FaCarCrash className="mr-3" />
            sinistre
          </Link>
        </nav>
      </div>
    </div>
  );
} 