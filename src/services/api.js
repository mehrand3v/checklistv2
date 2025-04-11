// src/services/api.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTIONS = {
  INSPECTIONS: "inspections",
};

// Submit a new inspection
export const submitInspection = async (inspectionData) => {
  try {
    // Prepare photo references if any
    const processedCategories = inspectionData.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => {
        // If there's a photo, retrieve it from localStorage
        let photoData = null;
        if (item.hasPhoto) {
          const photoKey = `csr_photo_${category.id}_${item.id}`;
          photoData = localStorage.getItem(photoKey);
        }

        return {
          ...item,
          photoData: photoData || null,
        };
      }),
    }));

    // Create the final payload
    const payload = {
      storeNumber: inspectionData.storeNumber,
      inspectedBy: inspectionData.inspectedBy,
      // Use serverTimestamp for the official timestamp
      inspectionDate: serverTimestamp(),
      // Client date is already in the payload
      clientDate: inspectionData.clientDate,
      submittedAt: serverTimestamp(),
      categories: processedCategories,
    };

    const docRef = await addDoc(
      collection(db, COLLECTIONS.INSPECTIONS),
      payload
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting inspection:", error);
    return { success: false, error: error.message };
  }
};

// Get all inspections
export const getAllInspections = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INSPECTIONS),
      orderBy("submittedAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const inspections = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      inspections.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || null,
        inspectionDate:
          data.inspectionDate?.toDate() || new Date(data.clientDate) || null,
      });
    });

    return { success: true, inspections };
  } catch (error) {
    console.error("Error getting inspections:", error);
    return { success: false, error: error.message };
  }
};

// Get inspections for a specific store
export const getInspectionsByStore = async (storeNumber) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INSPECTIONS),
      where("storeNumber", "==", storeNumber),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const inspections = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      inspections.push({
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || null,
        inspectionDate:
          data.inspectionDate?.toDate() || new Date(data.clientDate) || null,
      });
    });

    return { success: true, inspections };
  } catch (error) {
    console.error("Error getting store inspections:", error);
    return { success: false, error: error.message };
  }
};

// Get a single inspection by ID
export const getInspectionById = async (inspectionId) => {
  try {
    const docRef = doc(db, COLLECTIONS.INSPECTIONS, inspectionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        inspection: {
          id: docSnap.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || null,
          inspectionDate:
            data.inspectionDate?.toDate() || new Date(data.clientDate) || null,
        },
      };
    } else {
      return { success: false, error: "Inspection not found" };
    }
  } catch (error) {
    console.error("Error getting inspection:", error);
    return { success: false, error: error.message };
  }
};

// Update the "fixed" status for an issue
export const updateIssueStatus = async (
  inspectionId,
  categoryId,
  itemId,
  fixed
) => {
  try {
    const docRef = doc(db, COLLECTIONS.INSPECTIONS, inspectionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: "Inspection not found" };
    }

    const inspection = docSnap.data();

    // Find and update the specific item
    let updated = false;
    const updatedCategories = inspection.categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map((item) => {
            if (item.id === itemId) {
              updated = true;
              return { ...item, fixed };
            }
            return item;
          }),
        };
      }
      return category;
    });

    if (!updated) {
      return { success: false, error: "Item not found in the inspection" };
    }

    await updateDoc(docRef, {
      categories: updatedCategories,
      lastUpdated: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating issue status:", error);
    return { success: false, error: error.message };
  }
};

// Get all issues across all inspections
export const getAllIssues = async (limit = 100) => {
  try {
    const result = await getAllInspections(limit);

    if (!result.success) {
      return result;
    }

    const issues = [];

    result.inspections.forEach((inspection) => {
      // Make sure categories exist and is an array before trying to iterate
      if (
        inspection &&
        inspection.categories &&
        Array.isArray(inspection.categories)
      ) {
        inspection.categories.forEach((category) => {
          // Make sure category and items exist and items is an array
          if (category && category.items && Array.isArray(category.items)) {
            category.items.forEach((item) => {
              if (item && item.status === "no") {
                issues.push({
                  inspectionId: inspection.id,
                  inspectionDate: inspection.inspectionDate,
                  storeNumber: inspection.storeNumber,
                  inspectedBy: inspection.inspectedBy,
                  categoryId: category.id,
                  categoryTitle: category.title,
                  itemId: item.id,
                  description: item.description,
                  fixed: item.fixed,
                  notes: item.notes,
                  hasPhoto: item.hasPhoto,
                  submittedAt: inspection.submittedAt,
                });
              }
            });
          }
        });
      }
    });

    return { success: true, issues };
  } catch (error) {
    console.error("Error getting all issues:", error);
    return { success: false, error: error.message };
  }
};
