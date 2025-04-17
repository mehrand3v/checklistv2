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
  CardDescription,
} from "@/components/ui/card";
import { useInspection } from "@/context/InspectionContext";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeInfo, setStoreInfo, resetInspection, inspectionData, loading } = useInspection();
  const [storeNumber, setStoreNumber] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Loading inspection data...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Store Information
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter store details to start your inspection
            </p>
          </div>

          <Card className="border-blue-100/50 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Start Inspection
              </CardTitle>
              <CardDescription>
                Please enter the store number and inspector name
              </CardDescription>
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
                      type="text"
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
    </PageWrapper>
  );
}
