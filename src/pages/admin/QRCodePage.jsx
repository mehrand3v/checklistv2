import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QRCodePage = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Get the current origin (domain) and path
    const currentUrl = window.location.origin + "/inspection";
    setUrl(currentUrl);
  }, []);

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
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
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Inspection QR Code</CardTitle>
          <CardDescription>
            Scan this QR code to start a new inspection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              <Button onClick={handleDownload}>
                Download QR Code
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              URL: {url}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodePage; 