// src/components/admin/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin mr-2">●</div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return children;
}
