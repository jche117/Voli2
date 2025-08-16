'use client';

import { useEffect, useState } from 'react';
import { api, getRoles, assignRoleToUser, revokeRoleFromUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Interfaces
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  full_name: string | null;
  roles: Role[];
}

// Main Component
export default function UserTable() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsersAndRoles = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
  const [usersResponse, rolesResponse] = await Promise.all([
        api.get('/users/', { headers: { Authorization: `Bearer ${token}` } }),
        getRoles(token),
      ]);
  const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];
  // rolesResponse from getRoles is already the array (not an axios response)
  const rolesData = Array.isArray(rolesResponse) ? rolesResponse : [];
      setUsers(usersData);
      setAllRoles(rolesData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.detail || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, [token]);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleRolesChanged = () => {
    fetchUsersAndRoles(); // Refresh data after changes
  };

  if (loading) {
    return <div className="text-center text-xl">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Roles</th>
              <th className="py-2 px-4 border-b">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.full_name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  {user.roles.map(role => role.name).join(', ') || 'None'}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Manage Roles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && selectedUser && (
        <ManageRolesModal
          user={selectedUser}
          allRoles={allRoles}
          onClose={handleCloseModal}
          onRolesChanged={handleRolesChanged}
        />
      )}
    </div>
  );
}

// Modal Component
interface ManageRolesModalProps {
  user: User;
  allRoles: Role[];
  onClose: () => void;
  onRolesChanged: () => void;
}

function ManageRolesModal({ user, allRoles, onClose, onRolesChanged }: ManageRolesModalProps) {
  const { token } = useAuth();
  const [userRoleIds, setUserRoleIds] = useState<Set<number>>(
  new Set((user.roles || []).map(r => r.id))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleCheckboxChange = (roleId: number) => {
    setUserRoleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);

  const originalRoleIds = new Set(user.roles.map(r => r.id));
  const rolesToAssign = Array.from(userRoleIds).filter(id => !originalRoleIds.has(id));
  const rolesToRevoke = Array.from(originalRoleIds).filter(id => !userRoleIds.has(id));

    try {
      await Promise.all([
        ...rolesToAssign.map(roleId => assignRoleToUser(user.id, roleId, token)),
        ...rolesToRevoke.map(roleId => revokeRoleFromUser(user.id, roleId, token)),
      ]);
      onRolesChanged();
      onClose();
    } catch (error) {
      console.error('Failed to update roles:', error);
      alert('Failed to update roles. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4">Manage Roles for {user.full_name}</h3>
        <div className="space-y-2 mb-6">
          {(allRoles || []).map(role => (
            <div key={role.id} className="flex items-center">
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={userRoleIds.has(role.id)}
                onChange={() => handleCheckboxChange(role.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-900">
                {role.name}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}