// src/components/layout/RootLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">CSR Daily Walk</h1>
          </div>

          {!isAdminPage && (
            <div className="flex items-center gap-2">
              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col gap-4 py-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={goToAdminLogin}
                      >
                        <LockKeyhole className="mr-2 h-4 w-4" />
                        Admin Login
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
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
          )}
        </div>

        {/* Admin link dropdown - Desktop only */}
        <AnimatePresence>
          {showAdminLink && !isAdminPage && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-4 mt-2 bg-card shadow-lg rounded-md border border-border p-2 z-50"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={goToAdminLogin}
              >
                Admin Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container px-4">
          <p className="text-sm text-muted-foreground text-center">
            CSR Daily Walk &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
}
