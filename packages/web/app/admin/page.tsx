'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/UserTable';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
}

export default function AdminPage() {
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
        router.push('/'); // Redirect to home if not admin
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <UserTable />
    </div>
  );
}
