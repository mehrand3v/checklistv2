// src/pages/ErrorPage.jsx
import { useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getErrorMessage = (error) => {
    if (error.status === 404) {
      return "The requested resource could not be found.";
    }
    if (error.status === 401) {
      return "You are not authorized to access this resource.";
    }
    if (error.status === 403) {
      return "Access to this resource is forbidden.";
    }
    if (error.status === 500) {
      return "An internal server error occurred. Please try again later.";
    }
    return error.message || "An unexpected error occurred.";
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
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Oops!</CardTitle>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            {error.status ? `Error ${error.status}` : "Something went wrong"}
          </h2>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-muted-foreground">
            {getErrorMessage(error)}
          </p>
          {error.status && (
            <p className="text-sm text-muted-foreground">
              Error Code: {error.status}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 pb-4">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
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
