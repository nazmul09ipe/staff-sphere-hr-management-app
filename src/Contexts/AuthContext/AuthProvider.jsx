import React, { useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../Firebase.config";
import AuthContext from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    // 🔥 ADD THIS
    await fetch("https://assignment-12-serverside-one.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "employee", // default role
      }),
    });

    return result;
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // observe user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();

        await fetch("https://assignment-12-serverside-one.vercel.app/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include", // 🔥 IMPORTANT
          body: JSON.stringify({ token }),
        });
      } else {
        await fetch("https://assignment-12-serverside-one.vercel.app/logout", {
          method: "POST",
          credentials: "include",
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
