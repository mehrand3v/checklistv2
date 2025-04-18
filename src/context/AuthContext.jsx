// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { loginUser } from "@/services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminRole, setAdminRole] = useState(null);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      if (user) {
        // Fetch admin role from Firestore
        try {
          console.log("Fetching admin role for user:", user.uid);
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            const role = adminDoc.data().role;
            console.log("Admin role found:", role);
            setAdminRole(role);
          } else {
            console.log("No admin role found for user");
            setAdminRole(null);
          }
        } catch (err) {
          console.error("Error fetching admin role:", err);
          setAdminRole(null);
        }
      } else {
        console.log("No user, clearing admin role");
        setAdminRole(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login attempt started");
      setError(null);
      setLoading(true);
      const user = await loginUser(email, password);
      console.log("Login successful, user:", user);
      setCurrentUser(user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logout attempt started");
      await signOut(auth);
      setAdminRole(null);
      setCurrentUser(null);
      console.log("Logout successful");
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
      return false;
    }
  };

  const isSuperAdmin = () => adminRole === 'super';
  const isStandardAdmin = () => adminRole === 'standard';
  const canDelete = () => isSuperAdmin();
  const canEdit = () => isSuperAdmin() || isStandardAdmin();

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAdmin: !!currentUser,
    adminRole,
    isSuperAdmin,
    isStandardAdmin,
    canDelete,
    canEdit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
