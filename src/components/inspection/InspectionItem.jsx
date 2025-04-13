// src/components/inspection/InspectionItem.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useInspection } from "@/context/InspectionContext";

export default function InspectionItem({ categoryId, item }) {
  const { updateInspectionItem } = useInspection();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (value) => {
    updateInspectionItem(categoryId, item.id, { status: value });

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

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="mb-3">
          <p className="font-medium">{item.description}</p>
        </div>

        <RadioGroup
          value={item.status || ""}
          onValueChange={handleStatusChange}
          className="flex space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${item.id}-yes`} />
            <Label htmlFor={`${item.id}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${item.id}-no`} />
            <Label htmlFor={`${item.id}-no`}>No</Label>
          </div>
        </RadioGroup>

        {item.status === "no" && (
          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id={`fixed-${item.id}`}
                checked={item.fixed}
                onCheckedChange={handleFixedChange}
              />
              <Label htmlFor={`fixed-${item.id}`}>Fixed?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`notes-${item.id}`}>Notes:</Label>
              <Textarea
                id={`notes-${item.id}`}
                placeholder="Add details about the issue..."
                value={item.notes}
                onChange={handleNotesChange}
                className="min-h-20"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
