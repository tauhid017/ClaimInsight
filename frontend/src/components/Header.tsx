import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Home, Info, History, User } from "lucide-react";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Load current user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-cyan via-cyan-dark to-cyan-dark px-6 py-4 flex items-center justify-between">
      
      {/* Logo Left */}
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg px-3 py-2 font-bold text-cyan text-xl">
          CI
        </div>
        <h1 className="text-white text-2xl font-bold">ClaimInsight</h1>
      </div>

      {/* Navigation + Profile */}
      <div className="flex items-center gap-2">

        {/* Home Button */}
        <Button
          variant={location.pathname === "/upload" ? "secondary" : "ghost"}
          className={location.pathname === "/upload" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/upload")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>

        {/* About Button */}
        <Button
          variant={location.pathname === "/about" ? "secondary" : "ghost"}
          className={location.pathname === "/about" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/about")}
        >
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>

        {/* History Button */}
        <Button
          variant={location.pathname === "/history" ? "secondary" : "ghost"}
          className={location.pathname === "/history" ? "" : "text-white hover:bg-white/20"}
          onClick={() => navigate("/history")}
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>

        {/* Profile Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full text-white bg-white/20 border-white/40 hover:bg-white/30"
              >
                <User className="h-4 w-4 mr-2" />
                {user.name?.split(" ")[0] || "Profile"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            className="text-white border-white/60"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};
