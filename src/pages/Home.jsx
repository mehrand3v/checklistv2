import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardCheck, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Home() {
  const navigate = useNavigate();
  const { resetInspection } = useInspection();

  // Use the scroll to top hook
  useScrollToTop();

  const handleStartInspection = () => {
    resetInspection();
    navigate("/store-info");
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
                <ClipboardCheck className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            <div className="flex items-center gap-2">
              <img 
                src="/icon.png" 
                alt="SafeWalk Logo" 
                className="h-8 w-8 object-contain"
              />
              <CardTitle className="text-xl sm:text-2xl">SafeWalk</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div variants={cardVariants}>
              <Button
                size="lg"
                className="w-full"
                onClick={handleStartInspection}
              >
                <Store className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Start New Inspection
              </Button>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/admin/login")}
              >
                <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Admin Login
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
