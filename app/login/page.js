"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { addUserToFirestore } from "@/lib/addUserToFirestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const isAdmin = adminEmails.includes(user.email || "");
        router.push(isAdmin ? "/admin" : "/profile");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const isPasswordStrong = (pass) => {
    return (
      pass.length >= 6 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /\d/.test(pass)
    );
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!isPasswordStrong(password)) {
          setErrorMessage(
            "Password must be at least 6 characters long and include uppercase, lowercase, and a number."
          );
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      await addUserToFirestore(user);

      const isAdmin = adminEmails.includes(user.email || "");
      router.push(isAdmin ? "/admin" : "/profile");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMessage("Incorrect email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else {
        setErrorMessage(err.message);
      }
    }
  };

  const handleGoogle = async () => {
    setErrorMessage("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await addUserToFirestore(user);

      const isAdmin = adminEmails.includes(user.email || "");
      router.push(isAdmin ? "/admin" : "/profile");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (checkingAuth) return null; // prevent UI flicker if already logged in

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-white">
      <form
        onSubmit={handleAuth}
        className="space-y-5 p-8 bg-stone-800 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {errorMessage && (
          <p className="bg-red-600/20 text-red-400 p-2 rounded text-sm">
            {errorMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded bg-stone-700 outline-none focus:ring-2 ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-stone-700 outline-none focus:ring-2 ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-xs text-blue-400"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <div className="text-center">or</div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
            }}
            className="text-blue-400 hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
