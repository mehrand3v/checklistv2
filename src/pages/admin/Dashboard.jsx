// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  FileText,
  Search,
  Store,
  FileDown,
  Settings,
  Database,
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { useAuth } from "@/context/AuthContext";
import { getAllIssues, getAllInspections } from "@/services/api";
import { toast } from "sonner";
import { IssueDetailDialog } from "@/components/admin/IssueDetailDialog";
import CategoryManagement from "@/components/admin/CategoryManagement";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("issues");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch issues
        const issuesResult = await getAllIssues();
        if (issuesResult.success) {
          setIssues(issuesResult.issues || []);
        } else {
          toast.error("Failed to load issues: " + issuesResult.error);
        }

        // Fetch inspections
        const inspectionsResult = await getAllInspections();
        if (inspectionsResult.success) {
          setInspections(inspectionsResult.inspections || []);
        } else {
          toast.error("Failed to load inspections: " + inspectionsResult.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter issues based on search term
  const filteredIssues = issues.filter(
    (issue) =>
      issue &&
      ((issue.description &&
        issue.description
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase())) ||
        (issue.storeNumber &&
          issue.storeNumber.toString().includes(searchTerm || "")) ||
        (issue.categoryTitle &&
          issue.categoryTitle
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase())))
  );

  // Filter inspections based on search term
  const filteredInspections = inspections.filter(
    (inspection) =>
      inspection &&
      ((inspection.storeNumber &&
        inspection.storeNumber.toString().includes(searchTerm || "")) ||
        (inspection.inspectedBy &&
          inspection.inspectedBy
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase())))
  );

  // Columns for issues table
  const issueColumns = [
    {
      header: "Store",
      accessorKey: "storeNumber",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Store className="mr-2 h-4 w-4 text-muted-foreground" />
          {row.original?.storeNumber || "N/A"}
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "categoryTitle",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="ml-2">{row.original?.categoryTitle || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Issue",
      accessorKey: "description",
      cell: ({ row }) => (
        <div className="max-w-xs" title={row.original?.description || ""}>
          <p className="font-medium">{row.original?.description || "N/A"}</p>
          {row.original?.notes && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              Notes: {row.original.notes}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "fixed",
      cell: ({ row }) => (
        <div>
          <Badge
            variant={row.original?.fixed ? "success" : "destructive"}
            className="mb-1"
          >
            {row.original?.fixed ? "Fixed" : "Open"}
          </Badge>
          {row.original?.fixed && (
            <p className="text-xs text-muted-foreground">Fixed by staff</p>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "submittedAt",
      cell: ({ row }) => (
        <div>
          {row.original?.submittedAt
            ? new Date(row.original.submittedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </div>
      ),
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <IssueDetailDialog
            issue={row.original}
            onStatusChange={(inspectionId, categoryId, itemId, fixed) => {
              // Update the local state when status changes
              setIssues((prevIssues) =>
                prevIssues.map((issue) => {
                  if (
                    issue.inspectionId === inspectionId &&
                    issue.categoryId === categoryId &&
                    issue.itemId === itemId
                  ) {
                    return { ...issue, fixed };
                  }
                  return issue;
                })
              );
            }}
          />
        </div>
      ),
    },
  ];

  // Columns for inspections table
  const inspectionColumns = [
    {
      header: "Store",
      accessorKey: "storeNumber",
      cell: ({ row }) => <div>{row.original?.storeNumber || "N/A"}</div>,
    },
    {
      header: "Inspector",
      accessorKey: "inspectedBy",
      cell: ({ row }) => <div>{row.original?.inspectedBy || "N/A"}</div>,
    },
    {
      header: "Date",
      accessorKey: "inspectionDate",
      cell: ({ row }) => (
        <div>
          {row.original?.inspectionDate
            ? new Date(row.original.inspectionDate).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : row.original?.clientDate
            ? new Date(row.original.clientDate).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </div>
      ),
    },
    {
      header: "Issues",
      cell: ({ row }) => {
        // Add defensive check for categories
        const issueCount =
          row.original &&
          row.original.categories &&
          Array.isArray(row.original.categories)
            ? row.original.categories.reduce((count, category) => {
                // Add defensive check for items
                if (
                  category &&
                  category.items &&
                  Array.isArray(category.items)
                ) {
                  return (
                    count +
                    category.items.filter(
                      (item) => item && item.status === "no"
                    ).length
                  );
                }
                return count;
              }, 0)
            : 0;

        const fixedIssueCount =
          row.original &&
          row.original.categories &&
          Array.isArray(row.original.categories)
            ? row.original.categories.reduce((count, category) => {
                // Add defensive check for items
                if (
                  category &&
                  category.items &&
                  Array.isArray(category.items)
                ) {
                  return (
                    count +
                    category.items.filter(
                      (item) => item && item.status === "no" && item.fixed
                    ).length
                  );
                }
                return count;
              }, 0)
            : 0;

        return (
          <div className="space-y-1">
            <Badge
              variant={
                issueCount === 0
                  ? "outline"
                  : issueCount === fixedIssueCount && issueCount > 0
                  ? "success"
                  : "destructive"
              }
            >
              {issueCount} {issueCount === 1 ? "Issue" : "Issues"}
            </Badge>

            {issueCount > 0 && fixedIssueCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {fixedIssueCount} fixed / {issueCount - fixedIssueCount} open
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Submitted",
      accessorKey: "submittedAt",
      cell: ({ row }) => (
        <div>
          {row.original?.submittedAt
            ? new Date(row.original.submittedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </div>
      ),
    },
  ];

  // Function to export data as CSV
  const exportToCsv = (data, filename) => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Convert data to CSV format
      let csvContent = "data:text/csv;charset=utf-8,";

      // Create headers based on data type
      if (filename.includes("issues")) {
        csvContent += "Store,Category,Issue,Status,Date\n";

        // Add rows
        data.forEach((item) => {
          if (!item) return;

          const row = [
            item.storeNumber || "",
            item.categoryTitle || "",
            item.description ? `"${item.description.replace(/"/g, '""')}"` : "",
            item.fixed ? "Fixed" : "Open",
            item.submittedAt
              ? new Date(item.submittedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          ];
          csvContent += row.join(",") + "\n";
        });
      } else {
        csvContent += "Store,Inspector,Date,Issues,Submitted\n";

        // Add rows
        data.forEach((item) => {
          if (!item) return;

          // Add defensive check for categories
          const issueCount =
            item.categories && Array.isArray(item.categories)
              ? item.categories.reduce((count, category) => {
                  // Add defensive check for items
                  if (
                    category &&
                    category.items &&
                    Array.isArray(category.items)
                  ) {
                    return (
                      count +
                      category.items.filter((i) => i && i.status === "no")
                        .length
                    );
                  }
                  return count;
                }, 0)
              : 0;

          const row = [
            item.storeNumber || "",
            item.inspectedBy ? `"${item.inspectedBy.replace(/"/g, '""')}"` : "",
            item.inspectionDate
              ? new Date(item.inspectionDate).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : item.clientDate
              ? new Date(item.clientDate).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            issueCount,
            item.submittedAt
              ? new Date(item.submittedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
          ];
          csvContent += row.join(",") + "\n";
        });
      }

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export successful");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error(
        "Failed to export data: " + (error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Overview</CardTitle>
            <CardDescription>Summary of inspections and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Inspections
                  </p>
                  <p className="text-2xl font-bold">{inspections.length}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-destructive/10 p-2 rounded-full">
                  <BarChart3 className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Issues</p>
                  <p className="text-2xl font-bold">
                    {issues.filter((issue) => issue && !issue.fixed).length}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Store className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Stores Inspected
                  </p>
                  <p className="text-2xl font-bold">
                    {
                      new Set(
                        inspections
                          .filter((i) => i?.storeNumber)
                          .map((i) => i.storeNumber)
                      ).size
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs
          defaultValue="issues"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="categories">Categories & Items</TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  exportToCsv(
                    filteredIssues,
                    `csr-issues-${new Date().toISOString().split("T")[0]}`
                  )
                }
                disabled={filteredIssues.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">All Issues</CardTitle>
                <CardDescription>
                  View and manage all reported issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={issueColumns}
                  data={filteredIssues}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inspections..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  exportToCsv(
                    filteredInspections,
                    `csr-inspections-${new Date().toISOString().split("T")[0]}`
                  )
                }
                disabled={filteredInspections.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export to CSV
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Inspections</CardTitle>
                <CardDescription>
                  View all completed inspections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={inspectionColumns}
                  data={filteredInspections}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Categories & Items</CardTitle>
                <CardDescription>
                  Manage inspection categories and items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
