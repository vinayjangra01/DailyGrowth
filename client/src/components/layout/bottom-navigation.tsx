import { Home, TrendingUp, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/history", icon: Calendar, label: "History" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Button
            key={path}
            variant="ghost"
            className={`flex flex-col items-center py-2 px-4 h-auto ${
              location === path 
                ? "text-primary" 
                : "text-muted-foreground"
            }`}
            onClick={() => setLocation(path)}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
