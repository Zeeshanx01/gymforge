import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // optional

// const firebaseConfig = {
//   apiKey: "AIzaSyDq3y1qCq9Pnq4uXwM78qkjVr6PGXgBrA4",
//   authDomain: "gymforge-7eaf4.firebaseapp.com",
//   projectId: "gymforge-7eaf4",
//   storageBucket: "gymforge-7eaf4.appspot.com", // ✅ Fixed
//   messagingSenderId: "256109614953",
//   appId: "1:256109614953:web:4a5acef97b9bc9b6dacff8",
//   measurementId: "G-T6XEQ4HQD2"
// };


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app); // optional for production only

export { app, auth, db, storage, googleProvider };
