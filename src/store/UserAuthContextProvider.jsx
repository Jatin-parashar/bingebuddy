import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../../firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  // Initialize user state with data from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Set session persistence to last only until the browser is closed
    setPersistence(auth, browserSessionPersistence).catch((error) =>
      console.error("Failed to set session persistence:", error)
    );

    // Listen for auth state changes and update user state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser)); // Store user in localStorage
      } else {
        setUser(null);
        localStorage.removeItem("user"); // Clear user from localStorage on logout
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Authentication methods
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: "select_account",
    });
    return signInWithPopup(auth, googleAuthProvider);
  }

  return (
    <UserAuthContext.Provider value={{ user, logIn, signUp, logOut, googleSignIn }}>
      {children}
    </UserAuthContext.Provider>
  );
}

// Custom hook to use the UserAuthContext
export function useUserAuth() {
  return useContext(UserAuthContext);
}
