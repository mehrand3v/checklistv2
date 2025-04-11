// src/pages/ConfirmationPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";

// npm install react-confetti

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { resetInspection } = useInspection();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartNew = () => {
    resetInspection();
    navigate("/");
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const iconVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          recycle={false}
          colors={["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444"]} // Using the color palette from specs
        />
      )}

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="flex justify-center mb-4"
              variants={iconVariants}
            >
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl">Inspection Complete!</CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your inspection has been successfully submitted.
            </p>
            {id && (
              <p className="text-sm">
                Reference ID: <span className="font-mono">{id}</span>
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Button size="lg" onClick={handleStartNew} className="mt-4">
              <Home className="mr-2 h-5 w-5" />
              Start New Inspection
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
