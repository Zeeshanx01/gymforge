'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateUser = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.age) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingUserId) {
        // Update user
        await updateDoc(doc(db, 'users', editingUserId), newUser);
        setEditingUserId(null);
      } else {
        // Add new user
        await addDoc(collection(db, 'users'), newUser);
      }

      setNewUser({ name: '', email: '', age: '' });
      fetchAllUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEditUser = (user) => {
    setNewUser({ name: user.name, email: user.email, age: user.age });
    setEditingUserId(user.id);
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

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form */}
      <form
        onSubmit={handleAddOrUpdateUser}
        className="bg-stone-800 p-4 mb-6 rounded text-white space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingUserId ? 'Update User' : 'Create New User'}
        </h2>
        <div>
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-stone-700"
          />
        </div>
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-stone-700"
          />
        </div>
        <div>
          <label className="block mb-1">Age:</label>
          <input
            type="number"
            name="age"
            value={newUser.age}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-stone-700"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
      </form>

      {/* Users List */}
      <div className="bg-stone-900 text-white p-4 rounded space-y-4">
        <p><strong>Welcome Message:</strong> Welcome to the Admin Panel!</p>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Users:</h2>
            {users.map((user) => (
              <div
                key={user.id}
                className="border border-white/20 rounded p-3 space-y-1"
              >
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <div className="space-x-2 mt-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </main>
  );
}
