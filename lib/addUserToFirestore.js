import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const addUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || 'Anonymous',
    email: user.email,
    photoURL: user.photoURL || '',
    createdAt: new Date().toISOString()
  }, { merge: true }); // merge: true avoids overwriting
};
