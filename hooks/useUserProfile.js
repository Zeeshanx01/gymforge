// hooks/useUserProfile.js
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useUserProfile = (uid) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(doc(db, 'users', uid), (docSnap) => {
      setProfile(docSnap.data());
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  return { profile, loading };
};
