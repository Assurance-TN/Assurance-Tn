import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './Sidebar';
import { getAvailableContracts, signContract } from '../../store/slice/contractSlice';
import { RootState, AppDispatch } from '../../store/store';
import { 
  TruckIcon, 
  HomeIcon, 
  PaperAirplaneIcon, 
  HeartIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import SignaturePad from 'react-signature-canvas';

interface Contract {
  id: number;
  type: string;
  description: string;
  duration: string;
  pdfUrl: string;
  status: string;
}

const ContractIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'AUTO': TruckIcon,
    'HABITATION': HomeIcon,
    'VOYAGE': PaperAirplaneIcon,
    'SANTE': HeartIcon,
    'ACCIDENT': ShieldCheckIcon
  };

  const Icon = iconMap[type];
  if (!Icon) return null;

  return <Icon className="w-6 h-6 text-white" />;
};

export default function DemanderUnDevis() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { contracts, loading, error } = useSelector((state: RootState) => state.contract);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);

  useEffect(() => {
    dispatch(getAvailableContracts());
  }, [dispatch]);

  const handleViewPdf = async (pdfUrl: string) => {
    try {
      const cleanPdfUrl = pdfUrl.split(':')[0].replace(/^\/+/, '');
      const fullUrl = `http://localhost:3000/uploads/${cleanPdfUrl.replace('uploads/', '')}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/pdf',
        }
      });

      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Error viewing PDF:', err);
      alert('Failed to load PDF file');
    }
  };

  const handleSelectContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowSignaturePad(true);
  };

  const handleClearSignature = () => {
    if (signaturePad) {
      signaturePad.clear();
    }
  };

  const handleSaveSignature = async () => {
    if (!signaturePad || !selectedContract) return;

    try {
      const signatureData = signaturePad.toDataURL();
      const blob = await fetch(signatureData).then(res => res.blob());
      const file = new File([blob], 'signature.png', { type: 'image/png' });

      await dispatch(signContract({ contractId: selectedContract.id, signature: file })).unwrap();
      setShowSignaturePad(false);
      setSelectedContract(null);
      if (signaturePad) {
        signaturePad.clear();
      }
      navigate('/mes-contrats');
    } catch (error) {
      console.error('Failed to sign contract:', error);
      alert('Failed to sign contract. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-black">Choisir un contrat</h1>
              <p className="mt-2 text-black">
                Sélectionnez un contrat parmi les options disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-[#3c4191]"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#3c4191] rounded-full flex items-center justify-center">
                      <ContractIcon type={contract.type} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{contract.type}</h3>
                      <p className="text-sm text-black">Duration: {contract.duration}</p>
                    </div>
                  </div>
                  <p className="text-black mb-4">{contract.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewPdf(contract.pdfUrl)}
                      className="text-black hover:text-[#3c4191]"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => handleSelectContract(contract)}
                      className="px-4 py-2 bg-[#3c4191] text-white rounded-md hover:bg-[#eb3238]"
                    >
                      Select Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showSignaturePad && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4 text-black">Sign Contract</h3>
                  <div className="border border-[#3c4191] rounded-lg mb-4">
                    <SignaturePad
                      ref={ref => setSignaturePad(ref)}
                      canvasProps={{
                        className: 'w-full h-48'
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleClearSignature}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-black"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSaveSignature}
                      className="px-4 py-2 bg-[#3c4191] text-white rounded-md hover:bg-[#eb3238]"
                    >
                      Save Signature
                    </button>
                    <button
                      onClick={() => setShowSignaturePad(false)}
                      className="px-4 py-2 bg-[#eb3238] text-white rounded-md hover:bg-[#3c4191]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
