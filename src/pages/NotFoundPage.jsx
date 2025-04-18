// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container flex items-center justify-center min-h-[80vh] p-4"
    >
      <Card className="max-w-md w-full border-2 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Search className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
          <h2 className="text-xl font-semibold">Page Not Found</h2>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-muted-foreground">
            We couldn't find the page you're looking for. It might have been moved
            or doesn't exist.
          </p>
          <p className="text-sm text-muted-foreground">
            Check the URL for typos or try navigating back to the previous page.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 pb-4">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
