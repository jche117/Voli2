'use client';

import { Cog, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // close dropdowns on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsRoleDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center">
            <div className="flex items-center space-x-4">
              {/* Settings Icon & Dropdown */}
              <div className="relative">
                <button
                  title="Settings"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  onBlur={() => setTimeout(() => setIsSettingsOpen(false), 150)}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Cog className="h-6 w-6" />
                </button>
                {isSettingsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="px-4 py-2 text-xs text-gray-400">SETTINGS</div>
                    <Link href="/settings/organisation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Organisation
                    </Link>
                    <Link href="/settings/tasks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Tasks
                    </Link>
                    <Link href="/settings/assets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Assets
                    </Link>
                    <Link href="/settings/training" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Training
                    </Link>
                  </div>
                )}
              </div>

              {/* Role Icon & Dropdown */}
              <div className="relative">
                <button
                  title="Your Roles"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsRoleDropdownOpen(false), 150)}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Shield className="h-6 w-6" />
                </button>
                {isRoleDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div className="px-4 py-2 text-xs text-gray-400">YOUR ROLES</div>
                    {user?.roles && user.roles.length > 0 ? (
                      user.roles.map((role) =>
                        role.toLowerCase() === 'administrator' ? (
                          <Link key={role} href="/admin" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 capitalize">
                            {role}
                          </Link>
                        ) : (
                          <span key={role} className="block px-4 py-2 text-sm text-gray-700 capitalize">
                            {role}
                          </span>
                        )
                      )
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-500">No roles assigned</span>
                    )}
                  </div>
                )}
              </div>

              {/* Person Icon */}
              <button title="View Profile" onClick={() => setIsProfileModalOpen(true)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <User className="h-6 w-6" />
              </button>

              {/* Logout Icon */}
              <button title="Logout" onClick={handleLogout} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </>
  );
}
