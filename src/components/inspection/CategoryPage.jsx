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
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InspectionItem from "./InspectionItem";
import { useInspection } from "@/context/InspectionContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [isMobile, setIsMobile] = useState(false);

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
    
    return {
      total,
      completed,
      incomplete,
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
      window.scrollTo(0, 0);
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
      window.scrollTo(0, 0);
    } else {
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
      {/* Category Title and Progress */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{category.title}</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{categoryStats.completed} of {categoryStats.total} items completed</span>
          <span>•</span>
          <span>{categoryStats.issues} issues found</span>
          {categoryStats.issues > 0 && (
            <>
              <span>•</span>
              <span>{categoryStats.fixed} fixed</span>
            </>
          )}
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

      {/* Fixed Navigation at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousCategory}
              className="flex-1 mr-2"
              disabled={categoryIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant={categoryComplete ? "default" : "outline"}
              onClick={goToNextCategory}
              className="flex-1 ml-2"
              disabled={categoryIndex === inspectionData.length - 1}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}