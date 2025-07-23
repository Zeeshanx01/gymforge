'use client'

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // make sure this path is correct
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-semibold">You are not logged in</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
      <section className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Your Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-400 mb-4">Manage your account and personal settings.</p>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Display Name</h2>
            <p className="text-gray-400">{user.displayName || 'Not provided'}</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">User ID (UID)</h2>
            <p className="text-gray-400">{user.uid}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
