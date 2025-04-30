// src/pages/ReviewPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  SendHorizonal,
  Store,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useInspection } from "@/context/InspectionContext";
import { submitInspection } from "@/services/api";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function ReviewPage() {
  const navigate = useNavigate();
  const {
    storeInfo,
    inspectionData,
    getCompletionStatus,
    submitInspection: prepareSubmission,
    loading,
  } = useInspection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the scroll to top hook
  useScrollToTop();

  // Get completion status
  const completionStatus = getCompletionStatus();

  // Check if we can submit (all items must be completed)
  const canSubmit = completionStatus.isComplete;

  // Handle the submission
  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please complete all items before submitting");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the inspection data
      const inspectionPayload = await prepareSubmission();

      // Submit to Firestore
      const result = await submitInspection(inspectionPayload);

      if (result.success) {
        // Navigate to confirmation page with the ID
        navigate(`/confirmation/${result.id}`);
      } else {
        throw new Error(result.error || "Failed to submit inspection");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting inspection: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a category has any issues
  const categoryHasIssues = (category) => {
    return category.items.some((item) => item.status === "no");
  };

  // Count issues in a category
  const countIssuesInCategory = (category) => {
    return category.items.filter((item) => item.status === "no").length;
  };

  // Get item status display
  const getItemStatusDisplay = (status) => {
    switch (status) {
      case 'yes':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Yes
          </span>
        );
      case 'no':
        return (
          <span className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            No
          </span>
        );
      case 'na':
        return (
          <span className="flex items-center text-gray-600">
            <span className="h-4 w-4 mr-1">-</span>
            NA
          </span>
        );
      default:
        return (
          <span className="text-xs text-muted-foreground">
            Not checked
          </span>
        );
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
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
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container py-6 pb-[calc(6rem+env(safe-area-inset-bottom,0.5rem))] max-w-md mx-auto"
    >
      <Card className="mb-24">
        <CardHeader>
          <CardTitle className="text-2xl">Review Inspection</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Store Information */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg">Store Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Store Number</div>
                <div className="font-medium">{storeInfo.storeNumber}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Inspector</div>
                <div className="font-medium">{storeInfo.inspectedBy}</div>
              </div>
            </div>
          </div>

          {/* Category Summaries */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Category Summaries</h3>
            <Accordion type="single" collapsible className="w-full">
              {inspectionData.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-base">
                    <div className="flex items-center gap-2">
                      <span>{category.title}</span>
                      {categoryHasIssues(category) && (
                        <Badge variant="destructive" className="ml-2">
                          {countIssuesInCategory(category)} issues
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col space-y-2 p-3 rounded-lg border"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.description}</p>
                              {item.status === "no" && item.notes && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Notes: {item.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {item.status ? (
                                getItemStatusDisplay(item.status)
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Not checked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Bar */}
      <div className="fixed bottom-[env(safe-area-inset-bottom,0px)] left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border z-50">
        <div className="container max-w-md mx-auto px-4 py-4 mb-6">
          <div className="flex justify-between items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex-1 min-w-[120px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex-1 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Inspection
                  <SendHorizonal className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
