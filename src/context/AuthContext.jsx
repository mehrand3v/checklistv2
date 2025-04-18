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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch admin role from Firestore
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            setAdminRole(adminDoc.data().role);
          }
        } catch (err) {
          console.error("Error fetching admin role:", err);
        }
      } else {
        setAdminRole(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      await loginUser(email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAdminRole(null);
      return true;
    } catch (err) {
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
