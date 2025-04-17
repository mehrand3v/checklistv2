import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode.react";

export default function QRCodeGenerator() {
  const [qrValue, setQrValue] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const [downloadUrl, setDownloadUrl] = useState("");

  // Generate a unique URL for the inspection form
  useEffect(() => {
    // Get the current origin (domain)
    const origin = window.location.origin;
    // Create a unique URL for the inspection form
    const inspectionUrl = `${origin}/inspection`;
    setQrValue(inspectionUrl);
  }, []);

  // Handle QR code download
  const handleDownload = () => {
    try {
      // Get the QR code canvas element
      const canvas = document.getElementById("inspection-qr-code");
      if (!canvas) {
        toast.error("QR code element not found");
        return;
      }

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");
      
      // Create a download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "inspection-qr-code.png";
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("QR code downloaded successfully");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  // Regenerate QR code with new size
  const handleRegenerate = () => {
    setQrSize(prevSize => prevSize === 256 ? 512 : 256);
    toast.success("QR code regenerated");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inspection QR Code</CardTitle>
        <CardDescription>
          Scan this QR code to start a new inspection
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCode
            id="inspection-qr-code"
            value={qrValue}
            size={qrSize}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleDownload}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleRegenerate}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {qrSize === 256 ? "Larger" : "Smaller"}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          URL: {qrValue}
        </p>
      </CardContent>
    </Card>
  );
} 