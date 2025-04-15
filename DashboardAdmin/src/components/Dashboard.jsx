import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile } from "../store/redux/authSlice";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import axios from 'axios';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    agents: 0,
    superviseurs: 0
  });

  useEffect(() => {
    if (!user || role !== 'admin') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  // Add effect to fetch current user data when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:3000/api/users/current', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          dispatch(updateProfile({ user: response.data }));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  // Fetch all users for statistics
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:3000/api/users/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
        
        // Calculate statistics
        const userStats = {
          total: response.data.length,
          clients: response.data.filter(user => user.role === 'client').length,
          agents: response.data.filter(user => user.role === 'agent').length,
          superviseurs: response.data.filter(user => user.role === 'superviseur').length
        };
        setStats(userStats);
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && role === 'admin') {
      fetchUsers();
    }
  }, [user, role]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate("/login");
  };

  if (!user || role !== 'admin') {
    return null;
  }

  // Data for pie chart
  const pieData = [
    { name: 'Clients', value: stats.clients, color: '#3B82F6' },
    { name: 'Agents', value: stats.agents, color: '#10B981' },
    { name: 'Superviseurs', value: stats.superviseurs, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  // Data for bar chart - last 5 registered users
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(user => ({
      name: user.userName,
      value: 1,
      role: user.role,
      color: user.role === 'client' ? '#3B82F6' : 
             user.role === 'agent' ? '#10B981' : '#F59E0B'
    }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800"> Assurance  TN </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Admin: {user?.userName || 'Admin'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img
                  src={user?.imageUrl || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.userName || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transform ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      navigate('/dashboard/profile');
                      setIsProfileOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                   Modifier le profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                   Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/dashboard' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>

              <button
                onClick={() => navigate('/users')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/users' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Utilisateurs
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6 px-8">
            {location.pathname === '/dashboard' ? (
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Aperçu  dashboard</h2>
                
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                      </div>
                    )}
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Nombre total d'utilisateurs</h3>
                            <p className="text-3xl font-semibold text-gray-700">{stats.total}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Clients</h3>
                            <p className="text-3xl font-semibold text-gray-700">{stats.clients}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Agents</h3>
                            <p className="text-3xl font-semibold text-gray-700">{stats.agents}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Superviseurs</h3>
                            <p className="text-3xl font-semibold text-gray-700">{stats.superviseurs}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Pie Chart */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Répartition des utilisateurs</h3>
                          <Link to="/users" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Tout voir
                          </Link>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Recent Users */}
                      <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Utilisateurs récents</h3>
                          <Link to="/users" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                          Tout voir
                          </Link>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {recentUsers.map((user, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      user.role === 'client' ? 'bg-blue-100 text-blue-800' :
                                      user.role === 'agent' ? 'bg-green-100 text-green-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {users.find(u => u.userName === user.name)?.email || ''}
                                  </td>
                                </tr>
                              ))}
                              {recentUsers.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                    No users found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;