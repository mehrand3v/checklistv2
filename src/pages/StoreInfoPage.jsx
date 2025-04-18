// src/pages/StoreInfoPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";
import { motion } from "framer-motion";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeInfo, setStoreInfo, resetInspection, inspectionData, loading } = useInspection();
  const [storeNumber, setStoreNumber] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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
      // Update store info in context
      setStoreInfo({
        storeNumber,
        inspectedBy: inspectorName,
      });
      
      // Navigate to the first category using data from context
      const firstCategory = inspectionData[0];
      navigate(`/inspection/${firstCategory.id}`);
    }
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
                <Store className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeNumber" className="text-base">
                  Store Number
                </Label>
                <div className="relative">
                  <Input
                    id="storeNumber"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter 7-digit store number"
                    value={storeNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setStoreNumber(value);
                    }}
                    className="pl-8 pr-12 text-lg h-12"
                    maxLength={7}
                  />
                  <Store className="absolute left-2 top-3 h-6 w-6 text-blue-500" />
                  {storeNumber.length === 7 && /^\d{7}$/.test(storeNumber) && (
                    <div className="absolute right-3 top-3 text-green-500">
                      <Check className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {storeNumber.length > 0 && storeNumber.length < 7
                    ? `${7 - storeNumber.length} more digits needed`
                    : storeNumber.length === 7 && !/^\d{7}$/.test(storeNumber)
                    ? "Please enter only numbers"
                    : "Enter exactly 7 digits"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inspectorName" className="text-base">
                  Inspector Name
                </Label>
                <div className="relative">
                  <Input
                    id="inspectorName"
                    type="text"
                    placeholder="Enter your name"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="pl-8 text-lg h-12"
                  />
                  <User className="absolute left-2 top-3 h-6 w-6 text-blue-500" />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={!isFormValid}
              >
                <Check className="mr-2 h-5 w-5" />
                Start Inspection
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
