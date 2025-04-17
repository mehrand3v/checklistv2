// src/pages/ConfirmationPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, Home, Coffee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

// npm install react-confetti

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { resetInspection } = useInspection();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiCount, setConfettiCount] = useState(500);

  // Fetch inspection data
  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const docRef = doc(db, "inspections", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setInspection(docSnap.data());
        } else {
          console.error("No inspection found with ID:", id);
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching inspection:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id, navigate]);

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Gradually increase confetti count for a more dramatic effect
  useEffect(() => {
    const interval = setInterval(() => {
      setConfettiCount(prev => Math.min(prev + 50, 1000));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Stop confetti after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartNew = () => {
    resetInspection();
    navigate("/");
  };

  // Get work-focused message based on time of day
  const getWorkMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Have a productive day at work!";
    if (hour < 17) return "Keep up the great work today!";
    return "Great job finishing your tasks!";
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

  if (loading) {
    return (
      <div className="container py-6 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading inspection data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={confettiCount}
          recycle={false}
          gravity={0.15}
          initialVelocityY={25}
          initialVelocityX={15}
          colors={["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 50,
          }}
        />
      )}

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full max-w-md mx-auto px-4 sm:px-6"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="flex justify-center mb-4"
              variants={iconVariants}
            >
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              </div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl">Inspection Complete!</CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              Thank you for completing the inspection for{" "}
              <span className="inline-flex items-center gap-1.5">
                Store{" "}
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-base sm:text-lg">
                  #{inspection?.storeNumber || "N/A"}
                </span>
              </span>
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Coffee className="h-4 w-4" />
              <p className="text-xs sm:text-sm">
                {getWorkMessage()}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <Button 
              size="lg" 
              onClick={handleStartNew} 
              className="mt-4 w-full sm:w-auto"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
