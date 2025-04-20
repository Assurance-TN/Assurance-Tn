import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import axios from 'axios';

interface Contract {
  id: number;
  type: string;
  status: string;
  pdfUrl?: string;
}

interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  imageUrl?: string;
  CIN?: string;
  adresse?: string;
  numéroTéléphone?: string;
  createdAt?: string;
  contracts?: Contract[];
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleViewPdf = async (pdfUrl: string) => {
    try {
      console.log('Original PDF URL:', pdfUrl);
      
      // Clean the URL and ensure proper formatting
      const cleanPdfUrl = pdfUrl.split(':')[0].replace(/^\/+/, '');
      const fullUrl = `http://localhost:3000/uploads/${cleanPdfUrl.replace('uploads/', '')}`;
      
      console.log('Cleaned URL:', fullUrl);

      // Fetch the PDF with authentication
      const response = await axios({
        method: 'GET',
        url: fullUrl,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
        responseType: 'blob',
      });

      // Validate the response
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF received');
      }

      // Create a blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Open in a new window
      window.open(blobUrl, '_blank');

      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);

    } catch (err: any) {
      console.error('Error viewing PDF:', {
        error: err,
        response: err.response,
        url: pdfUrl
      });

      let errorMessage = 'Failed to load PDF file';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'PDF file not found';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied to PDF file';
        } else {
          errorMessage = `Error: ${err.response.status} - ${err.response.statusText}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/users/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUsers(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-black">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-[#eb3238] text-white px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">All Users</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user: User) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-[#3c4191]"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#3c4191] rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {user.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">{user.userName}</h3>
                <p className="text-sm text-black">{user.email}</p>
                <p className="text-sm text-black capitalize">{user.role}</p>
                {user.CIN && <p className="text-sm text-black">CIN: {user.CIN}</p>}
                {user.adresse && <p className="text-sm text-black">Address: {user.adresse}</p>}
                {user.numéroTéléphone && <p className="text-sm text-black">Phone: {user.numéroTéléphone}</p>}
              </div>
            </div>

            {user.contracts && user.contracts.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-black">Contracts</h4>
                <div className="space-y-2">
                  {user.contracts.map((contract: Contract) => (
                    <div
                      key={contract.id}
                      className="p-3 bg-[#3c4191] bg-opacity-10 rounded-md"
                    >
                      <p className="font-medium text-black">{contract.type}</p>
                      <p className="text-sm text-black">Status: {contract.status}</p>
                      {contract.pdfUrl && (
                        <button
                          onClick={() => handleViewPdf(contract.pdfUrl!)}
                          className="mt-2 text-white bg-[#3c4191] hover:bg-[#0e04c3] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          View Contract PDF
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList; 