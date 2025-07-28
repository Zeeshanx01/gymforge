// lib/addUserToFirestore.js
// This function adds a user to Firestore if they do not already exist.
// It also assigns a role based on the user's email.

import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const addUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  // Only create new user document if it doesn't already exist
  if (!userSnap.exists()) {
    let role = 'user';

    // Assign admin role if email is in env list
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv.split(',').map(email => email.trim());
    if (adminEmails.includes(user.email)) {
      role = 'admin';
    }

    // Create the user with default info
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      email: user.email,
      emailVerified: user.emailVerified, // ✅ Add this line
      photoURL: user.photoURL || '',
      role: role,
      createdAt: new Date().toISOString(),
    });
  } else {
    // Update only the emailVerified field
    await setDoc(userRef, {
      emailVerified: user.emailVerified
    }, { merge: true });
  }
};
