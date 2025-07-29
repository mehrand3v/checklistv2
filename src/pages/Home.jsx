import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardCheck, Store, User, Calendar, Star } from "lucide-react";
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
  
  // Check if today is Mukhtar's Day (January 9th)
  const today = new Date();
  const isMukhtarsDay = today.getMonth() === 0 && today.getDate() === 9; // January is month 0
  
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
  
  const specialEventVariants = {
    initial: { opacity: 0, scale: 0.9, y: -10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        delay: 0.2,
        type: "spring",
        stiffness: 300
      } 
    },
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4 overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full max-w-md mx-auto space-y-4"
      >
        {/* Mukhtar's Day Banner - Always visible with special celebration on January 9th */}
        <motion.div
          variants={specialEventVariants}
          whileHover="hover"
        >
          <Card className={`border-2 ${
            isMukhtarsDay 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-amber-200/50' 
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
          } shadow-lg relative overflow-hidden`}>
            {/* Animated background effect for special day */}
            {isMukhtarsDay && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 animate-pulse" />
            )}
            
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-center gap-2 text-center">
                <motion.div
                  animate={isMukhtarsDay ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: isMukhtarsDay ? Infinity : 0, repeatDelay: 3 }}
                >
                  {isMukhtarsDay ? (
                    <Star className="h-5 w-5 text-amber-600 fill-amber-400" />
                  ) : (
                    <Calendar className="h-5 w-5 text-purple-600" />
                  )}
                </motion.div>
                
                <div>
                  <h3 className={`font-bold text-sm ${
                    isMukhtarsDay ? 'text-amber-800' : 'text-purple-800'
                  }`}>
                    {isMukhtarsDay ? '🎉 Today is Mukhtar\'s Day! 🎉' : 'Mukhtar\'s Day'}
                  </h3>
                  <p className={`text-xs ${
                    isMukhtarsDay ? 'text-amber-700' : 'text-purple-700'
                  }`}>
                    {isMukhtarsDay 
                      ? 'Celebrating excellence in safety inspections!' 
                      : 'January 9th - Celebrating excellence in safety inspections'
                    }
                  </p>
                </div>
                
                <motion.div
                  animate={isMukhtarsDay ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 2, repeat: isMukhtarsDay ? Infinity : 0, repeatDelay: 3, delay: 0.5 }}
                >
                  {isMukhtarsDay ? (
                    <Star className="h-5 w-5 text-amber-600 fill-amber-400" />
                  ) : (
                    <Calendar className="h-5 w-5 text-purple-600" />
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main SafeWalk Card */}
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
            <div className="flex items-center justify-center gap-2">
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
                <Store className="mr-2 h-5 w-5" />
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
                <User className="mr-2 h-5 w-5" />
                Admin Login
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
