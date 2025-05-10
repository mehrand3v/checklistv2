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
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart2,
  Calendar,
  AlertTriangle,
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
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Add this new component for the no issues celebration dialog
function NoIssuesDialog({ inspection, open, onOpenChange }) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when dialog opens
  useEffect(() => {
    if (open) {
      setShowConfetti(true);

      // Trigger confetti animation with more intensity
      const duration = 5 * 1000; // Longer duration
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 99999, // Much higher z-index to ensure it appears on top of everything
        disableForReducedMotion: false // Ensure it works even with reduced motion settings
      };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 100 * (timeLeft / duration); // More particles

        // Confetti from left side
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
        });

        // Confetti from right side
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
        });

        // Add confetti from bottom for more coverage
        confetti({
          ...defaults,
          particleCount: particleCount / 2,
          origin: { x: randomInRange(0.3, 0.7), y: 0.9 },
          angle: 60,
          spread: 80,
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
        });
      }, 150); // More frequent bursts

      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, [open]);

  // Random positive messages
  const positiveMessages = [
    "Perfect inspection! Keep up the great work!",
    "Outstanding job! Everything looks perfect!",
    "No issues found! This is exactly how it should be!",
    "Excellent work! A flawless inspection!",
    "100% compliance! You're setting the standard!",
    "Incredible attention to detail! No issues at all!",
    "This is what excellence looks like! Perfect score!",
    "Absolutely perfect! Nothing to improve here!"
  ];

  const randomMessage = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2">
            <img
              src="/icon.png"
              alt="SafeWalk Logo"
              className="h-6 w-6 object-contain"
            />
            <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Perfect Inspection!
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-center text-lg font-medium">{randomMessage}</p>
          <div className="grid grid-cols-1 gap-3 w-full mt-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">Store Number</h3>
              <p className="text-blue-900 dark:text-blue-100">{inspection?.storeNumber || "N/A"}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300">Inspector</h3>
              <p className="text-purple-900 dark:text-purple-100">{inspection?.inspectedBy || "N/A"}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <h3 className="font-semibold text-green-700 dark:text-green-300">Inspection Date</h3>
              <p className="text-green-900 dark:text-green-100">{inspection?.inspectionDate ? new Date(inspection.inspectionDate).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Update the component definition to accept additional props
function InspectionDetailDialog({
  inspection,
  open,
  onOpenChange,
  issueFilter,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onGeneratePDF
}) {
  if (!inspection) return null;

  // Filter categories based on issueFilter
  const filteredCategories = inspection.categories?.map(category => ({
    ...category,
    items: category.items?.filter(item => {
      if (issueFilter === 'fixed') {
        return item.status === 'no' && item.fixed;
      } else if (issueFilter === 'open') {
        return item.status === 'no' && !item.fixed;
      }
      return true;
    })
  })).filter(category => category.items.length > 0);

  const getStatusBadge = (status, fixed = false) => {
    switch (status) {
      case 'yes':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Yes</Badge>;
      case 'no':
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">No</Badge>
            {fixed && <Badge variant="outline" className="dark:border-green-500 dark:text-green-400">Fixed</Badge>}
          </div>
        );
      case 'na':
        return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">NA</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Not checked</Badge>;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Format submission date and time
  const formatSubmissionDateTime = () => {
    if (!inspection.submittedAt) return null;

    const submittedDate = new Date(inspection.submittedAt);
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

    return `${dateDisplay} at ${timeDisplay}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icon.png"
                alt="SafeWalk Logo"
                className="h-6 w-6 object-contain"
              />
              <DialogTitle className="text-lg text-foreground">
                Inspection Details
                {issueFilter && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({issueFilter === 'fixed' ? 'Fixed' : 'Not Fixed'} Issues)
                  </span>
                )}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-3">
            {/* Compact info cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-xs">Store Number</h3>
                <p className="text-blue-900 dark:text-blue-100 text-sm">{inspection.storeNumber}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 text-xs">Inspector</h3>
                <p className="text-purple-900 dark:text-purple-100 text-sm">{inspection.inspectedBy}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                <h3 className="font-semibold text-green-700 dark:text-green-300 text-xs">Inspection Date</h3>
                <p className="text-green-900 dark:text-green-100 text-sm">{new Date(inspection.inspectionDate).toLocaleDateString()}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                <h3 className="font-semibold text-amber-700 dark:text-amber-300 text-xs">Status</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={inspection.fixed ? "success" : "destructive"} className="text-xs">
                    {inspection.fixed ? "Fixed" : "Submitted"}
                  </Badge>
                  {inspection.submittedAt && (
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-400/30">
                      {formatSubmissionDateTime()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center justify-between">
                <span>Categories</span>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(inspection)}
                      className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/30"
                      title="Edit inspection"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onGeneratePDF(inspection)}
                    className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                    title="Download PDF"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(inspection)}
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                      title="Delete inspection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </h3>
              {filteredCategories?.map((category) => (
                <div key={category.id} className="border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300 text-sm">{category.title}</h4>
                  <div className="space-y-1.5">
                    {category.items?.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start justify-between p-2 rounded ${
                          item.status === "yes"
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800"
                            : item.fixed
                              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                              : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
                        }`}
                      >
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${
                            item.status === "yes"
                              ? "text-green-900 dark:text-green-100"
                              : item.status === "na"
                                ? "text-gray-900 dark:text-gray-100"
                                : item.fixed
                                  ? "text-blue-900 dark:text-blue-100"
                                  : "text-red-900 dark:text-red-100"
                          }`}>{item.description}</p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Notes: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="ml-3">
                          <Badge
                            variant={
                              item.status === "yes"
                                ? "success"
                                : item.status === "na"
                                  ? "secondary"
                                  : item.fixed
                                    ? "default"
                                    : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.status === "yes"
                              ? "Pass"
                              : item.status === "na"
                                ? "NA"
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30">
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
      pdf.text(`Status: Submitted`, 110, yOffset + 15);

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
          const statusText = item.status === 'yes' ? 'Pass' : item.status === 'na' ? 'NA' : item.fixed ? 'Fixed' : 'Fail';
          const statusColor = item.status === 'yes' ? [0, 128, 0] : item.status === 'na' ? [128, 128, 128] : item.fixed ? [0, 0, 255] : [255, 0, 0];
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

// Add this new component for store comparison
function StoreComparisonDialog({ stores, storeStats, open, onOpenChange }) {
  const [selectedStores, setSelectedStores] = useState([]);

  const compareStores = () => {
    return selectedStores.map(store => ({
      store,
      stats: storeStats[store]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Stores</DialogTitle>
          <DialogDescription>Select up to 3 stores to compare their performance</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(storeStats).map(store => (
              <Button
                key={store}
                variant={selectedStores.includes(store) ? "default" : "outline"}
                onClick={() => {
                  if (selectedStores.includes(store)) {
                    setSelectedStores(selectedStores.filter(s => s !== store));
                  } else if (selectedStores.length < 3) {
                    setSelectedStores([...selectedStores, store]);
                  }
                }}
                className="text-sm"
              >
                Store {store}
              </Button>
            ))}
          </div>

          {selectedStores.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compareStores().map(({ store, stats }) => (
                <Card key={store}>
                  <CardHeader>
                    <CardTitle className="text-lg">Store {store}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Inspections</span>
                        <span className="font-medium">{stats.totalInspections}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg. Issues/Inspection</span>
                        <span className="font-medium">{stats.averageIssuesPerInspection}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="font-medium">{stats.issueResolutionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Inspection</span>
                        <span className="font-medium">
                          {stats.lastInspection ? new Date(stats.lastInspection).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add this new component for issue trends
function IssueTrendsDialog({ inspections, open, onOpenChange }) {
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getTrendData = () => {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - parseInt(timeRange)));

    const filteredInspections = inspections.filter(inspection =>
      new Date(inspection.inspectionDate) >= startDate
    );

    const categories = new Set();
    filteredInspections.forEach(inspection => {
      inspection.categories?.forEach(category => {
        categories.add(category.title);
      });
    });

    const trendData = Array.from(categories).map(category => {
      const categoryInspections = filteredInspections.filter(inspection =>
        inspection.categories?.some(c => c.title === category)
      );

      const totalIssues = categoryInspections.reduce((sum, inspection) => {
        const categoryItems = inspection.categories?.find(c => c.title === category)?.items || [];
        return sum + categoryItems.filter(item => item.status === 'no').length;
      }, 0);

      const fixedIssues = categoryInspections.reduce((sum, inspection) => {
        const categoryItems = inspection.categories?.find(c => c.title === category)?.items || [];
        return sum + categoryItems.filter(item => item.status === 'no' && item.fixed).length;
      }, 0);

      return {
        category,
        totalIssues,
        fixedIssues,
        resolutionRate: totalIssues > 0 ? (fixedIssues / totalIssues) * 100 : 100
      };
    });

    return trendData.sort((a, b) => b.totalIssues - a.totalIssues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Issue Trends</DialogTitle>
          <DialogDescription>Analyze issue patterns and trends</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 180 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(inspections.flatMap(i =>
                  i.categories?.map(c => c.title) || []
                ))).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTrendData()
              .filter(data => selectedCategory === 'all' || data.category === selectedCategory)
              .map(data => (
                <Card key={data.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{data.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Issues</span>
                        <span className="font-medium">{data.totalIssues}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fixed Issues</span>
                        <span className="font-medium">{data.fixedIssues}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="font-medium">{data.resolutionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                        style={{ width: `${data.resolutionRate}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  const [showStoreOverview, setShowStoreOverview] = useState(false);
  const [issueFilter, setIssueFilter] = useState(null);
  const [storePopoverOpen, setStorePopoverOpen] = useState(false);
  const [showStoreComparison, setShowStoreComparison] = useState(false);
  const [showIssueTrends, setShowIssueTrends] = useState(false);

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

  // Add state for no issues dialog
  const [showNoIssuesDialog, setShowNoIssuesDialog] = useState(false);

  // Add state for form validation
  const [storeNumber, setStoreNumber] = useState(inspectionToEdit?.storeNumber || "");
  const [inspector, setInspector] = useState(inspectionToEdit?.inspectedBy || "");
  const [inspectionDate, setInspectionDate] = useState(inspectionToEdit?.inspectionDate ? new Date(inspectionToEdit.inspectionDate).toISOString().split('T')[0] : "");
  const [errors, setErrors] = useState({});

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

      // Calculate total issues and fixed issues
      let totalIssues = 0;
      let totalFixedIssues = 0;
      let categoryIssues = {};

      storeInspections.forEach(inspection => {
        if (inspection.categories && Array.isArray(inspection.categories)) {
          inspection.categories.forEach(category => {
            if (category.items && Array.isArray(category.items)) {
              // Initialize category in stats if not exists
              if (!categoryIssues[category.title]) {
                categoryIssues[category.title] = { total: 0, fixed: 0 };
              }

              category.items.forEach(item => {
                if (item.status === "no") {
                  totalIssues++;
                  categoryIssues[category.title].total++;
                  if (item.fixed) {
                    totalFixedIssues++;
                    categoryIssues[category.title].fixed++;
                  }
                }
              });
            }
          });
        }
      });

      // Calculate inspection frequency (average days between inspections)
      let inspectionFrequency = null;
      if (storeInspections.length > 1) {
        const dates = storeInspections
          .map(i => new Date(i.inspectionDate || i.clientDate))
          .sort((a, b) => a - b);

        let totalDays = 0;
        for (let i = 1; i < dates.length; i++) {
          totalDays += (dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
        }
        inspectionFrequency = Math.round(totalDays / (dates.length - 1));
      }

      stats[storeNumber] = {
        totalInspections: storeInspections.length,
        lastInspection: storeInspections.length > 0
          ? new Date(Math.max(...storeInspections.map(i => new Date(i.inspectionDate || i.clientDate))))
          : null,
        averageIssuesPerInspection: storeInspections.length > 0
          ? (totalIssues / storeInspections.length).toFixed(1)
          : 0,
        issueResolutionRate: totalIssues > 0
          ? ((totalFixedIssues / totalIssues) * 100).toFixed(1)
          : 100,
        inspectionFrequency,
        categoryIssues,
        totalIssues,
        totalFixedIssues
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
  const handleInspectionUpdate = async (updatedInspection) => {
    try {
      // Update the local state
      setInspections((prev) =>
        prev.map((inspection) =>
          inspection.id === updatedInspection.id
            ? { ...updatedInspection, status: 'submitted' }
            : inspection
        )
      );

      // Refresh the inspections list from the server
      const inspectionsResult = await getAllInspections();
      if (inspectionsResult.success) {
        setInspections(inspectionsResult.inspections || []);
        toast.success("Inspection updated successfully");
      } else {
        toast.error("Failed to refresh inspections: " + inspectionsResult.error);
      }
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast.error("An error occurred while updating the inspection");
    }
  };

  // Columns for inspections table
  const inspectionColumns = [
    {
      header: "Store",
      accessorKey: "storeNumber",
      cell: ({ row }) => (
        <div className="font-medium text-blue-700 dark:text-blue-300">
          {row.original?.storeNumber || "N/A"}
        </div>
      ),
    },
    {
      header: "Inspector",
      accessorKey: "inspectedBy",
      cell: ({ row }) => (
        <div className="font-medium text-purple-700 dark:text-purple-300">
          {row.original?.inspectedBy || "N/A"}
        </div>
      ),
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

        // Format the date with year in compact format
        let dateDisplay = inspectionDate.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        });

        // Add relative time indicator with special styling
        let timeIndicator = "";
        let timeIndicatorClass = "";

        if (inspectionDate.toDateString() === today.toDateString()) {
          timeIndicator = " (Today)";
          timeIndicatorClass = "text-amber-600 dark:text-amber-400 text-xs";
        } else if (inspectionDate.toDateString() === yesterday.toDateString()) {
          timeIndicator = " (Yesterday)";
          timeIndicatorClass = "text-indigo-600 dark:text-indigo-400 text-xs";
        } else {
          const daysDiff = Math.floor((today - inspectionDate) / (1000 * 60 * 60 * 24));
          if (daysDiff < 7) {
            timeIndicator = ` (${daysDiff}d)`;
            timeIndicatorClass = "text-teal-600 dark:text-teal-400 text-xs";
          }
        }

        return (
          <div className="font-medium text-green-700 dark:text-green-300 text-sm">
            {dateDisplay}
            {timeIndicator && <span className={timeIndicatorClass}>{timeIndicator}</span>}
          </div>
        );
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

        // If there are no issues, show a clickable status indicator
        if (issueCount === 0) {
          return (
            <Badge
              variant="success"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const defaults = {
                  origin: { y: 0.6 },
                  gravity: 0.5,
                  startVelocity: 15,
                  spread: 70,
                  ticks: 200,
                  zIndex: 9999,
                  scalar: 1,
                  shapes: ['circle', 'square'],
                  colors: [
                    '#4ADE80',
                    '#60A5FA',
                    '#F472B6',
                    '#A78BFA',
                    '#FBBF24',
                    '#FFFFFF'
                  ]
                };

                confetti({
                  ...defaults,
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-1"></div>
              All Clear
            </Badge>
          );
        }

        // Otherwise show fixed and not fixed counts with icons
        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {fixedIssueCount > 0 && (
              <Badge
                variant="success"
                onClick={() => {
                  setSelectedInspection(row.original);
                  setIssueFilter('fixed');
                  setShowInspectionDetail(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {fixedIssueCount}
              </Badge>
            )}
            {(issueCount - fixedIssueCount) > 0 && (
              <Badge
                variant="destructive"
                onClick={() => {
                  setSelectedInspection(row.original);
                  setIssueFilter('open');
                  setShowInspectionDetail(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {issueCount - fixedIssueCount}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedInspection(row.original);
            setShowNoIssuesDialog(false);
            setShowInspectionDetail(true);
          }}
          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <Eye className="h-4 w-4 text-blue-500" />
        </Button>
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

          const naCount =
            item.categories && Array.isArray(item.categories)
              ? item.categories.reduce((count, category) => {
                  if (
                    category &&
                    category.items &&
                    Array.isArray(category.items)
                  ) {
                    return (
                      count +
                      category.items.filter((i) => i && i.status === "na")
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
              ? new Date(item.inspectionDate).toLocaleDateString()
              : "",
            `${issueCount} issues${naCount > 0 ? `, ${naCount} NA` : ''}`,
            item.submittedAt
              ? new Date(item.submittedAt).toLocaleString()
              : "",
          ].join(",");
          csvContent += row + "\n";
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
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5; // Show fewer pages on mobile

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Rows per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px] text-xs sm:text-sm">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()} className="text-xs sm:text-sm">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {`${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center sm:justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronsLeft className="h-4 w-4 text-blue-500" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronLeft className="h-4 w-4 text-blue-500" />
          </Button>

          {/* Page numbers - show fewer on mobile */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm"
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Last page - only show on desktop */}
          {endPage < totalPages && (
            <div className="hidden sm:flex items-center space-x-1">
              <span className="text-muted-foreground text-sm">...</span>
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="h-9 w-9 p-0"
              >
                {totalPages}
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronRight className="h-4 w-4 text-blue-500" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronsRight className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      </div>
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Store number validation (1-7 digits)
    if (!storeNumber) {
      newErrors.storeNumber = "Store number is required";
    } else if (!/^\d{1,7}$/.test(storeNumber)) {
      newErrors.storeNumber = "Store number must be 1-7 digits";
    }

    // Inspection date validation (no future dates)
    if (!inspectionDate) {
      newErrors.inspectionDate = "Inspection date is required";
    } else {
      const selectedDate = new Date(inspectionDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (selectedDate > today) {
        newErrors.inspectionDate = "Inspection date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({
        ...inspectionToEdit,
        storeNumber,
        inspectedBy: inspector,
        inspectionDate,
        status: 'submitted'
      });
      setShowEditDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/80 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4 lg:px-6">
        <h1 className="text-lg font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Dashboard
        </h1>

        {/* Store Filter - Expandable */}
        <div className="mb-4 sm:mb-6">
          <Card>
            <CardHeader
              className="pb-2 cursor-pointer"
              onClick={() => setShowStoreOverview(!showStoreOverview)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg">Store Analytics</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Select a store to view detailed statistics</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  {showStoreOverview ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {showStoreOverview && (
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                  <Popover open={storePopoverOpen} onOpenChange={setStorePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full sm:w-[200px] justify-between"
                      >
                        {selectedStore === "all" ? "All Stores" : `Store ${selectedStore}`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="all"
                            onSelect={() => {
                              setSelectedStore("all");
                              setStorePopoverOpen(false);
                            }}
                          >
                            All Stores
                          </CommandItem>
                          {uniqueStores.map((store) => (
                            <CommandItem
                              key={store}
                              value={store}
                              onSelect={() => {
                                setSelectedStore(store);
                                setStorePopoverOpen(false);
                              }}
                            >
                              Store {store}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStoreComparison(true)}
                      className="flex items-center gap-2"
                    >
                      <BarChart2 className="h-4 w-4" />
                      Compare Stores
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowIssueTrends(true)}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Issue Trends
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {selectedStore === "all" ? (
                    <>
                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Total Inspections</p>
                          <p className="text-xl sm:text-2xl font-bold">{inspections.length}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <Store className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Active Stores</p>
                          <p className="text-xl sm:text-2xl font-bold">{uniqueStores.length}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Total Issues</p>
                          <p className="text-xl sm:text-2xl font-bold">
                            {Object.values(storeStats).reduce((sum, stat) => sum + (stat.totalIssues || 0), 0)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Resolution Rate</p>
                          <p className="text-xl sm:text-2xl font-bold">
                            {(() => {
                              const totalIssues = Object.values(storeStats).reduce((sum, stat) => sum + (stat.totalIssues || 0), 0);
                              const totalFixed = Object.values(storeStats).reduce((sum, stat) => sum + (stat.totalFixedIssues || 0), 0);
                              return totalIssues > 0 ? `${((totalFixed / totalIssues) * 100).toFixed(1)}%` : '100%';
                            })()}
                          </p>
                        </div>
                      </div>

                      {/* Top Performing Stores */}
                      <div className="col-span-full mt-4">
                        <h3 className="text-sm font-semibold mb-2">Top Performing Stores</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(storeStats)
                            .sort((a, b) => {
                              const aRate = a[1].issueResolutionRate || 100;
                              const bRate = b[1].issueResolutionRate || 100;
                              return bRate - aRate;
                            })
                            .slice(0, 3)
                            .map(([store, stats]) => (
                              <div key={store} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                <p className="font-medium text-sm mb-1">Store {store}</p>
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                  <span className="text-muted-foreground">Resolution Rate</span>
                                  <span className="text-green-600 dark:text-green-400">
                                    {stats.issueResolutionRate}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
                                  <span className="text-muted-foreground">Total Issues</span>
                                  <span>{stats.totalIssues}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Store Inspections</p>
                          <p className="text-xl sm:text-2xl font-bold">{storeStats[selectedStore]?.totalInspections || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <Store className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Last Inspection</p>
                          <p className="text-xl sm:text-2xl font-bold">
                            {storeStats[selectedStore]?.lastInspection
                              ? new Date(storeStats[selectedStore].lastInspection).toLocaleDateString()
                              : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Avg. Issues/Inspection</p>
                          <p className="text-xl sm:text-2xl font-bold">{storeStats[selectedStore]?.averageIssuesPerInspection || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Issue Resolution</p>
                          <p className="text-xl sm:text-2xl font-bold">{storeStats[selectedStore]?.issueResolutionRate || 100}%</p>
                        </div>
                      </div>

                      {storeStats[selectedStore]?.inspectionFrequency && (
                        <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="bg-amber-500/10 p-2 rounded-full">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Avg. Days Between Inspections</p>
                            <p className="text-xl sm:text-2xl font-bold">{storeStats[selectedStore].inspectionFrequency}</p>
                          </div>
                        </div>
                      )}

                      {/* Category-wise Issues Breakdown */}
                      {Object.entries(storeStats[selectedStore]?.categoryIssues || {}).length > 0 && (
                        <div className="col-span-full mt-4">
                          <h3 className="text-sm font-semibold mb-2">Category-wise Issues</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(storeStats[selectedStore].categoryIssues)
                              .sort((a, b) => b[1].total - a[1].total)
                              .map(([category, stats]) => (
                                <div key={category} className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                  <p className="font-medium text-sm mb-1">{category}</p>
                                  <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Total: {stats.total}</span>
                                    <span className="text-green-600 dark:text-green-400">
                                      Fixed: {stats.fixed} ({stats.total > 0 ? ((stats.fixed / stats.total) * 100).toFixed(1) : 100}%)
                                    </span>
                                  </div>
                                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                                      style={{ width: `${(stats.fixed / stats.total) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Trend */}
                      {storeStats[selectedStore]?.totalInspections > 1 && (
                        <div className="col-span-full mt-4">
                          <h3 className="text-sm font-semibold mb-2">Recent Trend</h3>
                          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm mb-2">
                              <span className="text-muted-foreground">Last 3 Inspections</span>
                              <span className="text-blue-600 dark:text-blue-400 mt-1 sm:mt-0">
                                {storeStats[selectedStore].inspectionFrequency} days avg. interval
                              </span>
                            </div>
                            <div className="space-y-2">
                              {inspections
                                .filter(i => i.storeNumber === selectedStore)
                                .sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate))
                                .slice(0, 3)
                                .map((inspection, index) => {
                                  const issueCount = inspection.categories?.reduce((count, category) =>
                                    count + (category.items?.filter(item => item.status === "no").length || 0), 0) || 0;
                                  const fixedCount = inspection.categories?.reduce((count, category) =>
                                    count + (category.items?.filter(item => item.status === "no" && item.fixed).length || 0), 0) || 0;

                                  return (
                                    <div key={inspection.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
                                      <span className="text-muted-foreground">
                                        {new Date(inspection.inspectionDate).toLocaleDateString()}
                                      </span>
                                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                        <span className={issueCount === 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                                          {issueCount} issues
                                        </span>
                                        {issueCount > 0 && (
                                          <span className="text-blue-600 dark:text-blue-400">
                                            ({fixedCount} fixed)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Tabs
            defaultValue="inspections"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
              <TabsTrigger
                value="inspections"
                className="flex-1 sm:flex-none flex items-center gap-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-sm sm:text-base">Inspections</span>
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex-1 sm:flex-none flex items-center gap-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
              >
                <Database className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium text-sm sm:text-base">Categories & Items</span>
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
                      <CardContent className="bg-gradient-to-br from-sky-50/80 via-indigo-50/50 to-purple-50/80 dark:from-sky-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-b-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2 mb-4">
                          <div className="relative flex-1 w-full sm:w-auto">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500" />
                            <Input
                              placeholder="Search inspections..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8 w-full bg-white/50 dark:bg-slate-950/50"
                            />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-white/50 dark:bg-slate-950/50">
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
                              rowClassName={(rowIndex) =>
                                rowIndex % 2 === 0
                                  ? "bg-white/50 hover:bg-sky-100/50 transition-colors duration-150"
                                  : "bg-white/30 hover:bg-purple-100/50 transition-colors duration-150"
                              }
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
          onOpenChange={(open) => {
            setShowInspectionDetail(open);
            if (!open) {
              setIssueFilter(null);
            }
          }}
          issueFilter={issueFilter}
          canEdit={canEdit()}
          canDelete={canDelete()}
          onEdit={(inspection) => {
            setInspectionToEdit(inspection);
            setShowEditDialog(true);
            setShowInspectionDetail(false);
          }}
          onDelete={(inspection) => {
            setInspectionToDelete(inspection);
            setShowDeleteDialog(true);
            setShowInspectionDetail(false);
          }}
          onGeneratePDF={generatePDF}
        />

        {/* No Issues Dialog */}
        <NoIssuesDialog
          inspection={selectedInspection}
          open={showNoIssuesDialog}
          onOpenChange={setShowNoIssuesDialog}
        />

        {/* Store Comparison Dialog */}
        <StoreComparisonDialog
          stores={uniqueStores}
          storeStats={storeStats}
          open={showStoreComparison}
          onOpenChange={setShowStoreComparison}
        />

        {/* Issue Trends Dialog */}
        <IssueTrendsDialog
          inspections={inspections}
          open={showIssueTrends}
          onOpenChange={setShowIssueTrends}
        />
      </div>
    </div>
  );
}
