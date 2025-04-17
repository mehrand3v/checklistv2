// src/components/admin/IssueDetailDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateIssueStatus } from '@/services/api';

export function IssueDetailDialog({ open, onOpenChange, issue }) {
  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await updateIssueStatus(issue.id, newStatus);
      if (result.success) {
        toast.success("Status Updated", {
          description: "The issue status has been updated successfully.",
        });
        onOpenChange(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update issue status. Please try again.",
      });
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inspection Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Store Number</h3>
              <p>{issue.storeNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Inspected By</h3>
              <p>{issue.inspectedBy}</p>
            </div>
            <div>
              <h3 className="font-semibold">Inspection Date</h3>
              <p>{new Date(issue.inspectionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <Badge variant={issue.status === 'fixed' ? 'success' : 'destructive'}>
                {issue.status}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="space-y-4">
              {issue.categories?.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{category.name}</h4>
                  <div className="space-y-2">
                    {category.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span>{item.text}</span>
                        <Badge variant={item.status === 'yes' ? 'success' : 'destructive'}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {issue.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="whitespace-pre-wrap">{issue.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {issue.status !== 'fixed' && (
              <Button
                variant="default"
                onClick={() => handleStatusUpdate('fixed')}
              >
                Mark as Fixed
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
