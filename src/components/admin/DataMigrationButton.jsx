// src/components/admin/DataMigrationButton.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { migrateInspectionItems } from "@/utils/migrateInspectionItems";

export default function DataMigrationButton({ onMigrationComplete }) {
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrateData = async () => {
    try {
      setIsMigrating(true);
      const result = await migrateInspectionItems();

      if (result.success) {
        toast.success(
          result.message || "Data migration completed successfully"
        );

        // Call the callback if provided
        if (typeof onMigrationComplete === "function") {
          onMigrationComplete();
        }
      } else {
        toast.error("Migration failed: " + result.error);
      }
    } catch (error) {
      console.error("Error during migration:", error);
      toast.error("An unexpected error occurred during migration");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Button
      onClick={handleMigrateData}
      disabled={isMigrating}
      variant="outline"
      className="border-dashed"
    >
      {isMigrating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Migrating Data...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Migrate Existing Categories
        </>
      )}
    </Button>
  );
}
