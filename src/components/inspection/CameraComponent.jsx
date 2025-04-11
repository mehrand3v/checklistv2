// src/components/inspection/CameraComponent.jsx
import { useState } from "react";
import { Camera, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { takePhoto, compressImage } from "@/services/photoService";

// You'll need to run: npx shadcn-ui@latest add button

export default function CameraComponent({
  onPhotoCapture,
  existingPhoto = null,
}) {
  const [photo, setPhoto] = useState(existingPhoto);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleTakePhoto = async () => {
    try {
      setIsCapturing(true);
      const capturedPhoto = await takePhoto();

      // Compress the image before storing
      const compressedPhoto = await compressImage(capturedPhoto);

      setPhoto(compressedPhoto);

      // Don't trigger the onPhotoCapture callback yet - wait for user confirmation
    } catch (error) {
      console.error("Error taking photo:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmPhoto = () => {
    if (photo && onPhotoCapture) {
      onPhotoCapture(photo);
    }
  };

  const handleCancelPhoto = () => {
    setPhoto(null);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      {photo ? (
        <div className="w-full">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img
              src={photo}
              alt="Captured"
              className="w-full h-auto object-contain max-h-60"
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-background/80">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleCancelPhoto}
              >
                <X className="h-4 w-4 mr-1" />
                Retake
              </Button>
              <Button size="sm" variant="primary" onClick={handleConfirmPhoto}>
                <Check className="h-4 w-4 mr-1" />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleTakePhoto}
          disabled={isCapturing}
        >
          <Camera className="h-5 w-5 mr-2" />
          {isCapturing ? "Taking Photo..." : "Take Photo"}
        </Button>
      )}
    </div>
  );
}
