// src/components/admin/CategoryManagement.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Save, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  saveCategory,
  deleteCategory,
  saveItem,
  deleteItem,
  getCategoriesAndItems,
} from "@/services/api";
import DataMigrationButton from "./DataMigrationButton";

const iconOptions = [
  { value: "Utensils", label: "Utensils" },
  { value: "Coffee", label: "Coffee" },
  { value: "Pizza", label: "Pizza" },
  { value: "Brush", label: "Brush" },
  { value: "ClipboardCheck", label: "Clipboard" },
  { value: "ShoppingCart", label: "Shopping Cart" },
  { value: "Truck", label: "Truck" },
  { value: "Building", label: "Building" },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    id: "",
    title: "",
    icon: "Utensils",
  });

  // Item form state
  const [itemFormData, setItemFormData] = useState({
    id: "",
    description: "",
  });

  // Load categories and items
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getCategoriesAndItems();
      if (result.success) {
        setCategories(result.categories || []);
      } else {
        toast.error("Failed to load categories: " + result.error);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle migration completion
  const handleMigrationComplete = () => {
    loadData(); // Reload data after migration
  };

  // Open category modal for add/edit
  const handleCategoryAction = (category = null) => {
    if (category) {
      setCategoryFormData({
        id: category.id,
        title: category.title,
        icon: category.icon || "Utensils",
      });
    } else {
      setCategoryFormData({
        id: "",
        title: "",
        icon: "Utensils",
      });
    }
    setShowCategoryModal(true);
  };

  // Open item modal for add/edit
  const handleItemAction = (category, item = null) => {
    setSelectedCategory(category);
    if (item) {
      setItemFormData({
        id: item.id,
        description: item.description,
      });
    } else {
      setItemFormData({
        id: "",
        description: "",
      });
    }
    setShowItemModal(true);
  };

  // Handle category save
  const handleSaveCategory = async () => {
    try {
      if (!categoryFormData.title.trim()) {
        toast.error("Category title is required");
        return;
      }

      const result = await saveCategory(categoryFormData);
      if (result.success) {
        toast.success(
          `Category ${categoryFormData.id ? "updated" : "added"} successfully`
        );

        // Update state with new/updated category
        if (categoryFormData.id) {
          // Editing existing category
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === result.category.id ? result.category : cat
            )
          );
        } else {
          // Adding new category
          setCategories((prev) => [...prev, result.category]);
        }

        setShowCategoryModal(false);
      } else {
        toast.error("Failed to save category: " + result.error);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle item save
  const handleSaveItem = async () => {
    try {
      if (!itemFormData.description.trim()) {
        toast.error("Item description is required");
        return;
      }

      if (!selectedCategory) {
        toast.error("No category selected");
        return;
      }

      const result = await saveItem(selectedCategory.id, itemFormData);
      if (result.success) {
        toast.success(
          `Item ${itemFormData.id ? "updated" : "added"} successfully`
        );

        // Update state with new/updated item
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === selectedCategory.id) {
              const updatedItems = itemFormData.id
                ? cat.items.map((item) =>
                    item.id === result.item.id ? result.item : item
                  )
                : [...cat.items, result.item];
              return { ...cat, items: updatedItems };
            }
            return cat;
          })
        );

        setShowItemModal(false);
      } else {
        toast.error("Failed to save item: " + result.error);
      }
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle category delete
  const handleDeleteCategory = async (categoryId) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will also delete all items within this category and can affect existing inspection records."
      )
    ) {
      return;
    }

    try {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        toast.success("Category deleted successfully");
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      } else {
        toast.error("Failed to delete category: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle item delete
  const handleDeleteItem = async (categoryId, itemId) => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This can affect existing inspection records."
      )
    ) {
      return;
    }

    try {
      const result = await deleteItem(categoryId, itemId);
      if (result.success) {
        toast.success("Item deleted successfully");
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                items: cat.items.filter((item) => item.id !== itemId),
              };
            }
            return cat;
          })
        );
      } else {
        toast.error("Failed to delete item: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin mr-2">●</div>
        <p>Loading categories...</p>
      </div>
    );
  }

  const hasCategories = categories.length > 0;
  // Check if categories exist but have no items
  const hasEmptyCategories =
    hasCategories &&
    categories.every((cat) => !cat.items || cat.items.length === 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Categories & Items</h2>
        <div className="flex gap-2">
          {/* Show migration button if there are no categories or categories have no items */}
          {(hasEmptyCategories || !hasCategories) && (
            <DataMigrationButton
              onMigrationComplete={handleMigrationComplete}
            />
          )}
          <Button onClick={() => handleCategoryAction()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {!hasCategories ? (
        <Card>
          <CardContent className="p-6 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground">
              Create your first category or migrate existing categories from
              configuration.
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <DataMigrationButton
                onMigrationComplete={handleMigrationComplete}
              />
              <Button onClick={() => handleCategoryAction()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : hasEmptyCategories ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center text-amber-600 p-2 bg-amber-50 rounded-md mb-4">
              <HelpCircle className="h-5 w-5 mr-2" />
              <p>
                Categories found, but they have no items. You may need to
                migrate your existing items.
              </p>
            </div>
            <div className="flex justify-center">
              <DataMigrationButton
                onMigrationComplete={handleMigrationComplete}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {hasCategories && (
        <Accordion type="single" collapsible className="w-full">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              {/* Fixed: Using a custom header with separate buttons outside the trigger */}
              <div className="flex items-center justify-between px-4 py-3 bg-card rounded-lg hover:bg-accent/50 group">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center">
                    <span className="text-lg font-medium">
                      {category.title}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({category.items?.length || 0} items)
                    </span>
                  </div>
                </AccordionTrigger>

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryAction(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="flex justify-between mb-4">
                  <h3 className="text-md font-medium">
                    Items in this category
                  </h3>
                  <Button size="sm" onClick={() => handleItemAction(category)}>
                    <Plus className="mr-2 h-3 w-3" />
                    Add Item
                  </Button>
                </div>

                {!category.items || category.items.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      No items in this category yet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleItemAction(category)}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-2 py-2 px-4 font-medium bg-muted">
                      <div>Description</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {category.items?.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-2 py-3 px-4"
                        >
                          <div className="break-words pr-2">
                            {item.description}
                          </div>
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemAction(category, item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteItem(category.id, item.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryFormData.id ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {categoryFormData.id
                ? "Update an existing inspection category"
                : "Create a new inspection category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="categoryTitle">Category Title</Label>
              <Input
                id="categoryTitle"
                value={categoryFormData.title}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Food Prep, Cleaning & Safety"
              />
            </div>

            <div>
              <Label htmlFor="categoryIcon">Icon</Label>
              <Select
                value={categoryFormData.icon}
                onValueChange={(value) =>
                  setCategoryFormData({ ...categoryFormData, icon: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {categoryFormData.id && (
              <div>
                <Label htmlFor="categoryId">
                  Category ID (cannot be changed)
                </Label>
                <Input id="categoryId" value={categoryFormData.id} disabled />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="mr-2 h-4 w-4" />
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Modal */}
      <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {itemFormData.id ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              {itemFormData.id
                ? "Update an existing inspection item"
                : "Create a new inspection item for category: " +
                  selectedCategory?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="itemDescription">Item Description/Question</Label>
              <Input
                id="itemDescription"
                value={itemFormData.description}
                onChange={(e) =>
                  setItemFormData({
                    ...itemFormData,
                    description: e.target.value,
                  })
                }
                placeholder="e.g., Is the hotdog/Grill Area clean?"
              />
            </div>

            {itemFormData.id && (
              <div>
                <Label htmlFor="itemId">Item ID (cannot be changed)</Label>
                <Input id="itemId" value={itemFormData.id} disabled />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              <Save className="mr-2 h-4 w-4" />
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
