import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { RootState } from './store/store';

import AuthPersist from './FeatureAuth/AuthPersist';
import { AuthPage } from './FeatureAuth/auth';
import ErrorBoundary from './componenet/common/ErrorBoundary';
import HomePage from './componenet/website/homepage';
import ServicesAssistance from './componenet/website/Servicesd\'assistance';
import Contact from './componenet/website/cantact';
import  Homepageclient from './componenet/client/homepageclient';
import  HomePageSuperviseur from './componenet/superviseur/homepagesuperviseur';
import Homepageagent from './componenet/agent/homepageagent';
import GoogleMap from './componenet/website/googlemap';
import NosAgences from './componenet/website/nosagence';
import Navbar from './componenet/client/navbar';
import Profile from './componenet/client/Profile';
import DemanderUnDevis from './componenet/client/demandeundevise';
import CreateContract from './componenet/agent/CreateContract';
import ContractList from './componenet/client/ContractList';
import UsersList from './componenet/agent/UsersList';
// import Chatbot from './componenet/website/chatbot';

// Create a ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { token, user, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated or not authorized
  if (!token || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Placeholder components for new routes
const UnderConstruction = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Page en construction</h1>
          <p className="mt-2 text-gray-600">Cette fonctionnalité sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthPersist>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/services-assistance" element={<ServicesAssistance />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/devis" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <DemanderUnDevis />
                </ProtectedRoute>
              } />
              <Route path="/homepageclient" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Homepageclient />
                </ProtectedRoute>
              } />
              <Route path="/homepagesuperviseur" element={
                <ProtectedRoute allowedRoles={['superviseur']}>
                  <HomePageSuperviseur />
                </ProtectedRoute>
              } />
              
              {/* Agent routes */}
              <Route path="/agent" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <Homepageagent />
                </ProtectedRoute>
              }>
                <Route index element={
                  <div className="text-2xl font-semibold text-gray-800">
                    Bienvenue sur le tableau de bord
                  </div>
                } />
                <Route path="create-contract" element={<CreateContract />} />
                <Route path="utilisateurs" element={<UsersList />} />
              </Route>

              <Route path="/googlemap" element={<GoogleMap />} />
              <Route path="/nos-agences" element={<NosAgences />} />
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['client', 'agent', 'superviseur']}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/mes-contrats" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ContractList />
                </ProtectedRoute>
              } />
              <Route path="/mes-devis" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/assistance" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/mes-sinistres" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/paiement" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/parrainage" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/expertise-auto" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
              <Route path="/faq" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <UnderConstruction />
                </ProtectedRoute>
              } />
            </Routes>
            
            {/* Chatbot positioned at the bottom of the interface */}
            {/* <Chatbot /> */}
          </div>
        </AuthPersist>
      </Router>
    </ErrorBoundary>
  );
}

export default App;