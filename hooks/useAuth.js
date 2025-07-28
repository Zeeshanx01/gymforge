'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('guest') // Default role

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            setRole(userData.role || 'user') // default to 'user' if role is missing
          } else {
            setRole('user') // fallback if no doc
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          setRole('user') // fallback on error
        }
      } else {
        setRole('guest')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, role, loading }
}
