// src/components/layout/RootLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

// Add this style to disable pull-to-refresh
const disablePullToRefreshStyle = `
  html, body {
    overscroll-behavior-y: none;
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
  }
`;

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
    
    // Add meta tag to disable pull-to-refresh
    const metaTag = document.createElement('meta');
    metaTag.name = 'viewport';
    metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaTag);
    
    // Add style to disable pull-to-refresh
    const styleElement = document.createElement('style');
    styleElement.textContent = disablePullToRefreshStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.head.removeChild(metaTag);
      document.head.removeChild(styleElement);
    };
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
        <div className="container py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">CSR Daily Walk</h1>
          </div>
          
          {/* Mobile menu button */}
          {isMobile && !isAdminPage && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100/80 dark:hover:bg-slate-800/80">
                  <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-700/80 backdrop-blur">
                <div className="flex flex-col gap-4 py-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                    onClick={goToAdminLogin}
                  >
                    <LockKeyhole className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Admin Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {/* Desktop admin link */}
          {!isMobile && !isAdminPage && (
            <Button
              variant="ghost"
              className="hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
              onClick={goToAdminLogin}
            >
              <LockKeyhole className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Admin Login
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
}
