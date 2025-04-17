// src/components/admin/AdminLayout.jsx
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LogOut, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">CSR Daily Walk Admin</h1>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                  {currentUser.email}
                </span>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/")}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Home className="h-4 w-4 text-blue-500" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/settings")}
                  className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Settings className="h-4 w-4 text-amber-500" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-800">
        <div className="container">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            CSR Daily Walk Admin Dashboard &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
