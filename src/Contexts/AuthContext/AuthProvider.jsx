// @flow strict

import * as React from "react";
import { useState, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { useEffect } from "react";
import app from "../../../Firebase.config";





export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  
  const[loading,setLoading]=useState(true);


  const createUser = (email, password) => {
     setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
   
  };
  const logOut = () => {
    return signOut(auth)
      .then(() => {
        alert("You have successfully logged out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signIn=(email,password)=>{
    setLoading(true);
    return signInWithEmailAndPassword(auth,email,password);
    
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false)
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const AuthData = {
    user,
    setUser,
    createUser,
    logOut,
    signIn,
    loading,
    setLoading
  };

  return <AuthContext value={AuthData}>{children}</AuthContext>;
}

export default AuthProvider;
