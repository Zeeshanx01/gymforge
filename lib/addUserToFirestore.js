import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const addUserToFirestore = async (user) => {
  if (!user) return;

const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
const adminEmails = adminEmailsEnv.split(',').map(email => email.trim());

const role = adminEmails.includes(user.email) ? 'admin' : 'user';



  const userRef = doc(db, 'users', user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || 'Anonymous',
    email: user.email,
    photoURL: user.photoURL || '',
    role: role, // ✅ added role field
    createdAt: new Date().toISOString(),
  }, { merge: true }); // merge: true avoids overwriting
};
