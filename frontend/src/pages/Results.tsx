import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const result = location.state?.result;

  if (!result) {
    navigate("/upload");
    return null;
  }

  const handleDownloadPDF = async () => {
    try {
      // 🔥 Always call Flask at `/download-pdf`
      const payload = {
        description: result.loss_description || result.description || "",
        damage_type: result.damageType || "",
        image_data:
          result.image_data ||
          result.image ||
          result.base64_image ||
          undefined,
      };

      const response = await fetch("/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("PDF download failed");

      // Convert response into a downloadable PDF file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Extract filename from backend headers
      const headerFilename =
        response.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          ?.replace(/["']/g, "") || null;

      const finalName =
        headerFilename ||
        `loss_description_${(result.damageType || "report")
          .replace(/\s+/g, "_")
          .toLowerCase()}.pdf`;

      a.download = finalName;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const handleDownloadText = () => {
    const text = `Damage Type: ${result.damageType}\n\nAI Image Analysis:\n${
      result.image_analysis || result.analysis
    }\n\nProfessional Loss Description:\n${
      result.loss_description || result.description
    }`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "loss_description.txt";

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

    toast({
      title: "Success",
      description: "Text file downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-cyan flex items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                Damage Assessment Results
              </h2>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-cyan pl-4">
                <h3 className="font-semibold text-lg mb-2">Damage Type</h3>
                <p className="text-cyan text-xl font-medium">
                  {result.damageType}
                </p>
              </div>

              <div className="border-l-4 border-cyan pl-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  🖼️ AI Image Analysis
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {result.image_analysis ||
                    result.analysis ||
                    "No analysis available"}
                </p>
              </div>

              <div className="border-l-4 border-cyan pl-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  📄 Professional Loss Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {result.loss_description ||
                    result.description ||
                    "No description available"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>

                <Button
                  onClick={handleDownloadText}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Text
                </Button>

                <Button variant="outline" onClick={() => navigate("/upload")}>
                  <Home className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
