import { useNavigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { LogOut, Home, QrCode, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("");

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active page based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/" || path === "/admin") {
      setActivePage("dashboard");
    } else if (path.includes("/admin/qr")) {
      setActivePage("qr");
    }
  }, []);

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

  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: <Home className="h-4 w-4" />,
      onClick: () => {
        navigate("/");
        setActivePage("dashboard");
      },
      baseColor: "text-blue-800 bg-blue-100",
      hoverColor: "hover:bg-blue-600 hover:text-blue-100",
      activeColor: "bg-blue-600 text-blue-50"
    },
    {
      id: "qr",
      label: "QR Codes",
      icon: <QrCode className="h-4 w-4" />,
      onClick: () => {
        navigate("/admin/qr");
        setActivePage("qr");
      },
      baseColor: "text-purple-800 bg-purple-100",
      hoverColor: "hover:bg-purple-600 hover:text-purple-100",
      activeColor: "bg-purple-600 text-purple-50"
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      baseColor: "text-red-800 bg-red-100",
      hoverColor: "hover:bg-red-600 hover:text-red-100", 
      activeColor: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Admin Header */}
      <header className={`sticky top-0 z-10 transition-all duration-500 ${scrolled ? 'shadow-md py-1.5 bg-white/95 backdrop-blur-sm' : 'py-2 bg-white'} border-b border-slate-200`}>
        <div className="w-full max-w-screen-xl mx-auto px-2 md:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/icon.png" 
                alt="SafeWalk Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SafeWalk
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {currentUser && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-full flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {currentUser.email}
                </div>
                
                <div className="flex items-center gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-300 text-xs font-medium ${item.id === activePage ? item.activeColor : item.baseColor} ${item.id !== activePage ? item.hoverColor : ''}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.id !== "logout" && (
                        <ChevronRight className={`h-3 w-3 transition-all duration-300 ${item.id === activePage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4 text-slate-700" />
            ) : (
              <Menu className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="w-full max-w-screen-xl mx-auto px-2 py-2 space-y-1.5">
            {currentUser && (
              <>
                <div className="p-2 bg-slate-100 rounded-lg flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-slate-700 truncate">{currentUser.email}</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 text-xs ${item.id === activePage ? item.activeColor : item.baseColor} ${item.id !== activePage ? item.hoverColor : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.id !== "logout" && (
                        <ChevronRight className={`h-3 w-3 transition-all duration-300 ${item.id === activePage ? 'opacity-100' : 'opacity-50'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-2 md:px-4 py-2 md:py-4">
        <PageWrapper>
          <div className="bg-white rounded-lg shadow-sm p-2 md:p-4">
            <Outlet />
          </div>
        </PageWrapper>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-2">
        <div className="w-full max-w-screen-xl mx-auto px-2 md:px-4 text-center">
          <p className="text-xs font-medium text-slate-600 flex items-center justify-center gap-1">
            <span>© {new Date().getFullYear()} SafeWalk Admin</span>
            <span className="inline-block w-1 h-1 rounded-full bg-green-500"></span>
            <span>Online</span>
          </p>
        </div>
      </footer>
    </div>
  );
}