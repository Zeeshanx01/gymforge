// app/profile/page.js

'use client'
// This page displays the user's profile information and allows them to edit their details.
// It also includes functionality for uploading an avatar image.

import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

export default function Profile() {

  // State variables
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '' });
  const [editMode, setEditMode] = useState({ name: false, age: false });
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();




  // Listen for Firebase auth state changes
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




  // Fetch user data from Firestore when firebaseUser changes
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
            age: data.age || ''
          });
        }
      } catch (err) {
        console.error('Error fetching Firestore user data:', err);
      }
    };

    fetchUserData();
  }, [firebaseUser]);



  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  // Toggle edit mode for a field
  const toggleEdit = (field) => {
    if (editMode[field]) {
      handleSave(field); // save on toggle off
    }
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };



  // Handle saving changes to Firestore
  const handleSave = async (field) => {
    if (!firebaseUser) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, { [field]: formData[field] });
      setFirestoreUser((prev) => ({ ...prev, [field]: formData[field] }));
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
    setIsSaving(false);
  };











  // Handle image upload
  const handleImageUpload = async (e) => {
    if (!firebaseUser || !e.target.files[0]) return;
    setUploading(true);

    const file = e.target.files[0];
    try {
      const res = await fetch('/api/avatar/upload', {
        method: 'POST',
        headers: { 'x-filename': file.name },
        body: file,
      });
      const blob = await res.json();

      // Save URL to Firestore
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        photoURL: blob.url,
      });

      setFirestoreUser((prev) => ({ ...prev, photoURL: blob.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUploading(false);
  };

  // Handle delete image
  const handleDeleteImage = async () => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        photoURL: ''
      });
      setFirestoreUser((prev) => ({ ...prev, photoURL: '' }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
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
            <div className="flex flex-wrap items-center gap-5">



              <div className="flex items-center gap-5">


                <div className="relative group w-24 h-24">
                  {firestoreUser.photoURL ? (
                    <>
                      <Image
                        src={firestoreUser.photoURL}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full border-2 border-gray-700 shadow cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <FaPencilAlt className="text-white text-lg" />
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-sm text-gray-500 cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      No Photo
                    </div>
                  )}
                </div>



              </div>



              <div className='w-fit'>
                {/* Name */}
                <div className="flex items-center gap-2">
                  {editMode.name ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-800 text-white px-3 py-2 rounded-md"
                      />
                      <button onClick={() => toggleEdit('name')}>💾</button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold">{firestoreUser.name || 'No Name'}</h2>
                      <button onClick={() => toggleEdit('name')}>✏️</button>
                    </>
                  )}
                </div>


                <p className="text-gray-400">{firestoreUser.email}</p>

              </div>



            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Age */}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium mb-1">Age:</h3>
                {editMode.age ? (
                  <>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md"
                    />
                    <button onClick={() => toggleEdit('age')}>💾</button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">{firestoreUser.age || 'N/A'}</p>
                    <button onClick={() => toggleEdit('age')}>✏️</button>
                  </>
                )}
              </div>

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
              <div>
                <h3 className="text-lg font-medium mb-1">Last Sign-in</h3>
                <p className="text-gray-400">{firebaseUser.metadata?.lastSignInTime || 'N/A'}</p>
              </div>
            </div>
          </div>


















        </section>
      </main>



      {/* Modal for full view */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-md relative max-w-xs w-full text-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <IoClose size={20} />
            </button>
            {firestoreUser.photoURL ? (
              <Image
                src={firestoreUser.photoURL}
                alt="Full Profile"
                width={300}
                height={300}
                className="rounded-md mx-auto"
              />
            ) : (
              <div className="w-60 h-60 bg-gray-800 flex items-center justify-center text-gray-500 mx-auto rounded-md">
                No Photo
              </div>
            )}
            <div className="flex gap-3 mt-4 justify-center">
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                Edit
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleDeleteImage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
            {uploading && <p className="text-gray-400 mt-2">Uploading...</p>}
          </div>
        </div>
      )}


    </ProtectedRoute>
  );
}
