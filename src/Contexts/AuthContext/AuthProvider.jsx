// src/Contexts/AuthContext/AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../../../Firebase.config";

export const AuthContext = createContext();
const API_URL = "http://localhost:5000";

const auth = getAuth(app);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase user
  const [role, setRole] = useState(null);       // employee/hr/admin
  const [loading, setLoading] = useState(true); // while fetching user & role

  // ------------------ Register ------------------
  const createUser = async (email, password, displayName, photoURL = "") => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase profile
      await updateProfile(result.user, { displayName, photoURL });

      // Save user to backend
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          name: displayName,
          email,
          role: "employee", // default, can update later
          photo: photoURL,
          bank_account_no: "",
          salary: "",
          designation: "",
        }),
      });

      return result;
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Login ------------------
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Logout ------------------
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  // ------------------ Fetch Role ------------------
  const fetchRole = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/users/role/${uid}`);
      if (!res.ok) throw new Error("Failed to fetch role");
      const data = await res.json();
      return data.role;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // ------------------ Listen Auth State ------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser?.uid) {
        const userRole = await fetchRole(currentUser.uid);
        setRole(userRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, createUser, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;