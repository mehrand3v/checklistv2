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
import inspectionItems from "@/config/inspectionItems";

// You'll need to run:
// npx shadcn-ui@latest add input
// Also install: npm install framer-motion

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeInfo, setStoreInfo } = useInspection();
  const [isFormValid, setIsFormValid] = useState(false);

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
    if (isFormValid) {
      // Navigate to the first category
      const firstCategory = inspectionItems[0];
      navigate(`/inspection/${firstCategory.id}`);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container py-6 max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Store className="mr-2 h-6 w-6" />
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
                placeholder="Enter store number"
                value={storeInfo.storeNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspectedBy">Inspector Name</Label>
              <Input
                id="inspectedBy"
                name="inspectedBy"
                placeholder="Your name"
                value={storeInfo.inspectedBy}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={!isFormValid}>
              <Check className="mr-2 h-4 w-4" />
              Begin Inspection
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
