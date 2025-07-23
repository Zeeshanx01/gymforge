'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];

        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="bg-stone-900 text-white p-4 rounded space-y-2">
        <p><strong>Welcome Message:</strong> Welcome to the Admin Panel!</p>

        {users.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">All Users:</h2>
            {users.map((user) => (
              <div key={user.id} className="border-b border-white/20 pb-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading users...</p>
        )}
      </div>
    </main>
  );
}
