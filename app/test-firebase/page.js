'use client'
import { useEffect } from 'react'
import { db, auth, storage } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function TestFirebasePage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'))
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data())
        })
      } catch (error) {
        console.error('Firebase Firestore Error:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Testing Firebase Connection</h1>
      <p className="text-gray-600">Check your console for Firestore data.</p>
    </div>
  )
}
