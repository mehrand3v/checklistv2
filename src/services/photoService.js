// src/services/photoService.js

// Generate a unique key for storing a photo in localStorage
export const getPhotoKey = (categoryId, itemId) => {
  return `csr_photo_${categoryId}_${itemId}`;
};

// Save a photo as base64 in localStorage
export const savePhoto = (categoryId, itemId, base64Data) => {
  try {
    const key = getPhotoKey(categoryId, itemId);
    localStorage.setItem(key, base64Data);
    return true;
  } catch (error) {
    console.error("Error saving photo to localStorage:", error);
    return false;
  }
};

// Get a photo from localStorage
export const getPhoto = (categoryId, itemId) => {
  try {
    const key = getPhotoKey(categoryId, itemId);
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting photo from localStorage:", error);
    return null;
  }
};

// Delete a photo from localStorage
export const deletePhoto = (categoryId, itemId) => {
  try {
    const key = getPhotoKey(categoryId, itemId);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error deleting photo from localStorage:", error);
    return false;
  }
};

// Take a photo using the device camera
export const takePhoto = async () => {
  return new Promise((resolve, reject) => {
    // Create hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "environment"; // Use the environment-facing camera (back camera)

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        reject(new Error("No photo selected"));
        return;
      }

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // Return the base64 data
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
    };

    // Trigger the file input click
    fileInput.click();
  });
};

// Compress image to reduce storage size
export const compressImage = async (
  base64Image,
  maxWidth = 800,
  quality = 0.7
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Create canvas for compression
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert back to base64 with lower quality
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error("Error loading image for compression"));
    };

    img.src = base64Image;
  });
};
