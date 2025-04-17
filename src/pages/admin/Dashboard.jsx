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
  Download,
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

// Add this new component for viewing inspection details
function InspectionDetailDialog({ inspection, open, onOpenChange }) {
  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inspection Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Store Number</h3>
              <p>{inspection.storeNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Inspector</h3>
              <p>{inspection.inspectedBy}</p>
            </div>
            <div>
              <h3 className="font-semibold">Inspection Date</h3>
              <p>{new Date(inspection.inspectionDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <Badge variant={inspection.fixed ? "success" : "destructive"}>
                {inspection.fixed ? "Fixed" : "Pending"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Categories</h3>
            {inspection.categories?.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{category.title}</h4>
                <div className="space-y-2">
                  {category.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-2 bg-muted/50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.description}</p>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Notes: {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <Badge
                          variant={
                            item.status === "yes"
                              ? "success"
                              : item.fixed
                              ? "default"
                              : "destructive"
                          }
                        >
                          {item.status === "yes"
                            ? "Pass"
                            : item.fixed
                            ? "Fixed"
                            : "Fail"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add this function before the AdminDashboard component
const generatePDF = async (inspections) => {
  try {
    console.log("Starting PDF generation with data:", inspections);
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font
    pdf.setFont("helvetica");
    
    // Add title
    pdf.setFontSize(20);
    pdf.text("Inspection Reports", 105, 20, { align: "center" });
    
    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
    
    // Process each inspection
    const inspectionsArray = Array.isArray(inspections) ? inspections : [inspections];
    let yOffset = 40; // Start position for content
    
    // Helper function to wrap text
    const wrapText = (text, maxWidth) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = pdf.getStringUnitWidth(currentLine + " " + word) * pdf.getFontSize() / pdf.internal.scaleFactor;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Helper function to add wrapped text
    const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
      const lines = wrapText(text, maxWidth);
      lines.forEach((line, index) => {
        pdf.text(line, x, y + (index * lineHeight));
      });
      return lines.length * lineHeight;
    };
    
    inspectionsArray.forEach((inspection, index) => {
      // Check if we need a new page
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }
      
      // Add inspection header
      pdf.setFontSize(16);
      pdf.text(`Inspection #${index + 1}`, 20, yOffset);
      yOffset += 10;
      
      // Add inspection details
      pdf.setFontSize(12);
      pdf.setFillColor(248, 249, 250);
      pdf.rect(20, yOffset, 170, 25, "F");
      
      // Store info
      pdf.text(`Store Number: ${inspection.storeNumber || 'N/A'}`, 25, yOffset + 7);
      pdf.text(`Inspector: ${inspection.inspectedBy || 'N/A'}`, 25, yOffset + 15);
      
      // Date info
      pdf.text(`Date: ${inspection.inspectionDate ? new Date(inspection.inspectionDate).toLocaleDateString() : 'N/A'}`, 110, yOffset + 7);
      pdf.text(`Status: ${inspection.submittedAt ? 'Submitted' : 'Pending'}`, 110, yOffset + 15);
      
      yOffset += 35;
      
      // Add categories
      inspection.categories?.forEach(category => {
        // Check if we need a new page
        if (yOffset > 250) {
          pdf.addPage();
          yOffset = 20;
        }
        
        // Category title
        pdf.setFontSize(14);
        pdf.setDrawColor(51, 51, 51);
        pdf.line(20, yOffset, 190, yOffset);
        pdf.text(category.title, 20, yOffset - 5);
        yOffset += 15;
        
        // Category items
        category.items?.forEach(item => {
          // Check if we need a new page
          if (yOffset > 250) {
            pdf.addPage();
            yOffset = 20;
          }
          
          // Calculate height needed for content
          const descriptionLines = wrapText(item.description, 150);
          const notesLines = item.notes ? wrapText(item.notes, 150) : [];
          const totalHeight = Math.max(20, (descriptionLines.length + notesLines.length + 1) * 5);
          
          // Item box
          pdf.setFontSize(11);
          const itemColor = item.status === 'yes' ? [240, 255, 244] : item.fixed ? [240, 247, 255] : [255, 240, 240];
          pdf.setFillColor(...itemColor);
          pdf.rect(20, yOffset, 170, totalHeight, "F");
          
          // Item content
          pdf.setTextColor(0, 0, 0);
          let currentY = yOffset + 7;
          
          // Description
          descriptionLines.forEach((line, i) => {
            pdf.text(line, 25, currentY);
            currentY += 5;
          });
          
          // Status
          const statusText = item.status === 'yes' ? 'Pass' : item.fixed ? 'Fixed' : 'Fail';
          const statusColor = item.status === 'yes' ? [0, 128, 0] : item.fixed ? [0, 0, 255] : [255, 0, 0];
          pdf.setTextColor(...statusColor);
          pdf.text(`Status: ${statusText}`, 25, currentY);
          
          // Notes
          if (item.notes) {
            currentY += 5;
            pdf.setTextColor(102, 102, 102);
            pdf.setFontSize(10);
            notesLines.forEach((line, i) => {
              pdf.text(`Note: ${line}`, 25, currentY);
              currentY += 5;
            });
          }
          
          pdf.setTextColor(0, 0, 0);
          yOffset += totalHeight + 5;
        });
        
        yOffset += 10;
      });
      
      // Add page break after each inspection
      if (index < inspectionsArray.length - 1) {
        pdf.addPage();
        yOffset = 20;
      }
    });
    
    // Save the PDF
    pdf.save(`inspections-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF: " + (error.message || "Unknown error"));
  }
};

export default function AdminDashboard() {
  const { currentUser, canDelete, canEdit } = useAuth();
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
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedInspection(row.original);
              setShowInspectionDetail(true);
            }}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Eye className="h-4 w-4 text-blue-500" />
          </Button>
          {canEdit() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditInspection(row.original)}
              className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <Edit className="h-4 w-4 text-amber-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => generatePDF(row.original)}
            className="hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <FileDown className="h-4 w-4 text-green-500" />
          </Button>
          {canDelete() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setInspectionToDelete(row.original);
                setShowDeleteDialog(true);
              }}
              className="hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
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
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronsLeft className="h-4 w-4 text-blue-500" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronLeft className="h-4 w-4 text-blue-500" />
          </Button>
          
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
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronsRight className="h-4 w-4 text-blue-500" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Admin Dashboard</h1>

      {/* Store Filter */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Store Overview</CardTitle>
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
          <TabsList className="mb-6">
            <TabsTrigger 
              value="inspections" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300"
            >
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Inspections</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
            >
              <Database className="h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Categories & Items</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <AnimatePresence>
              <TabsContent value="inspections" key="inspections">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Inspections</CardTitle>
                      <CardDescription>
                        View inspection history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 mb-4">
                        <div className="relative flex-1 w-full sm:w-auto">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500" />
                          <Input
                            placeholder="Search inspections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full"
                          />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              if (filteredInspections.length > 0) {
                                exportToCsv(filteredInspections, "inspections.csv");
                              } else {
                                toast.error("No data to export");
                              }
                            }}>
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              if (filteredInspections.length > 0) {
                                try {
                                  generatePDF(filteredInspections);
                                } catch (error) {
                                  console.error("Error in PDF generation:", error);
                                  toast.error("Failed to generate PDF: " + (error.message || "Unknown error"));
                                }
                              } else {
                                toast.error("No data to export");
                              }
                            }}>
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              Export as PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full inline-block align-middle">
                          <DataTable
                            columns={inspectionColumns}
                            data={getPaginatedData(filteredInspections)}
                            loading={loading}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        {renderPagination()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="categories" key="categories">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Categories & Items</CardTitle>
                      <CardDescription>
                        Manage inspection categories and items
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full inline-block align-middle">
                          <CategoryManagement />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
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
              className="bg-red-600 text-white hover:bg-red-700"
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
