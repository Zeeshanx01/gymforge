// hooks/useAuth.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";
import { auth } from "../lib/firebase"; // Adjust the import path as necessary
export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
}
