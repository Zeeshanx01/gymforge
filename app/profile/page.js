'use client'

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', photoURL: '' });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setFirebaseUser(auth.currentUser);
      } else {
        setFirebaseUser(null);
        setFirestoreUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!firebaseUser) return;

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setFirestoreUser(data);
          setFormData({
            name: data.name || '',
            age: data.age || '',
            photoURL: data.photoURL || ''
          });
        }
      } catch (err) {
        console.error('Error fetching Firestore user data:', err);
      }
    };

    fetchUserData();
  }, [firebaseUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    if (!firebaseUser) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name,
        age: formData.age,
        photoURL: formData.photoURL
      });
      setFirestoreUser((prev) => ({ ...prev, ...formData }));
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
    setIsSaving(false);
  };

  if (!firebaseUser || !firestoreUser) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
          <section className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-semibold">Please wait...</h1>
          </section>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
              {firestoreUser.photoURL ? (
                <Image
                  src={firestoreUser.photoURL}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-gray-700 shadow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-500">
                  No Photo
                </div>
              )}
              <div>
                <h2 className="text-2xl font-semibold">{firestoreUser.name || 'No Name'}</h2>
                <p className="text-gray-400">{firestoreUser.email}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-1">User ID (UID)</h3>
                <p className="text-gray-400 break-all">{firebaseUser.uid}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Email Verified</h3>
                <p className="text-gray-400">{firebaseUser.emailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Role</h3>
                <p className="text-gray-400 capitalize">{firestoreUser.role || 'user'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Account Created</h3>
                <p className="text-gray-400">{firebaseUser.metadata?.creationTime || 'N/A'}</p>
              </div>
            </div>

            {/* Editable Form */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                />
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="Photo URL"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md"
                >
                  {isSaving ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </div>





          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
