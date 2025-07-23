// // hooks/useAuth.js
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// // import { auth } from "../firebase";
// import { auth } from "../lib/firebase"; // Adjust the import path as necessary
// export default function useAuth() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   return user;
// }




// hooks/useAuth.js
'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('guest') // guest by default

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
        setRole(adminEmails.includes(user.email) ? 'admin' : 'user')
      } else {
        setRole('guest')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, role, loading }
}
