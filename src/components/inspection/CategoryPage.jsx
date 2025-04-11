// src/components/inspection/CategoryPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Utensils,
  Coffee,
  Pizza,
  Brush,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import InspectionItem from "./InspectionItem";
import { useInspection } from "@/context/InspectionContext";
import inspectionItems from "@/config/inspectionItems";

// You'll need to run: npx shadcn-ui@latest add progress

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { inspectionData, getCompletionStatus, isCategoryComplete } =
    useInspection();

  // Find the current category
  const category = useMemo(() => {
    return inspectionData.find((cat) => cat.id === categoryId);
  }, [categoryId, inspectionData]);

  // Get the index of the current category
  const categoryIndex = useMemo(() => {
    return inspectionItems.findIndex((cat) => cat.id === categoryId);
  }, [categoryId]);

  // Get completion status
  const completionStatus = useMemo(() => {
    return getCompletionStatus();
  }, [getCompletionStatus]);

  // Check if this category is complete
  const categoryComplete = useMemo(() => {
    return isCategoryComplete(categoryId);
  }, [categoryId, isCategoryComplete]);

  // Navigation functions
  const goToPreviousCategory = () => {
    if (categoryIndex > 0) {
      const prevCategory = inspectionItems[categoryIndex - 1];
      navigate(`/inspection/${prevCategory.id}`);
      // Scroll to top of page
      window.scrollTo(0, 0);
    } else {
      // If we're at the first category, go back to store info
      navigate("/");
    }
  };

 const goToNextCategory = () => {
   if (categoryIndex < inspectionItems.length - 1) {
     const nextCategory = inspectionItems[categoryIndex + 1];
     navigate(`/inspection/${nextCategory.id}`);
     // Scroll to top of page
     window.scrollTo(0, 0);
   } else {
     // If we're at the last category, go to review
     navigate("/review");
   }
 };

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

  // Get the appropriate icon based on category ID
  const getCategoryIcon = () => {
    switch (category.id) {
      case "food-prep":
        return <Utensils className="w-6 h-6 mr-2" />;
      case "beverage-areas":
        return <Coffee className="w-6 h-6 mr-2" />;
      case "food-display":
        return <Pizza className="w-6 h-6 mr-2" />;
      case "cleaning-safety":
        return <Brush className="w-6 h-6 mr-2" />;
      case "compliance-facilities":
        return <ClipboardCheck className="w-6 h-6 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-4 max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold flex items-center">
            {getCategoryIcon()}
            {category.title}
            {categoryComplete && (
              <CheckCircle2 className="ml-2 text-green-500 w-5 h-5" />
            )}
          </h1>
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
          {categoryIndex < inspectionItems.length - 1 ? "Next" : "Review"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
