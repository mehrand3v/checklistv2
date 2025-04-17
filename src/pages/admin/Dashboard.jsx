// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Filter,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { useAuth } from "@/context/AuthContext";
import { getAllIssues, getAllInspections, deleteInspection } from "@/services/api";
import { toast } from "sonner";
import { IssueDetailDialog } from "@/components/admin/IssueDetailDialog";
import CategoryManagement from "@/components/admin/CategoryManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("issues");
  const [selectedStore, setSelectedStore] = useState("all");
  const [storeStats, setStoreStats] = useState({});
  const [uniqueStores, setUniqueStores] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Delete dialog state
  const [inspectionToDelete, setInspectionToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch data
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

  // Calculate unique stores
  useEffect(() => {
    const stores = [...new Set(inspections.map(i => i?.storeNumber).filter(Boolean))].sort();
    setUniqueStores(stores);
  }, [inspections]);

  // Calculate store-specific statistics
  useEffect(() => {
    const stats = {};
    uniqueStores.forEach(storeNumber => {
      const storeInspections = inspections.filter(i => i?.storeNumber === storeNumber);
      const storeIssues = issues.filter(i => i?.storeNumber === storeNumber);
      
      stats[storeNumber] = {
        totalInspections: storeInspections.length,
        openIssues: storeIssues.filter(i => !i.fixed).length,
        fixedIssues: storeIssues.filter(i => i.fixed).length,
        lastInspection: storeInspections.length > 0 
          ? new Date(Math.max(...storeInspections.map(i => new Date(i.inspectionDate || i.clientDate))))
          : null,
        issueTrend: calculateIssueTrend(storeIssues),
      };
    });
    setStoreStats(stats);
  }, [inspections, issues, uniqueStores]);

  // Calculate issue trend (improving, worsening, or stable)
  const calculateIssueTrend = (storeIssues) => {
    if (storeIssues.length < 2) return 'stable';
    
    const recentIssues = storeIssues
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5);
    
    const openCount = recentIssues.filter(i => !i.fixed).length;
    const previousOpenCount = storeIssues
      .filter(i => !i.fixed && new Date(i.submittedAt) < new Date(recentIssues[recentIssues.length - 1].submittedAt))
      .slice(0, 5).length;
    
    if (openCount > previousOpenCount) return 'worsening';
    if (openCount < previousOpenCount) return 'improving';
    return 'stable';
  };

  // Filter data based on selected store
  const getFilteredData = (data) => {
    if (selectedStore === "all") return data;
    return data.filter(item => item?.storeNumber === selectedStore);
  };

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

  // Get paginated data
  const getPaginatedData = (data) => {
    const filteredData = getFilteredData(data);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Update total pages when filtered data changes
  useEffect(() => {
    const data = activeTab === "issues" ? filteredIssues : filteredInspections;
    const filteredData = getFilteredData(data);
    const newTotalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    setTotalPages(newTotalPages);
    
    // Reset to first page if current page is out of bounds
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredIssues, filteredInspections, selectedStore, itemsPerPage, activeTab]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    // Adjust current page to maintain the same items in view
    const newCurrentPage = Math.min(
      Math.ceil((currentPage * itemsPerPage) / newItemsPerPage),
      Math.ceil(getFilteredData(activeTab === "issues" ? filteredIssues : filteredInspections).length / newItemsPerPage)
    );
    setCurrentPage(newCurrentPage);
  };

  // Handle delete inspection
  const handleDeleteInspection = async () => {
    if (!inspectionToDelete) return;
    
    try {
      setDeleteLoading(true);
      const result = await deleteInspection(inspectionToDelete.id);
      
      if (result.success) {
        // Remove the inspection from state
        setInspections(prev => prev.filter(i => i.id !== inspectionToDelete.id));
        
        // Also remove associated issues
        setIssues(prev => prev.filter(i => i.inspectionId !== inspectionToDelete.id));
        
        toast.success("Inspection deleted successfully");
      } else {
        toast.error("Failed to delete inspection: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting inspection:", error);
      toast.error("An error occurred while deleting the inspection");
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
      setInspectionToDelete(null);
    }
  };

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
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Implement edit functionality
              toast.info("Edit functionality coming soon");
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setInspectionToDelete(row.original);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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

  // Render pagination controls
  const renderPagination = () => {
    const data = activeTab === "issues" ? filteredIssues : filteredInspections;
    const filteredData = getFilteredData(data);
    const totalItems = filteredData.length;
    
    if (totalItems === 0) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    
    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return (
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {`${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* First page */}
          {startPage > 1 && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {/* Page numbers */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          {/* Last page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Store Filter */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Store Overview</CardTitle>
            <CardDescription>Select a store to view detailed statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {uniqueStores.map(store => (
                    <SelectItem key={store} value={store}>
                      Store {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedStore === "all" ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Inspections</p>
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
                        {issues.filter(issue => issue && !issue.fixed).length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <Store className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Stores</p>
                      <p className="text-2xl font-bold">{uniqueStores.length}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Store Inspections</p>
                      <p className="text-2xl font-bold">{storeStats[selectedStore]?.totalInspections || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-destructive/10 p-2 rounded-full">
                      <BarChart3 className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Issues</p>
                      <p className="text-2xl font-bold">{storeStats[selectedStore]?.openIssues || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        Trend: {storeStats[selectedStore]?.issueTrend || 'stable'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <Store className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Inspection</p>
                      <p className="text-2xl font-bold">
                        {storeStats[selectedStore]?.lastInspection
                          ? new Date(storeStats[selectedStore].lastInspection).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </>
              )}
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Issues</CardTitle>
                <CardDescription>
                  View and manage reported issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => exportToCsv(getFilteredData(filteredIssues), "issues")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <DataTable
                  columns={issueColumns}
                  data={getPaginatedData(filteredIssues)}
                  loading={loading}
                />
                <div className="mt-4">
                  {renderPagination()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inspections">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Inspections</CardTitle>
                <CardDescription>
                  View inspection history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inspections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => exportToCsv(getFilteredData(filteredInspections), "inspections")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <DataTable
                  columns={inspectionColumns}
                  data={getPaginatedData(filteredInspections)}
                  loading={loading}
                />
                <div className="mt-4">
                  {renderPagination()}
                </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inspection? This action cannot be undone.
              All associated issues will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInspection}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
