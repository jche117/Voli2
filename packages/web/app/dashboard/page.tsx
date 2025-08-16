'use client'

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // withAuth HOC handles redirection, but this is a good explicit check.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
        <h2 className="text-xl font-semibold">Welcome, {user.full_name || user.email}!</h2>
        <p className="mt-2">This is your dashboard. More widgets and information will be available here soon.</p>
        
        {user.roles?.includes('administrator') && (
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);

