import { useEffect, useState } from 'react';
import { getAssets, deleteAsset, createAsset, updateAsset } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import AssetForm from './AssetForm';

// Interfaces
interface Asset {
  id: number;
  name: string;
  description: string | null;
  serial_number: string | null;
  status: string;
  assignee_id: number | null;
  purchase_date: string | null;
}

// Main Component
export default function AssetsTable() {
  const { token } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await getAssets(token);
      setAssets(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching assets:', err);
      setError(err.response?.data?.detail || 'Failed to fetch assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [token]);

  const handleOpenModal = (asset: Asset | null) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSaveAsset = async (assetData: any) => {
    if (token) {
      try {
        if (selectedAsset) {
          await updateAsset(selectedAsset.id, assetData, token);
        } else {
          await createAsset(assetData, token);
        }
        fetchAssets();
        handleCloseModal();
      } catch (err) {
        setError('Failed to save asset.');
        console.error(err);
      }
    }
  };

  const handleDelete = async (assetId: number) => {
    if (!token) return;
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAsset(assetId, token);
        fetchAssets(); // Refresh list
      } catch (error) {
        console.error('Failed to delete asset:', error);
        alert('Failed to delete asset.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading assets...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Asset List</h2>
        <button 
          onClick={() => handleOpenModal(null)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Asset
        </button>
      </div>
      {assets.length === 0 ? (
        <p className="text-center text-gray-600">No assets found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Serial Number</th>
              <th className="py-2 px-4 border-b">Assignee ID</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{asset.id}</td>
                <td className="py-2 px-4 border-b">{asset.name}</td>
                <td className="py-2 px-4 border-b">{asset.status}</td>
                <td className="py-2 px-4 border-b">{asset.serial_number || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{asset.assignee_id || 'Unassigned'}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button 
                    onClick={() => handleOpenModal(asset)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(asset.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <AssetForm
          asset={selectedAsset}
          onSave={handleSaveAsset}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}
