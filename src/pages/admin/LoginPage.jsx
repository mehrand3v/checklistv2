// src/pages/admin/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, currentUser, loading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use the scroll to top hook
  useScrollToTop();

  // Check if user is already logged in
  useEffect(() => {
    console.log("LoginPage - Current user:", currentUser);
    if (currentUser) {
      console.log("User already logged in, redirecting to dashboard");
      navigate("/admin/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      console.log("Login result:", success);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4 overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="flex justify-center mb-2"
              variants={cardVariants}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl">Admin Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
