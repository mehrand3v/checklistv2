// src/components/layout/RootLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminLink, setShowAdminLink] = useState(false);

  // Toggle admin link visibility
  const toggleAdminLink = () => {
    setShowAdminLink((prev) => !prev);
  };

  // Navigate to admin login
  const goToAdminLogin = () => {
    navigate("/admin/login");
  };

  // Check if we're already on an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4 px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">CSR Daily Walk</h1>

          {!isAdminPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAdminLink}
              aria-label="Admin Access"
            >
              <LockKeyhole className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Admin link dropdown */}
        {showAdminLink && !isAdminPage && (
          <div className="absolute right-4 mt-2 bg-card shadow-lg rounded-md border border-border p-2 z-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={goToAdminLogin}
            >
              Admin Login
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container px-4">
          <p className="text-sm text-muted-foreground text-center">
            CSR Daily Walk &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <Toaster position="top-right" />
    </div>
  );
}
