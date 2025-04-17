// src/components/inspection/CategoryPage.jsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Coffee,
  Pizza,
  Brush,
  ClipboardCheck,
  ShoppingCart,
  Truck,
  Building,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import InspectionItem from "./InspectionItem";
import { useInspection } from "@/context/InspectionContext";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic icon mapping function
const IconComponent = ({ iconName, className }) => {
  const iconMap = {
    Utensils: Utensils,
    Coffee: Coffee,
    Pizza: Pizza,
    Brush: Brush,
    ClipboardCheck: ClipboardCheck,
    ShoppingCart: ShoppingCart,
    Truck: Truck,
    Building: Building,
  };

  const Icon = iconMap[iconName] || Utensils; // Default to Utensils if not found

  return <Icon className={className} />;
};

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { inspectionData, getCompletionStatus, isCategoryComplete, loading } =
    useInspection();
  const [showSummary, setShowSummary] = useState(true);

  // Find the current category
  const category = useMemo(() => {
    return inspectionData.find((cat) => cat.id === categoryId);
  }, [categoryId, inspectionData]);

  // Get the index of the current category
  const categoryIndex = useMemo(() => {
    return inspectionData.findIndex((cat) => cat.id === categoryId);
  }, [categoryId, inspectionData]);

  // Get completion status
  const completionStatus = useMemo(() => {
    return getCompletionStatus();
  }, [getCompletionStatus]);

  // Check if this category is complete
  const categoryComplete = useMemo(() => {
    return isCategoryComplete(categoryId);
  }, [categoryId, isCategoryComplete]);

  // Get category statistics
  const categoryStats = useMemo(() => {
    if (!category) return null;
    
    const total = category.items.length;
    const completed = category.items.filter(item => item.status !== null).length;
    const issues = category.items.filter(item => item.status === "no").length;
    const fixed = category.items.filter(item => item.status === "no" && item.fixed).length;
    
    return {
      total,
      completed,
      issues,
      fixed,
      percentComplete: total ? Math.round((completed / total) * 100) : 0
    };
  }, [category]);

  // Navigation functions
  const goToPreviousCategory = () => {
    if (categoryIndex > 0) {
      const prevCategory = inspectionData[categoryIndex - 1];
      navigate(`/inspection/${prevCategory.id}`);
      // Scroll to top of page
      window.scrollTo(0, 0);
    } else {
      // If we're at the first category, go back to store info
      navigate("/");
    }
  };

  const goToNextCategory = () => {
    if (categoryIndex < inspectionData.length - 1) {
      const nextCategory = inspectionData[categoryIndex + 1];
      navigate(`/inspection/${nextCategory.id}`);
      // Scroll to top of page
      window.scrollTo(0, 0);
    } else {
      // If we're at the last category, go to review
      navigate("/review");
    }
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading inspection data...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 text-center shadow-md rounded-lg bg-white dark:bg-slate-900 max-w-md mx-auto mt-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg mb-4">Category not found. Please return to the home screen.</p>
        <Button className="mt-2" onClick={() => navigate("/")}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-md mx-auto">
      {/* Header with icon and title */}
      <div className="mb-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <IconComponent iconName={category.icon} className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              {category.title}
              {categoryComplete && (
                <CheckCircle2 className="ml-2 inline text-green-500 w-5 h-5" />
              )}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setShowSummary(!showSummary)}
          >
            {showSummary ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {showSummary ? "Hide" : "Show"} Summary
          </Button>
        </div>

        {/* Overall progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium">
              Total Progress: {completionStatus.completedItems} of{" "}
              {completionStatus.totalItems} items
            </span>
            <Badge variant={completionStatus.percentComplete === 100 ? "success" : "outline"}>
              {completionStatus.percentComplete}%
            </Badge>
          </div>
          <Progress 
            value={completionStatus.percentComplete} 
            className="h-2"
          />
        </div>

        {/* Category summary statistics */}
        <AnimatePresence>
          {showSummary && categoryStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mt-4 border-none shadow-none bg-slate-50 dark:bg-slate-800">
                <CardContent className="grid grid-cols-2 gap-6 pt-4">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{categoryStats.completed}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{categoryStats.issues}</div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">Issues</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{categoryStats.fixed}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Fixed</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{categoryStats.percentComplete}%</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Complete</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category navigation indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-1">
          {inspectionData.map((cat, index) => (
            <div 
              key={cat.id} 
              className={`h-2 w-2 rounded-full ${
                index === categoryIndex 
                  ? "bg-primary w-6" 
                  : isCategoryComplete(cat.id) 
                    ? "bg-green-500" 
                    : "bg-slate-300 dark:bg-slate-700"
              } transition-all`}
            />
          ))}
        </div>
      </div>

      {/* Inspection items list */}
      <div className="space-y-4">
        {category.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <InspectionItem categoryId={category.id} item={item} />
          </motion.div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pb-12">
        <Button
          variant="outline"
          onClick={goToPreviousCategory}
          disabled={categoryIndex === 0}
          className="flex items-center gap-2 px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {categoryIndex > 0 
            ? inspectionData[categoryIndex - 1]?.title || "Previous" 
            : "Home"}
        </Button>

        <Button 
          onClick={goToNextCategory}
          className="flex items-center gap-2 px-4 py-2 shadow-md"
        >
          {categoryIndex < inspectionData.length - 1 
            ? inspectionData[categoryIndex + 1]?.title || "Next" 
            : "Review"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}