// src/components/inspection/CategoryPage.jsx
import { useMemo, useState, useEffect } from "react";
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
  ArrowLeft,
  Menu,
  AlertOctagon,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InspectionItem from "./InspectionItem";
import { useInspection } from "@/context/InspectionContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";

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
  const { inspectionData, getCompletionStatus, isCategoryComplete, loading, resetInspection } =
    useInspection();
  const [showSummary, setShowSummary] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Use the scroll to top hook
  useScrollToTop();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Get category statistics and incomplete items
  const categoryStats = useMemo(() => {
    if (!category) return null;
    
    const total = category.items.length;
    const completed = category.items.filter(item => item.status !== null).length;
    const incomplete = category.items.filter(item => item.status === null);
    const issues = category.items.filter(item => item.status === "no").length;
    const fixed = category.items.filter(item => item.status === "no" && item.fixed).length;
    const na = category.items.filter(item => item.status === "na").length;
    
    return {
      total,
      completed,
      incomplete,
      issues,
      fixed,
      na,
      percentComplete: total ? Math.round((completed / total) * 100) : 0
    };
  }, [category]);

  // Navigation functions
  const goToPreviousCategory = () => {
    if (categoryIndex > 0) {
      const prevCategory = inspectionData[categoryIndex - 1];
      navigate(`/inspection/${prevCategory.id}`);
    } else {
      navigate("/");
    }
  };

  const goToNextCategory = () => {
    if (!categoryComplete) {
      // Show incomplete items in the toast
      const incompleteCount = categoryStats.incomplete.length;
      toast.error(
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Please complete all items before proceeding</div>
          <div className="text-sm">
            {incompleteCount} {incompleteCount === 1 ? 'item' : 'items'} remaining
          </div>
        </div>
      );
      return;
    }

    if (categoryIndex < inspectionData.length - 1) {
      const nextCategory = inspectionData[categoryIndex + 1];
      navigate(`/inspection/${nextCategory.id}`);
    } else {
      navigate("/review");
    }
  };

  const handleReset = () => {
    resetInspection();
    navigate("/");
    toast.success("Inspection reset successfully");
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
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0.5rem))]">
      {/* Category Title and Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-semibold">{category.title}</h1>
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Inspection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset the inspection? This will clear all your progress and return you to the start. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Reset Inspection
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/50 dark:bg-slate-950/50">
              {categoryStats.completed}/{categoryStats.total} Complete
            </Badge>
            {categoryStats.issues > 0 && (
              <Badge variant="destructive" className="bg-white/50">
                {categoryStats.issues} {categoryStats.issues === 1 ? 'Issue' : 'Issues'}
                {categoryStats.fixed > 0 && ` (${categoryStats.fixed} Fixed)`}
              </Badge>
            )}
            {categoryStats.na > 0 && (
              <Badge variant="secondary" className="bg-white/50">
                {categoryStats.na} NA
              </Badge>
            )}
          </div>
        </div>
        <Progress value={categoryStats.percentComplete} className="mt-2" />
        
        {/* Warning for incomplete items */}
        {!categoryComplete && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
            <AlertOctagon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">
              Please complete all inspection items before proceeding to the next category
            </span>
          </div>
        )}
      </div>

      {/* Inspection items list */}
      <div className="space-y-4 pb-24">
        {category.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <InspectionItem item={{ ...item, categoryId: category.id }} />
          </motion.div>
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border z-50">
        <div className="container max-w-md mx-auto px-4 py-4" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousCategory}
              className="flex-1 min-w-[120px]"
              disabled={categoryIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant={categoryComplete ? "default" : "outline"}
              onClick={goToNextCategory}
              className="flex-1 min-w-[120px]"
              disabled={!categoryComplete}
            >
              {categoryIndex === inspectionData.length - 1 ? (
                <>
                  Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}