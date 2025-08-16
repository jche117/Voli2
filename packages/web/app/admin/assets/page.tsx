
'use client';

import { useEffect, useState } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset, assignAsset } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import withAuth from '@/components/withAuth';
import AssetForm from '@/components/AssetForm';

interface Asset {
  id: number;
  name: string;
  description: string;
  status: string;
  serial_number: string;
  purchase_date: string;
  assignee_id: number | null;
}

const AssetsPage = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    if (token) {
      try {
        setLoading(true);
        const assetsData = await getAssets(token);
        setAssets(assetsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch assets. You may not have permission to view this page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [token]);

  const handleCreate = () => {
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleDelete = async (assetId: number) => {
    if (token && window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAsset(assetId, token);
        fetchAssets();
      } catch (err) {
        setError('Failed to delete asset.');
        console.error(err);
      }
    }
  };

  const handleSave = async (assetData: any) => {
    if (token) {
      try {
        if (selectedAsset) {
          await updateAsset(selectedAsset.id, assetData, token);
        } else {
          await createAsset(assetData, token);
        }
        fetchAssets();
        setIsModalOpen(false);
        setSelectedAsset(null);
      } catch (err) {
        setError('Failed to save asset.');
        console.error(err);
      }
    }
  };
  
  const handleAssign = async (assetId: number) => {
    if (token) {
        const userId = prompt("Enter the user ID to assign this asset to:");
        if (userId) {
            try {
                await assignAsset(assetId, parseInt(userId), token);
                fetchAssets();
            } catch (err) {
                setError('Failed to assign asset.');
                console.error(err);
            }
        }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Create Asset
        </button>
      </div>

      {isModalOpen && (
        <AssetForm
          asset={selectedAsset}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedAsset(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{asset.name}</h2>
            <p className="text-gray-600">{asset.description}</p>
            <div className="mt-2">
              <p><span className="font-semibold">Serial:</span> {asset.serial_number || 'N/A'}</p>
              <p><span className="font-semibold">Purchased:</span> {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A'}</p>
              <p><span className="font-semibold">Status:</span>
                <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                  asset.status === 'available' ? 'bg-green-200 text-green-800' :
                  asset.status === 'assigned' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {asset.status}
                </span>
              </p>
              <p><span className="font-semibold">Assigned to:</span> {asset.assignee_id || 'Unassigned'}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleAssign(asset.id)} className="text-sm text-green-600">Assign</button>
                <button onClick={() => handleEdit(asset)} className="text-sm text-blue-600">Edit</button>
                <button onClick={() => handleDelete(asset.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(AssetsPage);
