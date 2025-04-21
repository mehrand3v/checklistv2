// src/pages/admin/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, User, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Use the scroll to top hook
  useScrollToTop();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);

      // Success animation before navigating
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 600);
    } catch (error) {
      toast.error("Invalid credentials", {
        style: { backgroundColor: "rgba(239, 68, 68, 0.9)", color: "white" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const inputVariants = {
    initial: { x: -20, opacity: 0 },
    animate: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.4,
      },
    }),
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const iconBoxVariants = {
    initial: { scale: 0.5, opacity: 0, rotate: -10 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      },
    },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.6 },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.4 },
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Animated background elements */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "7s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/2 w-48 h-48 bg-indigo-300 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "8s" }}
          ></div>
        </div>
      </div>

      <AnimatePresence>
        {mounted && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="w-full max-w-sm sm:max-w-md mx-auto z-10"
          >
            <motion.div variants={cardVariants} className="relative">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md bg-white/80">
                <CardHeader className="text-center pb-2 pt-8 sm:pt-10">
                  <motion.div
                    className="flex justify-center mb-6"
                    variants={iconBoxVariants}
                    whileHover="hover"
                  >
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-lg shadow-blue-500/30">
                      <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                  </motion.div>

                  <motion.div variants={titleVariants}>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                      Admin Access
                    </CardTitle>
                  </motion.div>
                </CardHeader>

                <CardContent className="px-6 sm:px-10 pb-10 pt-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      className="space-y-1.5 relative"
                      custom={0}
                      variants={inputVariants}
                    >
                      <div className="relative group">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                            focusedField === "username" || username
                              ? "text-blue-600"
                              : ""
                          }`}
                        >
                          <User size={18} />
                        </div>
                        <Input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onFocus={() => setFocusedField("username")}
                          onBlur={() => setFocusedField(null)}
                          disabled={isLoading}
                          className="h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200 text-base"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-1.5 relative"
                      custom={1}
                      variants={inputVariants}
                    >
                      <div className="relative group">
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                            focusedField === "password" || password
                              ? "text-blue-600"
                              : ""
                          }`}
                        >
                          <KeyRound size={18} />
                        </div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                          disabled={isLoading}
                          className="h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200 text-base"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="pt-2"
                    >
                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 text-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Sign In</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
