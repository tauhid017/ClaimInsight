import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Info, History } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-cyan via-cyan-dark to-cyan-dark px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg px-3 py-2 font-bold text-cyan text-xl">
          CI
        </div>
        <h1 className="text-white text-2xl font-bold">ClaimInsight</h1>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={location.pathname === "/upload" ? "secondary" : "ghost"}
          className={location.pathname === "/upload" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/upload")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          variant={location.pathname === "/about" ? "secondary" : "ghost"}
          className={location.pathname === "/about" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/about")}
        >
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
        <Button
          variant={location.pathname === "/history" ? "secondary" : "ghost"}
          className={location.pathname === "/history" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/history")}
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </div>
    </header>
  );
};
