'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRoles, createRole } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function RolesPage() {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAdmin) {
        setError('You are not authorized to view this page.');
        setLoading(false);
        return;
    }

    const fetchRoles = async () => {
      try {
        if (token) {
          const response = await getRoles(token);
          setRoles(response.data);
        }
      } catch (err) {
        setError('Failed to fetch roles.');
      }
      setLoading(false);
    };

    fetchRoles();
  }, [token, router, isAdmin, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    try {
      const response = await createRole({ name: roleName, description }, token);
      setRoles([...roles, response.data]);
      setRoleName('');
      setDescription('');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to create role.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }
  
  if (!isAdmin) {
      return <div className="flex justify-center items-center h-screen"><p className='text-red-500'>{error}</p></div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Roles</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Role</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="roleName" className="block text-gray-700 font-medium mb-2">Role Name</label>
            <input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Create Role
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Existing Roles</h2>
        <ul className="space-y-2">
          {roles.map((role) => (
            <li key={role.id} className="p-4 border border-gray-200 rounded-md">
              <p className="font-bold text-lg">{role.name}</p>
              <p className="text-gray-600">{role.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
