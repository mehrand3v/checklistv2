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
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, PencilLine } from "lucide-react";
import { useInspection } from "@/context/InspectionContext";

export default function InspectionItem({ categoryId, item }) {
  const { updateInspectionItem } = useInspection();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animateHighlight, setAnimateHighlight] = useState(false);

  // Automatically expand the details section if "no" is selected
  useEffect(() => {
    if (item.status === "no") {
      setIsExpanded(true);
    }
  }, [item.status]);

  const handleStatusChange = (value) => {
    updateInspectionItem(categoryId, item.id, { status: value });
    
    // Highlight the item briefly when changed
    setAnimateHighlight(true);
    setTimeout(() => setAnimateHighlight(false), 1000);

    // Automatically expand the details section if "no" is selected
    if (value === "no") {
      setIsExpanded(true);
    }
  };

  const handleFixedChange = (checked) => {
    updateInspectionItem(categoryId, item.id, { fixed: checked });
  };

  const handleNotesChange = (e) => {
    updateInspectionItem(categoryId, item.id, { notes: e.target.value });
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
    return "";
  };

  return (
    <Card className={`mb-4 overflow-hidden transition-all duration-300 ${getCardStyle()}`}>
      <CardContent className="p-0">
        <div className="p-4 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="font-medium text-lg">{item.description}</p>
              
              {/* Status indicators */}
              <div className="flex mt-2 items-center space-x-2">
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
                className="text-slate-500 hover:text-primary p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            )}
          </div>

          {/* Radio buttons for status selection */}
          <RadioGroup
            value={item.status || ""}
            onValueChange={handleStatusChange}
            className="flex space-x-4 mt-4"
          >
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-md flex-1 justify-center">
              <RadioGroupItem value="yes" id={`${item.id}-yes`} />
              <Label htmlFor={`${item.id}-yes`} className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-md flex-1 justify-center">
              <RadioGroupItem value="no" id={`${item.id}-no`} />
              <Label htmlFor={`${item.id}-no`} className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
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
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={`fixed-${item.id}`} className="cursor-pointer font-medium">
                  Issue has been fixed
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`notes-${item.id}`} className="flex items-center">
                  <PencilLine className="mr-2 h-4 w-4 text-slate-500" />
                  Issue Notes:
                </Label>
                <Textarea
                  id={`notes-${item.id}`}
                  placeholder="Add details about the issue..."
                  value={item.notes || ""}
                  onChange={handleNotesChange}
                  className="min-h-24 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}