import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../store/slice/authslice';
import { AppDispatch, RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

interface AuthTabProps {
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
}

const AuthTabs = ({ activeTab, setActiveTab }: AuthTabProps) => (
  <div className="flex space-x-1 bg-blue-50 p-1 rounded-lg mb-8">
    <button
      className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
        activeTab === 'login'
          ? 'bg-blue-600 text-white shadow-md transform scale-105'
          : 'text-blue-700 hover:bg-blue-100'
      }`}
      onClick={() => setActiveTab('login')}
    >
      Sign In
    </button>
    <button
      className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
        activeTab === 'register'
          ? 'bg-blue-600 text-white shadow-md transform scale-105'
          : 'text-blue-700 hover:bg-blue-100'
      }`}
      onClick={() => setActiveTab('register')}
    >
      Sign Up
    </button>
  </div>
);

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome to Assurance TN</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
        
        <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [formError, setFormError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please fill in all fields');
      }

      const result = await dispatch(loginUser(credentials)).unwrap();
      console.log('Login result:', result);

      if (result.user && result.token) {
        switch (result.user.role) {
          case 'client':
            navigate('/homepageclient');
            break;
          case 'superviseur':
            navigate('/homepagesuperviseur');
            break;
          case 'agent':
            navigate('/homepageagent');
            break;
          default:
            throw new Error('Invalid user role');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setFormError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || formError) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
          <p className="text-red-700">{error || formError}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200 transform hover:scale-[1.02]"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    userName: '',
    email: '',
    password: '',
    imageUrl: '',
    CIN: '',
    adresse: '',
    numéroTéléphone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(registerUser({ 
        ...credentials, 
        role: 'client'
      }));
      
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="userName"
            type="text"
            required
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your full name"
            value={credentials.userName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Create a password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="CIN" className="block text-sm font-medium text-gray-700 mb-1">
            CIN (National ID)
          </label>
          <input
            id="CIN"
            name="CIN"
            type="text"
            required
            pattern="[0-9]{8}"
            maxLength={8}
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your 8-digit CIN"
            value={credentials.CIN}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="adresse"
            name="adresse"
            type="text"
            required
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your address"
            value={credentials.adresse}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="numéroTéléphone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="numéroTéléphone"
            name="numéroTéléphone"
            type="tel"
            required
            pattern="[0-9]{8}"
            maxLength={8}
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter your 8-digit phone number"
            value={credentials.numéroTéléphone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image URL (optional)
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter image URL"
            value={credentials.imageUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

// Update the exports
export { AuthPage as Login, AuthPage as Register };