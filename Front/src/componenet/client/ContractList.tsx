import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClientContracts, signContract } from '../../store/slice/contractSlice';
import { RootState, AppDispatch } from '../../store/store';
import SignaturePad from 'react-signature-canvas';
import axios from 'axios';

const ContractList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { contracts, loading, error } = useSelector((state: RootState) => state.contract);
    const [selectedContract, setSelectedContract] = useState<number | null>(null);
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        dispatch(getClientContracts());
    }, [dispatch]);

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

    const handleSignContract = async (contractId: number) => {
        setSelectedContract(contractId);
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

            await dispatch(signContract({ contractId: selectedContract, signature: file })).unwrap();
            setShowSignaturePad(false);
            setSelectedContract(null);
            if (signaturePad) {
                signaturePad.clear();
            }
            // Refresh contracts after signing
            dispatch(getClientContracts());
            alert('Contract signed successfully!');
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
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-black">Mes contrats</h2>

            {showSignaturePad && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
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
                                Clair
                            </button>
                            <button
                                onClick={handleSaveSignature}
                                className="px-4 py-2 bg-[#3c4191] text-white rounded-md hover:bg-[#eb3238]"
                            >
                                Enregistrer la signature
                            </button>
                            <button
                                onClick={() => setShowSignaturePad(false)}
                                className="px-4 py-2 bg-[#eb3238] text-white rounded-md hover:bg-[#3c4191]"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {contracts.map(contract => (
                    <div key={contract.id} className="border border-[#3c4191] rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-black">{contract.type}</h3>
                                <p className="text-black">Duration: {contract.duration}</p>
                                <p className="text-black">Status: {contract.status}</p>
                            </div>
                            <div className="space-x-2">
                                {contract.pdfUrl && (
                                    <button
                                        onClick={() => handleViewPdf(contract.pdfUrl)}
                                        className="px-4 py-2 bg-[#3c4191] text-white rounded-md hover:bg-[#eb3238]"
                                    >
                                        Voir PDF
                                    </button>
                                )}
                                {contract.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleSignContract(contract.id)}
                                        className="px-4 py-2 bg-[#3c4191] text-white rounded-md hover:bg-[#eb3238]"
                                    >
                                        Sign Contract
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-black">{contract.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContractList;