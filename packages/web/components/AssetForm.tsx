'use client';

import { useState, useEffect } from 'react';
import { createAsset, updateAsset } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Interface for Asset data
interface Asset {
  id?: number;
  name: string;
  description: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  status: string;
  assignee_id?: number | null;
}

// Props for the form component
interface AssetFormProps {
  asset: Asset | null; // Asset to edit, or null for creating
  onClose: () => void;
  onAssetSaved: () => void;
}

const AssetForm = ({ asset, onClose, onAssetSaved }: AssetFormProps) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<Omit<Asset, 'id'> & { id?: number }> ({
    name: '',
    description: '',
    serial_number: '',
    purchase_date: '',
    status: 'available', // Default status
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        ...asset,
        purchase_date: asset.purchase_date ? new Date(asset.purchase_date).toISOString().split('T')[0] : '',
      });
    } else {
      // Reset form for creation
      setFormData({
        name: '',
        description: '',
        serial_number: '',
        purchase_date: '',
        status: 'available',
      });
    }
  }, [asset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required.');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      if (formData.id) {
        // Update existing asset
        await updateAsset(formData.id, formData, token);
      } else {
        // Create new asset
        await createAsset(formData, token);
      }
      onAssetSaved();
    } catch (err: any) {
      console.error('Failed to save asset:', err);
      setError(err.response?.data?.detail || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{asset ? 'Edit Asset' : 'Create Asset'}</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">Serial Number</label>
              <input
                type="text"
                name="serial_number"
                id="serial_number"
                value={formData.serial_number || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                id="purchase_date"
                value={formData.purchase_date || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-300"
            >
              {isSaving ? 'Saving...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;