'use client';

import RequireAdmin from '@/components/RequireAdmin';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', role: 'user' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      querySnapshot.forEach((docSnap) => {
        usersData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setFormData({ name: user.name || '', age: user.age || '', role: user.role || 'user' });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!editingUserId) return;
    try {
      await updateDoc(doc(db, 'users', editingUserId), formData);
      setEditingUserId(null);
      setFormData({ name: '', age: '', role: 'user' });
      fetchAllUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter((u) => u.uid !== currentUser?.uid);

  return (
    <RequireAdmin>
      <main className="p-6 bg-gray-950 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        {/* Logged in user info */}
        {currentUser && (
          <div className="mb-8 p-4 bg-gray-800 rounded border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Current Admin (You)</h2>
            <p><strong>Name:</strong> {currentUser.displayName}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>UID:</strong> {currentUser.uid}</p>
          </div>
        )}

        {/* Users */}
        <div className="space-y-4  ">
          <h2 className="text-2xl font-semibold mb-2">All Users</h2>


          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>



            {loading ? (
              <p>Loading users...</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded border border-gray-700 bg-gray-900"
                >
                  <div className="flex gap-4 items-start mb-3">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    <div>
                      {editingUserId === user.id ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-gray-700 rounded px-2 py-1 text-white mb-2 block"
                            placeholder="Name"
                          />
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="bg-gray-700 rounded px-2 py-1 text-white mb-2 block"
                            placeholder="Age"
                          />
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="bg-gray-700 rounded px-2 py-1 text-white mb-2 block"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 px-3 py-1 rounded mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="bg-gray-600 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <p><strong>Name:</strong> {user.name}</p>
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Age:</strong> {user.age || 'N/A'}</p>
                          <p><strong>UID:</strong> {user.uid}</p>
                          <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                          <p><strong>Role:</strong> {user.role}</p>
                          <p><strong>Created:</strong> {user.createdAt || 'N/A'}</p>
                          <p><strong>Last Sign-in:</strong> {user.lastLogin || 'N/A'}</p>
                          <div className="mt-2 space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-yellow-600 px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

          </div>




        </div>
      </main>
    </RequireAdmin>
  );
}
