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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InspectionItem from "./InspectionItem";
import { useInspection } from "@/context/InspectionContext";

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
  const [showSummary, setShowSummary] = useState(false);

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
      <div className="container py-4 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading inspection data...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-4 text-center">
        <p>Category not found. Please return to the home screen.</p>
        <Button className="mt-4" onClick={() => navigate("/")}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-4 max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold flex items-center">
            <IconComponent iconName={category.icon} className="w-6 h-6 mr-2" />
            {category.title}
            {categoryComplete && (
              <CheckCircle2 className="ml-2 text-green-500 w-5 h-5" />
            )}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSummary(!showSummary)}
          >
            {showSummary ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>
              Progress: {completionStatus.completedItems} of{" "}
              {completionStatus.totalItems} items
            </span>
            <span>{completionStatus.percentComplete}%</span>
          </div>
          <Progress value={completionStatus.percentComplete} />
        </div>

        {showSummary && categoryStats && (
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{categoryStats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{categoryStats.issues}</div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{categoryStats.fixed}</div>
                  <div className="text-sm text-muted-foreground">Fixed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{categoryStats.percentComplete}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {category.items.map((item) => (
          <InspectionItem key={item.id} categoryId={category.id} item={item} />
        ))}
      </div>

      <div className="flex justify-between mt-8 pb-8">
        <Button
          variant="outline"
          onClick={goToPreviousCategory}
          disabled={categoryIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button onClick={goToNextCategory}>
          {categoryIndex < inspectionData.length - 1 ? "Next" : "Review"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
