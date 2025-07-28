import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const addUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const existingUser = await getDoc(userRef);

  // If user already exists, don't overwrite
  if (existingUser.exists()) {
    return;
  }

  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const adminEmails = adminEmailsEnv.split(',').map(email => email.trim());
  const role = adminEmails.includes(user.email) ? 'admin' : 'user';

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || 'Anonymous',
    email: user.email,
    photoURL: user.photoURL || '',
    role: role,
    createdAt: new Date().toISOString(),
  });
};
