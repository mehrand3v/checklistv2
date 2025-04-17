// src/context/InspectionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getInspectionItems } from "@/services/api"; // Import the new API function
import { toast } from "sonner";

const InspectionContext = createContext(null);

export function InspectionProvider({ children }) {
  const [storeInfo, setStoreInfo] = useState(() => {
    // Try to load from localStorage on initial render
    const savedInfo = localStorage.getItem("csr_store_info");
    return savedInfo
      ? JSON.parse(savedInfo)
      : {
          storeNumber: "",
          inspectedBy: "",
          // No date field - will be generated by Firebase
        };
  });

  const [inspectionData, setInspectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories and items from Firestore
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from localStorage first (for existing inspections in progress)
        const savedData = localStorage.getItem("csr_inspection_data");
        if (savedData) {
          setInspectionData(JSON.parse(savedData));
        } else {
          // If nothing in localStorage, fetch from Firestore
          const result = await getInspectionItems();
          if (result.success) {
            setInspectionData(result.categories);
          } else {
            setError("Failed to load inspection items: " + result.error);
            toast.error("Failed to load inspection items");
          }
        }
      } catch (err) {
        console.error("Error loading inspection items:", err);
        setError("Error loading inspection items: " + err.message);
        toast.error("Error loading inspection data");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("csr_store_info", JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    if (inspectionData.length > 0) {
      localStorage.setItem(
        "csr_inspection_data",
        JSON.stringify(inspectionData)
      );
    }
  }, [inspectionData]);

  // Calculate completion status for progress indicator
  const getCompletionStatus = () => {
    const totalItems = inspectionData.reduce(
      (acc, category) => acc + category.items.length,
      0
    );
    const completedItems = inspectionData.reduce((acc, category) => {
      return acc + category.items.filter((item) => item.status !== null).length;
    }, 0);

    return {
      totalItems,
      completedItems,
      percentComplete: totalItems
        ? Math.round((completedItems / totalItems) * 100)
        : 0,
    };
  };

  // Update a specific inspection item
  const updateInspectionItem = (categoryId, itemId, updates) => {
    setInspectionData((prevData) =>
      prevData.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, ...updates };
              }
              return item;
            }),
          };
        }
        return category;
      })
    );
  };

  // Get all issues (items with status = "no")
  const getAllIssues = () => {
    const issues = [];

    inspectionData.forEach((category) => {
      category.items.forEach((item) => {
        if (item.status === "no") {
          issues.push({
            ...item,
            category: category.title,
            categoryId: category.id,
          });
        }
      });
    });

    return issues;
  };

  // Reset inspection data
  const resetInspection = () => {
    // Clear localStorage
    localStorage.removeItem("csr_inspection_data");
    localStorage.removeItem("csr_store_info");

    // Reset state
    setStoreInfo({
      storeNumber: "",
      inspectedBy: "",
    });

    // We'll reload the inspection data from the server
    setInspectionData([]);
    setLoading(true);

    // Load fresh inspection items from Firestore
    getInspectionItems()
      .then((result) => {
        if (result.success) {
          setInspectionData(result.categories);
        } else {
          console.error("Failed to reload inspection items:", result.error);
          toast.error("Failed to reset inspection form");
        }
      })
      .catch((err) => {
        console.error("Error reloading inspection items:", err);
        toast.error("Error resetting the form");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Check if all items in a category have been completed
  const isCategoryComplete = (categoryId) => {
    const category = inspectionData.find((cat) => cat.id === categoryId);
    if (!category) return false;

    return category.items.every((item) => item.status !== null);
  };

  // Submit the inspection to Firestore
  const submitInspection = async () => {
    // Validate required fields
    if (!storeInfo.storeNumber || !storeInfo.inspectedBy) {
      throw new Error("Store number and inspector name are required");
    }

    // Clean and validate categories and items
    const cleanedCategories = inspectionData.map((category) => {
      if (!category.id || !category.title) {
        throw new Error(`Invalid category data: ${JSON.stringify(category)}`);
      }

      const cleanedItems = category.items.map((item) => {
        if (!item.id || !item.description || item.status === undefined) {
          throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
        }

        return {
          id: item.id,
          description: item.description,
          status: item.status,
          fixed: item.fixed || false,
          notes: item.notes || "",
        };
      });

      return {
        id: category.id,
        title: category.title,
        items: cleanedItems,
      };
    });

    // Prepare the data structure
    const inspectionPayload = {
      storeNumber: storeInfo.storeNumber.trim(),
      inspectedBy: storeInfo.inspectedBy.trim(),
      clientDate: new Date().toISOString(),
      categories: cleanedCategories,
    };

    // For debugging
    console.log("Inspection payload:", inspectionPayload);

    return inspectionPayload;
  };

  const value = {
    storeInfo,
    setStoreInfo,
    inspectionData,
    updateInspectionItem,
    getCompletionStatus,
    getAllIssues,
    resetInspection,
    isCategoryComplete,
    submitInspection,
    loading,
    error,
  };

  return (
    <InspectionContext.Provider value={value}>
      {children}
    </InspectionContext.Provider>
  );
}

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error("useInspection must be used within an InspectionProvider");
  }
  return context;
};
