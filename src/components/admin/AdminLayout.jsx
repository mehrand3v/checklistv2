// src/components/admin/AdminLayout.jsx
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LogOut, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">CSR Daily Walk Admin</h1>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <>
                <span className="text-sm text-muted-foreground mr-2">
                  {currentUser.email}
                </span>

                <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                  <Home className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/settings")}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-border py-4">
        <div className="container">
          <p className="text-sm text-muted-foreground text-center">
            CSR Daily Walk Admin Dashboard &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
