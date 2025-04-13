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

  // Get completion status
  const completionStatus = getCompletionStatus();

  // Check if we can submit (all items must be completed)
  const canSubmit =
    completionStatus.completedItems === completionStatus.totalItems;

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
      className="container py-6 max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Review Inspection</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Store Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Store Information</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center">
                <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Store: <strong>{storeInfo.storeNumber}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Inspector: <strong>{storeInfo.inspectedBy}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Completion Status</h3>
            <div className="flex items-center justify-between">
              <span>
                {completionStatus.completedItems} of{" "}
                {completionStatus.totalItems} items completed
              </span>
              <Badge variant={canSubmit ? "default" : "outline"}>
                {canSubmit ? "Ready to Submit" : "Incomplete"}
              </Badge>
            </div>
          </div>

          {/* Category Summaries */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Category Summaries</h3>
            <Accordion type="single" collapsible>
              {inspectionData.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>{category.title}</span>
                      {categoryHasIssues(category) ? (
                        <Badge variant="destructive" className="ml-2">
                          {countIssuesInCategory(category)} Issues
                        </Badge>
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      {category.items.map((item) => (
                        <li key={item.id} className="flex items-start">
                          {item.status === "yes" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : item.status === "no" ? (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-gray-200 mr-2 mt-0.5 flex-shrink-0" />
                          )}
                          <span>{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
