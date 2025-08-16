'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import withAuth from '@/components/withAuth';
import TemplateManager from '@/components/TemplateManager';

interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
}

function TemplatesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      if (!decodedToken.roles || !decodedToken.roles.includes('administrator')) {
        router.push('/dashboard'); // Redirect if not admin
      }
    } catch (error) {
      console.error('Invalid token', error);
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Task Template Management</h1>
      <TemplateManager />
    </div>
  );
}

export default withAuth(TemplatesPage);
