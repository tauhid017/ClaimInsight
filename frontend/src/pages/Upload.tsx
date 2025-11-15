import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload as UploadIcon, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [damageType, setDamageType] = useState("");
  const [customDamageType, setCustomDamageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 16 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 16MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 16 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 16MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile || !damageType) {
      toast({
        title: "Missing information",
        description: "Please select a file and damage type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("damage_type", damageType === "Other" ? customDamageType : damageType);

      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      // Save to history
      const history = JSON.parse(localStorage.getItem("claimHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        damageType: damageType === "Other" ? customDamageType : damageType,
        imageUrl: previewUrl,
        ...data,
      };
      history.unshift(newEntry);
      localStorage.setItem("claimHistory", JSON.stringify(history));

      navigate("/results", { state: { result: newEntry } });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setDamageType("");
    setCustomDamageType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl font-semibold mb-2">
              "Automating Insurance Claims with AI Precision!"
            </h2>
          </div>

          <Card className="p-8">
            <h3 className="text-2xl font-bold text-cyan mb-6">Loss Description Generator</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-cyan mb-2 flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Upload Damage Images
                </Label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-cyan rounded-lg p-12 text-center cursor-pointer hover:bg-cyan/5 transition-colors"
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Selected file: {selectedFile?.name}
                      </p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-80 mx-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-cyan font-medium mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, JPEG (Max 16MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-cyan">Damage Type</Label>
                <Select value={damageType} onValueChange={setDamageType}>
                  <SelectTrigger className="border-cyan">
                    <SelectValue placeholder="Select damage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hail Damage">Hail Damage</SelectItem>
                    <SelectItem value="Fire Damage">Fire Damage</SelectItem>
                    <SelectItem value="Water Damage">Water Damage</SelectItem>
                    <SelectItem value="Storm Damage">Storm Damage</SelectItem>
                    <SelectItem value="Wind Damage">Wind Damage</SelectItem>
                    <SelectItem value="Earthquake">Earthquake</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {damageType === "Other" && (
                <div className="space-y-2">
                  <Label className="text-cyan">Specify Damage Type</Label>
                  <Input
                    placeholder="Enter damage type"
                    value={customDamageType}
                    onChange={(e) => setCustomDamageType(e.target.value)}
                    className="border-cyan"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-cyan text-cyan hover:bg-cyan hover:text-white"
                  onClick={handleReupload}
                  disabled={isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-upload
                </Button>
                <Button
                  className="flex-1 bg-cyan hover:bg-cyan-dark"
                  onClick={handleUpload}
                  disabled={isLoading || !selectedFile || !damageType}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Generate Loss Description
                    </>
                  )}
                </Button>
              </div>

              {isLoading && (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-cyan mb-4" />
                  <p className="text-cyan font-medium">
                    AI is analyzing the image and generating professional description...
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
