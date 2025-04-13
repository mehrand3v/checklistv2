// src/utils/migrateInspectionItems.js
import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebase";
import inspectionItems from "@/config/inspectionItems"; // Your existing config file

// Function to migrate static config to Firestore
export const migrateInspectionItems = async () => {
  try {
    // Check if categories already exist in Firestore
    const categoriesRef = collection(db, "categories");
    const categoriesSnapshot = await getDocs(query(categoriesRef));

    // If categories already have items, don't migrate
    if (!categoriesSnapshot.empty) {
      // Check if there are items for these categories
      const itemsRef = collection(db, "items");
      const itemsSnapshot = await getDocs(query(itemsRef));

      if (!itemsSnapshot.empty) {
        console.log(
          "Migration skipped: Categories and items already exist in Firestore"
        );
        return { success: true, message: "Categories and items already exist" };
      }
    }

    // Migrate each category and its items
    const migrationPromises = [];

    for (let i = 0; i < inspectionItems.length; i++) {
      const category = inspectionItems[i];

      // Save category
      const categoryRef = doc(db, "categories", category.id);
      migrationPromises.push(
        setDoc(categoryRef, {
          title: category.title,
          icon: category.icon || "Utensils",
          order: i,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // Save items for this category
      for (let j = 0; j < category.items.length; j++) {
        const item = category.items[j];
        const itemRef = doc(collection(db, "items"));
        migrationPromises.push(
          setDoc(itemRef, {
            description: item.description,
            categoryId: category.id,
            order: j,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
      }
    }

    // Wait for all database operations to complete
    await Promise.all(migrationPromises);

    console.log("Migration completed successfully");
    return { success: true, message: "Migration completed" };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error: error.message };
  }
};
