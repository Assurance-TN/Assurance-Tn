import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    role: "",
    CIN: '',
    adresse: '',
    numéroTéléphone: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number field
    if (name === 'numéroTéléphone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 8 digits
      const formattedValue = digitsOnly.slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } 
    // Special handling for CIN field
    else if (name === 'CIN') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 8 digits
      const formattedValue = digitsOnly.slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      console.log('Image selected:', file.name, file.type, file.size);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      userName: '',
      email: '',
      password: '',
      role: 'client',
      CIN: '',
      adresse: '',
      numéroTéléphone: ''
    });
    setImage(null);
    setImagePreview(null);
  };

  // Open add user modal
  const openAddModal = () => {
    resetForm();
    setError(null);
    setShowAddModal(true);
  };

  // Open edit user modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setError(null);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: '', // Don't set password in edit mode
      role: user.role,
      CIN: user.CIN,
      adresse: user.adresse,
      numéroTéléphone: user.numéroTéléphone
    });
    if (user.imageUrl) {
      setImagePreview(user.imageUrl);
    }
    setShowEditModal(true);
  };

  // Close any modal
  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setConfirmDelete(null);
    setError(null);
    resetForm();
  };

  // Handle add user form submission
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Clear previous errors
      const token = localStorage.getItem('token');
      
      // Basic validation
      if (!formData.userName) throw new Error('User name is required');
      if (!formData.email) throw new Error('Email is required');
      if (!formData.password) throw new Error('Password is required');
      if (!formData.CIN) throw new Error('CIN is required');
      if (!formData.adresse) throw new Error('Address is required');
      if (!formData.numéroTéléphone) throw new Error('Phone number is required');
      
      // Additional validation
      if (formData.CIN.length !== 8) throw new Error('CIN must be 8 digits');
      if (formData.numéroTéléphone.length !== 8) throw new Error('Phone number must be 8 digits');
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) throw new Error('Please enter a valid email address');
      
      // *** DIRECT APPROACH: Try calling registerUser directly ***
      console.log('*** TRYING DIRECT APPROACH: registerUser ***');
      try {
        // This matches the structure expected by the registerUser function
        const directData = {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          CIN: formData.CIN,
          adresse: formData.adresse,
          numéroTéléphone: formData.numéroTéléphone
        };
        
        console.log('Direct register data:', directData);
        
        const directResponse = await axios.post(
          'http://localhost:3000/api/users/register',
          directData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('User registered directly:', directResponse.data);
        closeModal();
        fetchUsers();
        alert('User added successfully');
        return;
      } catch (directError) {
        console.error('Direct register approach failed:', directError);
        // Continue to next approach if this fails
      }
      
      // **** APPROACH 1: TRY WITH STANDARD JSON ****
      // Create pure JSON data object without FormData
      // This matches exactly what the backend expects in req.body
      const jsonData = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        CIN: formData.CIN,
        adresse: formData.adresse,
        // Try different formats for the phone number
        numéroTéléphone: formData.numéroTéléphone,
        numeroTelephone: formData.numéroTéléphone,
        "numéroTéléphone": formData.numéroTéléphone, // quoted key
        phoneNumber: formData.numéroTéléphone, // alternative name
        // Use a temporary imageUrl for testing
        imageUrl: null
      };
      
      console.log('*** APPROACH 1: JSON data: ***', jsonData);

      // If there's no image, just send the JSON directly
      if (!image) {
        try {
          const response = await axios.post(
            'http://localhost:3000/api/users/add',
            jsonData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('User created successfully with JSON:', response.data);
          
          closeModal();
          fetchUsers();
          alert('User added successfully');
          return; // Exit the function early
        } catch (jsonError) {
          console.error('JSON approach failed:', jsonError);
          const errorDetail = jsonError.response?.data || {};
          console.error('Error response data from JSON approach:', errorDetail);
          
          // If this fails, try the FormData approach below
        }
      }

      // **** APPROACH 2: TRY WITH FORMDATA + FILE ****
      console.log('*** APPROACH 2: FormData + File ***');
      const formDataObj = new FormData();
      
      // Add each field individually
      formDataObj.append('userName', formData.userName);
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('role', formData.role);
      formDataObj.append('CIN', formData.CIN);
      formDataObj.append('adresse', formData.adresse);
      
      // Add phone with different formats to test
      formDataObj.append('numéroTéléphone', formData.numéroTéléphone);
      formDataObj.append('numeroTelephone', formData.numéroTéléphone);
      formDataObj.append('phoneNumber', formData.numéroTéléphone);
      
      // Only append image if selected
      if (image) {
        formDataObj.append('image', image);
      }

      // Show FormData contents
      console.log('FormData entries:');
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[0] === 'image' ? '[File]' : pair[1]);
      }

      try {
        const formResponse = await axios.post(
          'http://localhost:3000/api/users/add',
          formDataObj,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Success with FormData approach:', formResponse.data);
        
        closeModal();
        fetchUsers();
        alert('User added successfully');
        return;
      } catch (formError) {
        console.error('FormData approach failed:', formError);
        const errorDetail = formError.response?.data || {};
        console.error('Error response data from FormData approach:', errorDetail);
        throw formError; // Re-throw to be caught by the outer catch block
      }
      
    } catch (err) {
      console.error('All approaches failed:', err);
      // Show more detailed error information including the response data
      const errorDetail = err.response?.data || {};
      console.error('Final error response data:', errorDetail);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add user';
      setError(errorMessage);
    }
  };

  // Handle update user form submission
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError(null); // Clear previous errors
      const token = localStorage.getItem('token');
      
      // Basic validation
      if (!formData.userName) throw new Error('User name is required');
      if (!formData.email) throw new Error('Email is required');
      if (!formData.CIN) throw new Error('CIN is required');
      if (!formData.adresse) throw new Error('Address is required');
      if (!formData.numéroTéléphone) throw new Error('Phone number is required');
      
      // Additional validation
      if (formData.CIN.length !== 8) throw new Error('CIN must be 8 digits');
      if (formData.numéroTéléphone.length !== 8) throw new Error('Phone number must be 8 digits');
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) throw new Error('Please enter a valid email address');
      
      // Create FormData object for the request
      const formDataObj = new FormData();
      formDataObj.append('userName', formData.userName);
      formDataObj.append('email', formData.email);
      formDataObj.append('role', formData.role);
      formDataObj.append('CIN', formData.CIN);
      formDataObj.append('adresse', formData.adresse);
      formDataObj.append('numéroTéléphone', formData.numéroTéléphone);
      
      // Only append password if provided
      if (formData.password) {
        formDataObj.append('password', formData.password);
      }
      
      // Only append image if selected
      if (image) {
        formDataObj.append('image', image);
      }

      console.log('Updating with data:', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password ? '********' : undefined,
        role: formData.role,
        CIN: formData.CIN,
        adresse: formData.adresse,
        numéroTéléphone: formData.numéroTéléphone,
        hasImage: !!image
      });

      const response = await axios.put(
        `http://localhost:3000/api/users/${selectedUser.id}`,
        formDataObj,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Let axios set the Content-Type to multipart/form-data automatically
          }
        }
      );

      console.log('Update response:', response.data);
      
      // Close modal and refresh user list
      closeModal();
      fetchUsers(); // Refresh the user list to get the latest data
      // Show success toast
      alert('User updated successfully');
    } catch (err) {
      console.error('Error details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMessage);
      console.error('Error updating user:', err);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove user from list
      setUsers(prev => prev.filter(user => user.id !== id));
      setConfirmDelete(null);
      // Show success toast
      alert('User deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordonnées</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.imageUrl || "https://via.placeholder.com/40"}
                        alt={user.userName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/40";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'agent' ? 'bg-green-100 text-green-800' : 
                      user.role === 'superviseur' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.adresse}</div>
                  <div className="text-sm text-gray-500">{user.numéroTéléphone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.CIN}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openEditModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                  Modifier
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Ajouter un nouvel utilisateur</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  {/* User Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input
                      type="text"
                      name="userName"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="client">Client</option>
                      <option value="agent">Agent</option>
                      <option value="superviseur">Superviseur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CIN (8 digits)</label>
                    <input
                      type="text"
                      name="CIN"
                      required
                      pattern="[0-9]{8}"
                      title="CIN must be 8 digits"
                      value={formData.CIN}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro de téléphone (8 chiffres)</label>
                    <input
                      type="text"
                      name="numéroTéléphone"
                      required
                      pattern="[0-9]{8}"
                      title="Phone number must be 8 digits"
                      value={formData.numéroTéléphone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter 8-digit phone number"
                    />
                    {/* <small className="text-gray-500">Format: 8 digits (e.g., 54144303)</small> */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-1 w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                    {/* <small className="text-gray-500">Maximum file size: 5MB</small> */}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                  Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                 Ajouter un utilisateur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Modifier l'utilisateur</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  {/* User Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Name</label>
                    <input
                      type="text"
                      name="userName"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="client">Client</option>
                      <option value="agent">Agent</option>
                      <option value="superviseur">Superviseur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CIN (8 digits)</label>
                    <input
                      type="text"
                      name="CIN"
                      required
                      pattern="[0-9]{8}"
                      title="CIN must be 8 digits"
                      value={formData.CIN}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="adresse"
                      required
                      value={formData.adresse}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number (8 digits)</label>
                    <input
                      type="text"
                      name="numéroTéléphone"
                      required
                      pattern="[0-9]{8}"
                      title="Phone number must be 8 digits"
                      value={formData.numéroTéléphone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter 8-digit phone number"
                    />
                    <small className="text-gray-500">Format: 8 digits (e.g., 54144303)</small>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-1 w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                    <small className="text-gray-500">Maximum file size: 5MB</small>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(confirmDelete)}
                  className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
