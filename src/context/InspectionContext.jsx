// src/context/InspectionContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import inspectionItems from "@/config/inspectionItems";

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

  const [inspectionData, setInspectionData] = useState(() => {
    // Try to load from localStorage on initial render
    const savedData = localStorage.getItem("csr_inspection_data");
    return savedData ? JSON.parse(savedData) : [...inspectionItems];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("csr_store_info", JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem("csr_inspection_data", JSON.stringify(inspectionData));
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

  // Handle image capture and storage
  const saveItemPhoto = (categoryId, itemId, photoData) => {
    // Store the base64 image data in local storage
    try {
      // First, save the photo to our inspection data state
      updateInspectionItem(categoryId, itemId, { photoUrl: photoData });

      // Also store it in localStorage with a unique key
      const photoKey = `csr_photo_${categoryId}_${itemId}`;
      localStorage.setItem(photoKey, photoData);

      return true;
    } catch (error) {
      console.error("Error saving photo:", error);
      return false;
    }
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

    // Reset all photos
    inspectionData.forEach((category) => {
      category.items.forEach((item) => {
        if (item.photoUrl) {
          localStorage.removeItem(`csr_photo_${category.id}_${item.id}`);
        }
      });
    });

    // Reset state
    setInspectionData([...inspectionItems]);
    setStoreInfo({
      storeNumber: "",
      inspectedBy: "",
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
    // We'll implement the actual Firebase submission in a separate service
    // For now, just prepare the data structure
    const inspectionPayload = {
      ...storeInfo,
      clientDate: new Date().toISOString(), // Add client date for reference
      categories: inspectionData.map((category) => ({
        id: category.id,
        title: category.title,
        items: category.items.map((item) => ({
          id: item.id,
          description: item.description,
          status: item.status,
          fixed: item.fixed,
          notes: item.notes,
          hasPhoto: !!item.photoUrl,
        })),
      })),
    };

    // For debugging
    console.log("Inspection payload:", inspectionPayload);

    // Return the payload for now - we'll replace this with actual submission later
    return inspectionPayload;
  };

  const value = {
    storeInfo,
    setStoreInfo,
    inspectionData,
    updateInspectionItem,
    saveItemPhoto,
    getCompletionStatus,
    getAllIssues,
    resetInspection,
    isCategoryComplete,
    submitInspection,
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
