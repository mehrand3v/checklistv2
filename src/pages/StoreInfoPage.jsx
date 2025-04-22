// src/pages/StoreInfoPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Store, User, ClipboardCheck, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeInfo, setStoreInfo, resetInspection, inspectionData, loading } = useInspection();
  const [storeNumber, setStoreNumber] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the scroll to top hook
  useScrollToTop();

  useEffect(() => {
    // Clear any existing inspection data when the page loads
    resetInspection();
  }, []);

  // Form validation
  useEffect(() => {
    const isStoreNumberValid = storeNumber.length === 7 && /^\d{7}$/.test(storeNumber);
    const isInspectorNameValid = inspectorName.trim() !== "";
    setIsFormValid(isStoreNumberValid && isInspectorNameValid);
  }, [storeNumber, inspectorName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSubmitting(true);
      
      // Update store info in context
      setStoreInfo({
        storeNumber,
        inspectedBy: inspectorName,
      });
      
      // Small delay for animation
      setTimeout(() => {
        // Navigate to the first category using data from context
        const firstCategory = inspectionData[0];
        navigate(`/inspection/${firstCategory.id}`);
      }, 800);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        delay: 0.1,
        type: "spring",
        stiffness: 100
      } 
    },
    hover: { 
      scale: 1.02, 
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 } 
    },
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -45 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.3 
      }
    }
  };

  const buttonVariants = {
    tap: { scale: 0.98 },
    hover: { scale: 1.03, transition: { duration: 0.2 } }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="p-2 rounded-full bg-white shadow-md"
          >
            <Loader2 size={32} className="text-blue-600" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-medium text-blue-700"
          >
            Preparing inspection...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4 overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full max-w-md mx-auto px-4 sm:px-0"
      >
        <motion.div
          whileHover="hover"
          variants={cardVariants}
        >
          <Card className="border-0 rounded-3xl shadow-xl bg-white overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <CardHeader className="text-center pb-2 pt-6 sm:pt-8">
              <motion.div
                className="flex justify-center mb-4"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-5 shadow-md">
                  <ClipboardCheck className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">Store Inspection</CardTitle>
                <p className="text-blue-600 mt-2 text-sm sm:text-base font-medium">Enter your details to begin</p>
              </motion.div>
            </CardHeader>
            
            <CardContent className="pt-4 pb-8 px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <AnimatePresence>
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <motion.div 
                      className="relative"
                      whileFocus="focus"
                      whileTap="focus"
                      variants={inputVariants}
                    >
                      <Input
                        id="storeNumber"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Store Number (7 digits)"
                        value={storeNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                          setStoreNumber(value);
                        }}
                        className="pl-10 pr-12 text-lg h-14 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 shadow-sm focus:shadow-md"
                        maxLength={7}
                      />
                      <Store className="absolute left-3 top-4 h-6 w-6 text-blue-500" />
                      <AnimatePresence>
                        {storeNumber.length === 7 && /^\d{7}$/.test(storeNumber) && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-4 text-green-500"
                          >
                            <div className="bg-green-100 rounded-full p-1 shadow-sm">
                              <Check className="h-5 w-5" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.p 
                      className={`text-sm ${storeNumber.length === 7 && /^\d{7}$/.test(storeNumber) ? "text-green-600" : "text-blue-600"} font-medium ml-1`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {storeNumber.length > 0 && storeNumber.length < 7
                        ? `${7 - storeNumber.length} more digits needed`
                        : storeNumber.length === 7 && !/^\d{7}$/.test(storeNumber)
                        ? "Please enter only numbers"
                        : storeNumber.length === 7 ? "Valid store number" : "Enter 7-digit store number"}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence>
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <motion.div 
                      className="relative"
                      whileFocus="focus"
                      whileTap="focus"
                      variants={inputVariants}
                    >
                      <Input
                        id="inspectorName"
                        type="text"
                        placeholder="Your Name"
                        value={inspectorName}
                        onChange={(e) => setInspectorName(e.target.value)}
                        className="pl-10 text-lg h-14 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 shadow-sm focus:shadow-md"
                      />
                      <User className="absolute left-3 top-4 h-6 w-6 text-blue-500" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <motion.button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    whileTap="tap"
                    whileHover={isFormValid ? "hover" : {}}
                    variants={buttonVariants}
                    className={`w-full h-14 text-lg font-medium rounded-xl mt-6 transition-all duration-300 ${
                      isFormValid 
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl" 
                      : "bg-gray-200 text-gray-400"
                    } flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="mr-2 h-5 w-5" />
                        </motion.div>
                        Starting...
                      </>
                    ) : isFormValid ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Start Inspection
                        <ChevronRight className="ml-1 h-5 w-5" />
                      </>
                    ) : (
                      "Complete form to continue"
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}