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
  Eye,
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
import { EditInspectionDialog } from "@/components/admin/EditInspectionDialog";

// Add this new component for viewing inspection details
function InspectionDetailDialog({ inspection, open, onOpenChange }) {
  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inspection Details</DialogTitle>
          <DialogDescription>
            Complete inspection results for Store {inspection.storeNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Inspection Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Store</p>
              <p className="text-lg font-semibold">{inspection.storeNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inspector</p>
              <p className="text-lg font-semibold">{inspection.inspectedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">
                {inspection.inspectionDate
                  ? new Date(inspection.inspectionDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : inspection.clientDate
                  ? new Date(inspection.clientDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Categories and Items */}
          {inspection.categories && inspection.categories.length > 0 ? (
            <div className="space-y-6">
              {inspection.categories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>
                      {category.items && category.items.length > 0
                        ? `${category.items.filter(item => item && item.status === "no").length} issues found`
                        : "No issues found"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items && category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{item.text}</p>
                              {item.notes && (
                                <p className="text-sm text-muted-foreground">{item.notes}</p>
                              )}
                            </div>
                            <Badge
                              variant={item.status === "yes" ? "outline" : item.fixed ? "success" : "destructive"}
                              className="ml-2"
                            >
                              {item.status === "yes" ? "Pass" : item.fixed ? "Fixed" : "Fail"}
                            </Badge>
                          </div>
                          {item.hasPhoto && (
                            <div className="mt-2">
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <Eye className="h-3 w-3" />
                                Photo available
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No categories or items found in this inspection.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inspections");
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

  // Edit dialog state
  const [inspectionToEdit, setInspectionToEdit] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Add state for inspection detail dialog
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showInspectionDetail, setShowInspectionDetail] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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
      
      stats[storeNumber] = {
        totalInspections: storeInspections.length,
        lastInspection: storeInspections.length > 0 
          ? new Date(Math.max(...storeInspections.map(i => new Date(i.inspectionDate || i.clientDate))))
          : null,
      };
    });
    setStoreStats(stats);
  }, [inspections, uniqueStores]);

  // Filter data based on selected store
  const getFilteredData = (data) => {
    if (selectedStore === "all") return data;
    return data.filter(item => item?.storeNumber === selectedStore);
  };

  // Filter inspections based on search term
  const filteredInspections = inspections.filter(
    (inspection) =>
      inspection &&
      ((inspection.storeNumber &&
        inspection.storeNumber.toString().includes(searchTerm || "")) ||
        (inspection.inspectedBy &&
          inspection.inspectedBy
            .toLowerCase()
            .includes(searchTerm || "")))
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
    const filteredData = getFilteredData(filteredInspections);
    const newTotalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    setTotalPages(newTotalPages);
    
    // Reset to first page if current page is out of bounds
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredInspections, selectedStore, itemsPerPage]);

  // Handle delete inspection
  const handleDeleteInspection = async () => {
    if (!inspectionToDelete) return;
    
    try {
      setDeleteLoading(true);
      const result = await deleteInspection(inspectionToDelete.id);
      
      if (result.success) {
        // Remove the inspection from state
        setInspections(prev => prev.filter(i => i.id !== inspectionToDelete.id));
        
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

  // Handle edit inspection
  const handleEditInspection = (inspection) => {
    setInspectionToEdit(inspection);
    setShowEditDialog(true);
  };

  // Handle inspection update
  const handleInspectionUpdate = (updatedInspection) => {
    setInspections((prev) =>
      prev.map((inspection) =>
        inspection.id === updatedInspection.id ? updatedInspection : inspection
      )
    );
  };

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
      header: "Inspection Date",
      accessorKey: "inspectionDate",
      cell: ({ row }) => {
        const date = row.original?.inspectionDate || row.original?.clientDate;
        if (!date) return <div>N/A</div>;
        
        const inspectionDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Format the date with relative time indicator
        let dateDisplay = inspectionDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        
        // Add relative time indicator
        if (inspectionDate.toDateString() === today.toDateString()) {
          dateDisplay += " (Today)";
        } else if (inspectionDate.toDateString() === yesterday.toDateString()) {
          dateDisplay += " (Yesterday)";
        } else {
          const daysDiff = Math.floor((today - inspectionDate) / (1000 * 60 * 60 * 24));
          if (daysDiff < 7) {
            dateDisplay += ` (${daysDiff} days ago)`;
          } else if (daysDiff < 30) {
            const weeks = Math.floor(daysDiff / 7);
            dateDisplay += ` (${weeks} week${weeks > 1 ? 's' : ''} ago)`;
          }
        }
        
        return <div>{dateDisplay}</div>;
      },
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
      header: "Submission Status",
      accessorKey: "submittedAt",
      cell: ({ row }) => {
        const submittedAt = row.original?.submittedAt;
        
        if (!submittedAt) return (
          <div className="flex items-center">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              Pending
            </Badge>
          </div>
        );
        
        const submittedDate = new Date(submittedAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Format the submission date
        let dateDisplay;
        if (submittedDate.toDateString() === today.toDateString()) {
          dateDisplay = "Today";
        } else if (submittedDate.toDateString() === yesterday.toDateString()) {
          dateDisplay = "Yesterday";
        } else {
          dateDisplay = submittedDate.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        }
        
        // Add time
        const timeDisplay = submittedDate.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
        
        return (
          <div className="space-y-1">
            <Badge variant="success" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Submitted
            </Badge>
            <div className="text-xs">
              {dateDisplay} at {timeDisplay}
            </div>
          </div>
        );
      },
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
              setSelectedInspection(row.original);
              setShowInspectionDetail(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditInspection(row.original)}
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
      if (filename.includes("inspections")) {
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
    const data = filteredInspections;
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
            onValueChange={(value) => setItemsPerPage(parseInt(value))}
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
            onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(1)}
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
              onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          defaultValue="inspections"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="categories">Categories & Items</TabsTrigger>
          </TabsList>

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

      {/* Edit Dialog */}
      <EditInspectionDialog
        inspection={inspectionToEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdate={handleInspectionUpdate}
      />

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inspection? This action cannot be undone.
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

      {/* Inspection Detail Dialog */}
      <InspectionDetailDialog
        inspection={selectedInspection}
        open={showInspectionDetail}
        onOpenChange={setShowInspectionDetail}
      />
    </div>
  );
}
