// src/services/api.js - Updated with category and item management
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
  deleteDoc,
  serverTimestamp,
  limit,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTIONS = {
  INSPECTIONS: "inspections",
  CATEGORIES: "categories",
  ITEMS: "items",
};

// Submit a new inspection
export const submitInspection = async (inspectionData) => {
  try {
    // Create the final payload (without photo references)
    const processedCategories = inspectionData.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        // Remove any photo-related properties if they exist
        hasPhoto: undefined,
        photoUrl: undefined,
      })),
    }));

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

// NEW FUNCTIONS FOR CATEGORY AND ITEM MANAGEMENT

// Get all categories with their items
export const getCategoriesAndItems = async () => {
  try {
    // Get all categories
    const categoriesQuery = query(
      collection(db, COLLECTIONS.CATEGORIES),
      orderBy("order", "asc")
    );
    const categorySnapshot = await getDocs(categoriesQuery);

    // Process categories
    const categories = [];
    for (const catDoc of categorySnapshot.docs) {
      const category = { id: catDoc.id, ...catDoc.data(), items: [] };

      // Get items for this category
      const itemsQuery = query(
        collection(db, COLLECTIONS.ITEMS),
        where("categoryId", "==", category.id),
        orderBy("order", "asc")
      );
      const itemSnapshot = await getDocs(itemsQuery);

      // Add items to category
      itemSnapshot.forEach((itemDoc) => {
        category.items.push({ id: itemDoc.id, ...itemDoc.data() });
      });

      categories.push(category);
    }

    return { success: true, categories };
  } catch (error) {
    console.error("Error getting categories and items:", error);
    return { success: false, error: error.message };
  }
};

// Save a category (create or update)
export const saveCategory = async (categoryData) => {
  try {
    let categoryId = categoryData.id;
    let isNew = false;

    if (!categoryId) {
      // Generate a URL-friendly ID from the title
      categoryId = categoryData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      isNew = true;
    }

    const categoryRef = doc(db, COLLECTIONS.CATEGORIES, categoryId);

    // If it's a new category, get count of existing categories for ordering
    let order = 0;
    if (isNew) {
      const countSnapshot = await getDocs(
        collection(db, COLLECTIONS.CATEGORIES)
      );
      order = countSnapshot.size; // New category goes at the end
    } else {
      // Get current order value to preserve it
      const currentSnapshot = await getDoc(categoryRef);
      if (currentSnapshot.exists()) {
        order = currentSnapshot.data().order || 0;
      }
    }

    // Prepare category data
    const categoryPayload = {
      title: categoryData.title,
      icon: categoryData.icon,
      order,
      updatedAt: serverTimestamp(),
    };

    if (isNew) {
      categoryPayload.createdAt = serverTimestamp();
    }

    // Save to Firestore
    await setDoc(categoryRef, categoryPayload, { merge: true });

    // Return the saved category with its ID
    return {
      success: true,
      category: {
        id: categoryId,
        ...categoryPayload,
        items: [], // Empty items array for new categories
      },
    };
  } catch (error) {
    console.error("Error saving category:", error);
    return { success: false, error: error.message };
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    // First, delete all items in this category
    const itemsQuery = query(
      collection(db, COLLECTIONS.ITEMS),
      where("categoryId", "==", categoryId)
    );
    const itemSnapshot = await getDocs(itemsQuery);

    const deletePromises = itemSnapshot.docs.map((itemDoc) =>
      deleteDoc(doc(db, COLLECTIONS.ITEMS, itemDoc.id))
    );

    // Wait for all item deletions
    await Promise.all(deletePromises);

    // Delete the category itself
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
};

// Save an item (create or update)
export const saveItem = async (categoryId, itemData) => {
  try {
    if (!categoryId) {
      return { success: false, error: "Category ID is required" };
    }

    let itemId = itemData.id;
    let isNew = false;

    if (!itemId) {
      // For new items, generate a unique ID
      isNew = true;
      // We'll let Firestore generate the ID
      const itemsCollectionRef = collection(db, COLLECTIONS.ITEMS);
      const newItemRef = doc(itemsCollectionRef);
      itemId = newItemRef.id;
    }

    const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);

    // If it's a new item, get count of existing items in this category for ordering
    let order = 0;
    if (isNew) {
      const countQuery = query(
        collection(db, COLLECTIONS.ITEMS),
        where("categoryId", "==", categoryId)
      );
      const countSnapshot = await getDocs(countQuery);
      order = countSnapshot.size; // New item goes at the end
    } else {
      // Get current order value to preserve it
      const currentSnapshot = await getDoc(itemRef);
      if (currentSnapshot.exists()) {
        order = currentSnapshot.data().order || 0;
      }
    }

    // Prepare item data
    const itemPayload = {
      description: itemData.description,
      categoryId,
      order,
      updatedAt: serverTimestamp(),
    };

    if (isNew) {
      itemPayload.createdAt = serverTimestamp();
    }

    // Save to Firestore
    await setDoc(itemRef, itemPayload, { merge: true });

    // Return the saved item with its ID
    return {
      success: true,
      item: {
        id: itemId,
        ...itemPayload,
      },
    };
  } catch (error) {
    console.error("Error saving item:", error);
    return { success: false, error: error.message };
  }
};

// Delete an item
export const deleteItem = async (categoryId, itemId) => {
  try {
    if (!categoryId || !itemId) {
      return { success: false, error: "Category ID and Item ID are required" };
    }

    await deleteDoc(doc(db, COLLECTIONS.ITEMS, itemId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: error.message };
  }
};

// Get all categories and items for the inspection form
export const getInspectionItems = async () => {
  try {
    const result = await getCategoriesAndItems();

    if (!result.success) {
      return result;
    }

    // Format categories and items for the inspection form
    const formattedCategories = result.categories.map((category) => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      items: category.items.map((item) => ({
        id: item.id,
        description: item.description,
        status: null,
        fixed: false,
        notes: "",
      })),
    }));

    return { success: true, categories: formattedCategories };
  } catch (error) {
    console.error("Error getting inspection items:", error);
    return { success: false, error: error.message };
  }
};
