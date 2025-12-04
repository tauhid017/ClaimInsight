import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface HistoryEntry {
  id: string;
  date: string;
  damageType: string;
  image_data: string;
  loss_description?: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  // =========================================
  // 🔒 PROTECT PAGE: Only allow logged-in users
  // =========================================
  useEffect(() => {
    const user = auth.currentUser || JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // =========================================
  // 🔥 FETCH FIRESTORE HISTORY
  // =========================================
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "users", user.uid, "history"),
          orderBy("date", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryEntry[];

        setHistory(data);
      } catch (error) {
        console.error("Error loading Firestore history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =========================================
  // ❌ DELETE HISTORY ENTRY (Firestore)
  // =========================================
  const handleDelete = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "users", user.uid, "history", id));

      setHistory((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: "Deleted",
        description: "History entry removed successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete entry",
        variant: "destructive",
      });
    }
  };

  // =========================================
  // 🔍 VIEW DETAILS
  // =========================================
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

            {/* LOADING STATE */}
            {loading ? (
              <div className="text-center py-20 text-white text-xl">
                Loading your claim history...
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No history found</p>
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
                  <Card
                    key={entry.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* IMAGE */}
                    <div className="aspect-video bg-muted relative">
                      {entry.image_data ? (
                        <img
                          src={`data:image/jpeg;base64,${entry.image_data}`}
                          alt={entry.damageType}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-cyan mb-1">
                        {entry.damageType}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {new Date(entry.date).toLocaleDateString()}{" "}
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
