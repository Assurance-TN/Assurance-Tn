import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createContract } from '../../store/slice/contractSlice';
import { RootState } from '../../store/store';

const CreateContract = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.contract);
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        duration: '6_MONTHS'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createContract(formData)).unwrap();
            // Reset form
            setFormData({
                type: '',
                description: '',
                clientName: '',
                clientEmail: '',
                clientAddress: '',
                duration: '6_MONTHS'
            });
            alert('Contract created successfully!');
        } catch (error) {
            console.error('Failed to create contract:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Contract</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contract Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a type</option>
                        <option value="SANTE">Santé</option>
                        <option value="AUTO">Auto</option>
                        <option value="SCOLAIRE">Scolaire</option>
                        <option value="TRANSPORT_MARCHANDISE">Transport Marchandise</option>
                        <option value="VOYAGE">Voyage</option>
                        <option value="HABITATION">Habitation</option>
                        <option value="ACCIDENT">Accident</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Client Email</label>
                    <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Client Address</label>
                    <input
                        type="text"
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="6_MONTHS">6 Months</option>
                        <option value="1_YEAR">1 Year</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Contract'}
                </button>
            </form>
        </div>
    );
};

export default CreateContract; 