import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import AdminProfile from "./components/adminprofile";
import UserList from "./components/UserList";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Aperçu  dashboard</h2>
              {/* Add your dashboard content here */}
            </div>
          } />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        
        <Route path="/users" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<UserList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;