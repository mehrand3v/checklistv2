import { useNavigate } from "react-router-dom";
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
      toast.success(
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-full">
            <LogOut className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <div className="font-semibold text-emerald-600">Logged out successfully</div>
            <div className="text-sm text-emerald-500">See you next time!</div>
          </div>
        </div>
      );
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-full">
            <X className="h-4 w-4 text-red-500" />
          </div>
          <div className="font-semibold text-red-600">Failed to log out</div>
        </div>
      );
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
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
      icon: <QrCode className="h-5 w-5" />,
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
      icon: <LogOut className="h-5 w-5" />,
      onClick: handleLogout,
      baseColor: "text-red-800 bg-red-100",
      hoverColor: "hover:bg-red-600 hover:text-red-100", 
      activeColor: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Admin Header */}
      <header className={`sticky top-0 z-10 transition-all duration-500 ${scrolled ? 'shadow-lg py-2 bg-white/95 backdrop-blur-sm' : 'py-2 sm:py-4 bg-white'} border-b border-slate-200`}>
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer" 
            onClick={() => navigate('/admin')}
            title="Go to Dashboard"
          >
            <div className="relative">
              <img 
                src="/icon.png" 
                alt="SafeWalk Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain transform transition-transform hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white pulse-animation"></div>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent transition-all">
              <span className="hidden sm:inline">SafeWalk Admin</span>
              <span className="sm:hidden">SafeWalk</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-200 rounded-full flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  {currentUser.email}
                </div>
                
                <div className="flex items-center gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium ${item.id === activePage ? item.activeColor : item.baseColor} ${item.id !== activePage ? item.hoverColor : ''} transform hover:scale-105 shadow-sm hover:shadow-md`}
                    >
                      <span className="transition-all">{item.icon}</span>
                      <span className="transition-all">{item.label}</span>
                      {item.id !== "logout" && (
                        <ChevronRight className={`h-4 w-4 transition-all duration-300 ${item.id === activePage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-1.5 bg-slate-200 rounded-full hover:bg-slate-300 transition-all transform hover:scale-105 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-700" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'} origin-top`}>
          <div className="container mx-auto px-3 py-3 space-y-2">
            {currentUser && (
              <>
                <div className="p-2 bg-slate-200 rounded-lg flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-sm font-medium text-slate-700 truncate">{currentUser.email}</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${item.id === activePage ? item.activeColor : item.baseColor} ${item.id !== activePage ? item.hoverColor : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.id !== "logout" && (
                        <ChevronRight className={`h-4 w-4 transition-all duration-300 ${item.id === activePage ? 'opacity-100' : 'opacity-50'}`} />
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
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <PageWrapper>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-fadeIn">
            <Outlet />
          </div>
        </PageWrapper>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 sm:py-4 mt-4 sm:mt-6">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center justify-center gap-1">
            <span>© {new Date().getFullYear()} SafeWalk Admin Portal</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Online</span>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        /* Add slide up animation for mobile menu items */
        @keyframes slideUpIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}