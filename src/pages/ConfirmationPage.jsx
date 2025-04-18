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
import { useScrollToTop } from "@/hooks/useScrollToTop";

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

  // Use the scroll to top hook
  useScrollToTop();

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

  // Update dimensions on window resize and initial load
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

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Get a random work message
  const getWorkMessage = () => {
    const messages = [
      "Great job! Keep up the good work!",
      "Excellent inspection! Well done!",
      "Outstanding work! Thank you for your dedication!",
      "Fantastic job! Your attention to detail is impressive!",
      "Amazing work! You're making a difference!",
      "Brilliant inspection! Keep it up!",
      "Superb job! Your thoroughness is appreciated!",
      "Outstanding inspection! Thank you for your hard work!",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Handle starting a new inspection
  const handleStartNew = () => {
    resetInspection();
    navigate("/");
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.3 } },
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
          gravity={0.2}
          initialVelocityY={20}
          initialVelocityX={10}
          colors={["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 50,
            pointerEvents: 'none'
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
              className="flex justify-center mb-2"
              variants={iconVariants}
            >
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
              </div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl">Inspection Complete!</CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-3">
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

          <CardFooter className="flex justify-center pb-4">
            <Button 
              size="lg" 
              onClick={handleStartNew} 
              className="w-full sm:w-auto"
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
