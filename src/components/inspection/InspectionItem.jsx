// src/components/inspection/InspectionItem.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, PencilLine, AlertOctagon } from "lucide-react";
import { useInspection } from "@/context/InspectionContext";

export default function InspectionItem({ item }) {
  const { updateInspectionItem } = useInspection();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateHighlight, setAnimateHighlight] = useState(false);
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

  // Automatically expand the details section if "no" is selected
  useEffect(() => {
    if (item.status === "no") {
      setIsExpanded(true);
    }
  }, [item.status]);

  const handleStatusChange = (value) => {
    console.log('Status change:', { categoryId: item.categoryId, itemId: item.id, newStatus: value });
    updateInspectionItem(item.categoryId, item.id, { status: value });
    
    // Highlight the item briefly when changed
    setAnimateHighlight(true);
    setTimeout(() => setAnimateHighlight(false), 1000);

    // Automatically expand the details section if "no" is selected
    if (value === "no") {
      setIsExpanded(true);
    }
  };

  const handleFixedChange = (checked) => {
    updateInspectionItem(item.categoryId, item.id, { fixed: checked });
  };

  const handleNotesChange = (e) => {
    updateInspectionItem(item.categoryId, item.id, { notes: e.target.value });
  };

  // Determine card style based on item status
  const getCardStyle = () => {
    if (animateHighlight) {
      return "ring-2 ring-primary/50";
    }
    if (item.status === "yes") {
      return "border-l-4 border-l-green-500";
    }
    if (item.status === "no") {
      return item.fixed
        ? "border-l-4 border-l-blue-500"
        : "border-l-4 border-l-red-500";
    }
    return "border-l-4 border-l-yellow-500"; // Incomplete items
  };

  return (
    <Card 
      className={`mb-4 overflow-hidden transition-all duration-300 ${getCardStyle()} ${item.status === null ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}
    >
      <CardContent className="p-0">
        <div className="p-4 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <p className="font-medium text-base sm:text-lg flex-1">{item.description}</p>
                {item.status === null && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 shrink-0">
                    <AlertOctagon className="mr-1 h-3 w-3" /> Needs Review
                  </Badge>
                )}
              </div>
              
              {/* Status indicators */}
              <div className="flex mt-2 items-center space-x-2 flex-wrap gap-2">
                {item.status === "yes" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Compliant
                  </Badge>
                )}
                {item.status === "no" && !item.fixed && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    <AlertCircle className="mr-1 h-3 w-3" /> Issue Found
                  </Badge>
                )}
                {item.status === "no" && item.fixed && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Issue Fixed
                  </Badge>
                )}
              </div>
            </div>

            {/* Toggle details button */}
            {item.status === "no" && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-slate-500 hover:text-primary p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            )}
          </div>

          {/* Radio buttons for status selection */}
          <div className="flex space-x-4 mt-4">
            <label 
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md cursor-pointer transition-colors
                ${item.status === "yes" 
                  ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-500" 
                  : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
            >
              <input
                type="radio"
                name={`status-${item.id}`}
                value="yes"
                checked={item.status === "yes"}
                onChange={() => handleStatusChange("yes")}
                className="w-5 h-5 text-green-500 border-2 border-slate-400 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              />
              <span className="text-base select-none">Yes</span>
            </label>

            <label 
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md cursor-pointer transition-colors
                ${item.status === "no" 
                  ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-500" 
                  : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
            >
              <input
                type="radio"
                name={`status-${item.id}`}
                value="no"
                checked={item.status === "no"}
                onChange={() => handleStatusChange("no")}
                className="w-5 h-5 text-red-500 border-2 border-slate-400 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              />
              <span className="text-base select-none">No</span>
            </label>
          </div>
        </div>

        {/* Expandable details section for issues */}
        {item.status === "no" && (
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Separator className="my-0" />
            <div className="p-4 bg-slate-50 dark:bg-slate-800 space-y-4">
              <div className="flex items-center space-x-3 py-2">
                <Checkbox
                  id={`fixed-${item.id}`}
                  checked={item.fixed || false}
                  onCheckedChange={handleFixedChange}
                  className="h-5 w-5 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={`fixed-${item.id}`} className="cursor-pointer font-medium text-base">
                  Issue has been fixed
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`notes-${item.id}`} className="flex items-center text-base">
                  <PencilLine className="mr-2 h-4 w-4 text-slate-500" />
                  Issue Notes:
                </Label>
                <Textarea
                  id={`notes-${item.id}`}
                  placeholder="Add details about the issue..."
                  value={item.notes || ""}
                  onChange={handleNotesChange}
                  className="min-h-24 resize-none text-base"
                />
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}