import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  UserGroupIcon,
  CreditCardIcon,
  FlagIcon,
  ClipboardDocumentCheckIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Accueil', icon: HomeIcon, path: '/homepageclient', isActive: true },
  { name: 'choisir le contrat', icon: DocumentTextIcon, path: '/devis' },
  { name: 'Mes contrats', icon: DocumentDuplicateIcon, path: '/mes-contrats' },
  { name: 'Mes devis', icon: DocumentIcon, path: '/mes-devis' },
  { name: "Demander de l'assistance", icon: UserGroupIcon, path: '/assistance' },
  { name: 'Mes sinistres', icon: FlagIcon, path: '/mes-sinistres' },
  { name: 'Paiement en ligne', icon: CreditCardIcon, path: '/paiement' },
  { name: 'Le club parrainage', icon: UserGroupIcon, path: '/parrainage' },
  { name: "Centres d'expertise Auto", icon: ClipboardDocumentCheckIcon, path: '/expertise-auto' },
];

const bottomMenuItems = [
  { name: 'Nos agences', icon: BuildingOfficeIcon, path: '/nos-agences' },
  { name: 'Foire aux questions', icon: QuestionMarkCircleIcon, path: '/faq' },
  { name: 'Centre de relation client', icon: PhoneIcon, path: '/contact' },
];

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Main menu items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-[#0e04c3] rounded-lg hover:bg-[#3c4191] hover:text-white transition-colors duration-200
                ${item.isActive ? 'bg-[#3c4191] text-white' : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom menu items */}
        <div className="px-4 py-6 border-t border-gray-200">
          <nav className="space-y-2">
            {bottomMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-4 py-3 text-[#0e04c3] rounded-lg hover:bg-[#3c4191] hover:text-white transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 