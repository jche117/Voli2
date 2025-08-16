"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
}

export default function TrainingSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      if (decodedToken.roles && decodedToken.roles.includes('administrator')) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error decoding token or not authenticated:', error);
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Training Settings</h1>
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">Back to dashboard</Link>
          </div>

          <p className="mt-4 text-sm text-gray-600">Configure training modules, completion rules, and certificates here.</p>

        </div>
      </div>
    </div>
  );
}
