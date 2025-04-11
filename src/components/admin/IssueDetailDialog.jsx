// src/components/admin/IssueDetailDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ExternalLink, X, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { updateIssueStatus } from "@/services/api";
import { useState } from "react";
import { toast } from "sonner";

// You'll need to run these commands:
// npx shadcn-ui@latest add dialog
// npx shadcn-ui@latest add separator

export function IssueDetailDialog({ issue, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStatusChange = async (fixed) => {
    if (issue.fixed === fixed) return;

    try {
      setIsUpdating(true);

      const result = await updateIssueStatus(
        issue.inspectionId,
        issue.categoryId,
        issue.itemId,
        fixed
      );

      if (result.success) {
        toast.success(`Issue marked as ${fixed ? "fixed" : "open"}`);
        // Update local state
        if (onStatusChange) {
          onStatusChange(
            issue.inspectionId,
            issue.categoryId,
            issue.itemId,
            fixed
          );
        }

        // Close dialog after a short delay
        setTimeout(() => setOpen(false), 1000);
      } else {
        toast.error("Failed to update issue status: " + result.error);
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex gap-1">
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Issue Details</DialogTitle>
          <DialogDescription>
            Full information about the reported issue
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Store</h3>
            <p className="text-sm">{issue.storeNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Category</h3>
            <p className="text-sm">{issue.categoryTitle}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Issue</h3>
            <p className="text-sm">{issue.description}</p>
          </div>

          {issue.notes && (
            <div>
              <h3 className="text-sm font-medium mb-1">Notes</h3>
              <p className="text-sm">{issue.notes}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-1">Status</h3>
            <Badge variant={issue.fixed ? "success" : "destructive"}>
              {issue.fixed ? "Fixed" : "Open"}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Reported</h3>
            <p className="text-sm">
              {issue.submittedAt
                ? new Date(issue.submittedAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              By: {issue.inspectedBy}
            </p>
          </div>

          {issue.hasPhoto && (
            <div>
              <h3 className="text-sm font-medium mb-1">Photo</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Photo available
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Photos are stored in inspection record
              </p>
            </div>
          )}

          <Separator />

          <div className="flex justify-between pt-2">
            <Button
              variant="destructive"
              disabled={!issue.fixed || isUpdating}
              onClick={() => handleStatusChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Mark as Open
            </Button>

            <Button
              variant="outline"
              className="bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400"
              disabled={issue.fixed || isUpdating}
              onClick={() => handleStatusChange(true)}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Fixed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
