'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const { user, role, loading } = useAuth(); // assuming useAuth handles loading

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'admin') {
        router.push('/unauthorized');
      }
    }
  }, [user, role, loading, router]);

  if (loading || !user || role !== 'admin') {
    return <p>Checking permissions...</p>;
  }

  return children;
}
