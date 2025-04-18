import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const QRCodePage = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current origin (domain) and path
    const currentUrl = window.location.origin;
    setUrl(currentUrl);
  }, []);

  const handleDownload = () => {
    try {
      const svg = document.getElementById("qr-code");
      if (!svg) {
        toast.error("QR code element not found");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "inspection-qr-code.png";
        downloadLink.href = pngFile;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast.success("QR code downloaded successfully");
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-start mb-6">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Store QR Code</CardTitle>
          <CardDescription>
            Scan this QR code to access the inspection form for this store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              id="qr-code"
              value={url}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodePage; 