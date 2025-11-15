import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HistoryEntry {
  id: number;
  date: string;
  damageType: string;
  imageUrl: string;
  image_analysis?: string;
  analysis?: string;
  loss_description?: string;
  description?: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem("claimHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("claimHistory", JSON.stringify(updatedHistory));
    toast({
      title: "Deleted",
      description: "History entry removed successfully",
    });
  };

  const handleView = (entry: HistoryEntry) => {
    navigate("/results", { state: { result: entry } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-light to-cyan">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-cyan mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Claim History
            </h2>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No history yet</p>
                <Button
                  className="mt-4 bg-cyan hover:bg-cyan-dark"
                  onClick={() => navigate("/upload")}
                >
                  Create Your First Assessment
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.map((entry) => (
                  <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      {entry.imageUrl && (
                        <img
                          src={entry.imageUrl}
                          alt={entry.damageType}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-cyan mb-1">
                        {entry.damageType}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {new Date(entry.date).toLocaleDateString()} at{" "}
                        {new Date(entry.date).toLocaleTimeString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-cyan hover:bg-cyan-dark"
                          onClick={() => handleView(entry)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
