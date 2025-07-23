import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { addUserToFirestore } from './addUserToFirestore';

export const signupWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await addUserToFirestore(user);
};
