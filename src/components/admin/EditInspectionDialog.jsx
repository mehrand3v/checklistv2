import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateInspection } from "@/services/api";
import { format } from "date-fns";

export function EditInspectionDialog({ inspection, open, onOpenChange, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeNumber: inspection?.storeNumber || "",
    inspectedBy: inspection?.inspectedBy || "",
    clientDate: inspection?.clientDate || new Date().toISOString(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateInspection(inspection.id, {
        ...inspection,
        ...formData,
      });

      if (result.success) {
        toast.success("Inspection updated successfully");
        onUpdate(result.inspection);
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update inspection");
      }
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast.error("An error occurred while updating the inspection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inspection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeNumber">Store Number</Label>
            <Input
              id="storeNumber"
              value={formData.storeNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, storeNumber: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspectedBy">Inspected By</Label>
            <Input
              id="inspectedBy"
              value={formData.inspectedBy}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, inspectedBy: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientDate">Inspection Date</Label>
            <Input
              id="clientDate"
              type="date"
              value={format(new Date(formData.clientDate), "yyyy-MM-dd")}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, clientDate: e.target.value }))
              }
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 