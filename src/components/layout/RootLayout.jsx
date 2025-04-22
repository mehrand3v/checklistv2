// src/components/layout/RootLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { motion } from "framer-motion";

// Disable pull-to-refresh
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

  // Navigate to admin login
  const goToAdminLogin = () => {
    navigate("/admin/login");
  };

  // Check if we're already on an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-md shadow-sm"
      >
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.img 
              src="/icon.png" 
              alt="SafeWalk Logo" 
              className="h-9 w-9 object-contain"
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SafeWalk
            </h1>
          </motion.div>
          
          {/* Admin Button (Enhanced Icon) */}
          {!isAdminPage && (
            <motion.div
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 }
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: 0
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                onClick={goToAdminLogin}
                aria-label="Admin Login"
              >
                <motion.div
                  whileHover={{ 
                    y: [0, -2, 0, -2, 0],
                    transition: { repeat: Infinity, repeatType: "mirror", duration: 1.5 }
                  }}
                >
                  <LockKeyhole className="h-6 w-6 text-blue-600" />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container mx-auto px-4 py-8"
      >
        <Outlet />
      </motion.main>

      {/* Toast Container */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            color: '#333',
            border: '1px solid rgba(229, 231, 235, 0.8)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
    </div>
  );
}