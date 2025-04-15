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
// import Chatbot from './componenet/website/chatbot';

// Create a ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthPersist>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/services-assistance" element={<ServicesAssistance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devis" element={<Contact />} />
            <Route path='/homepageclient' element={<Homepageclient/>} />
            <Route path='/homepagesuperviseur' element={<HomePageSuperviseur />} />
            <Route path='/homepageagent' element={<Homepageagent />} />
            <Route path='/googlemap' element={<GoogleMap />} />
            <Route path='/nos-agences' element={<NosAgences />} />
          </Routes>
          
          {/* Chatbot positioned at the bottom of the interface */}
          {/* <Chatbot /> */}
        </AuthPersist>
      </Router>
    </ErrorBoundary>
  );
}

export default App;