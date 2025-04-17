// src/pages/StoreInfoPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeInfo, setStoreInfo, resetInspection, inspectionData, loading } = useInspection();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Clear any existing inspection data when the page loads
    resetInspection();
  }, []);

  // Form validation
  useEffect(() => {
    const { storeNumber, inspectedBy } = storeInfo;
    setIsFormValid(storeNumber.trim() !== "" && inspectedBy.trim() !== "");
  }, [storeInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid && inspectionData.length > 0) {
      // Navigate to the first category using data from context
      const firstCategory = inspectionData[0];
      navigate(`/inspection/${firstCategory.id}`);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="container py-4 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Loading inspection data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container py-4 max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeNumber">Store Number</Label>
              <Input
                id="storeNumber"
                name="storeNumber"
                value={storeInfo.storeNumber}
                onChange={handleInputChange}
                placeholder="Enter store number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspectedBy">Inspected By</Label>
              <Input
                id="inspectedBy"
                name="inspectedBy"
                value={storeInfo.inspectedBy}
                onChange={handleInputChange}
                placeholder="Enter inspector name"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || loading || inspectionData.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              Start Inspection
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
