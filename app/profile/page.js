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

  // console.log('User:', user);
  // console.log('User:', user.photoURL);
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Your Profile</h1>
            <p className="text-gray-400 mt-1">Manage your account and personal settings.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md transition-all duration-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6 shadow-md">
          {/* Profile Image and Basic Info */}
          <div className="flex items-center gap-5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-700 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-500">
                No Photo
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{user.displayName || 'No display name'}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* More Details */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-1">User ID (UID)</h3>
              <p className="text-gray-400 break-all">{user.uid}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-1">Email Verified</h3>
              <p className="text-gray-400">{user.emailVerified ? 'Yes' : 'No'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-1">Account Created</h3>
              <p className="text-gray-400">{user.metadata?.creationTime || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-1">Last Sign-in</h3>
              <p className="text-gray-400">{user.metadata?.lastSignInTime || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

  );
}
