// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container flex flex-col items-center justify-center min-h-[80vh] py-8 text-center px-4"
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved
        or doesn't exist.
      </p>
      <Button onClick={() => navigate("/")} size="lg">
        <Home className="mr-2 h-5 w-5" />
        Back to Home
      </Button>
    </motion.div>
  );
}
