// src/components/admin/AdminLayout.jsx
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LogOut, Home, QrCode } from "lucide-react";
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
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-green-600 dark:text-green-400">Logged out successfully</div>
          <div className="text-sm text-green-600/80 dark:text-green-400/80">See you next time!</div>
        </div>
      );
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hidden sm:block">CSR Daily Walk Admin</h1>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 mr-2 hidden sm:inline">
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
                  onClick={() => navigate("/admin/qr")}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <QrCode className="h-4 w-4 text-purple-500" />
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
    </div>
  );
}
