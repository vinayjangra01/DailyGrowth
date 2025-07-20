import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { User, Bell, Download, Upload, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { UserStats } from "@shared/schema";
import { 
  requestNotificationPermission, 
  getNotificationSettings, 
  setNotificationSettings,
  scheduleDailyReminder 
} from "@/lib/notifications";
import { useState, useEffect } from "react";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  useEffect(() => {
    const settings = getNotificationSettings();
    setNotificationsEnabled(settings.enabled);
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      if (!permission.granted) {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings to receive daily reminders.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setNotificationSettings(enabled, "20:00");
    setNotificationsEnabled(enabled);
    
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled 
        ? "You'll receive daily reminders at 8:00 PM" 
        : "Daily reminders have been turned off",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data will be downloaded shortly.",
    });
    // TODO: Implement actual data export
  };

  const handleImportData = () => {
    toast({
      title: "Import feature",
      description: "Data import functionality coming soon!",
    });
    // TODO: Implement data import
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <Header />
      
      <main className="pb-20 p-4 space-y-6">
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your OneUp experience</p>
        </div>

        {/* Stats Overview */}
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Your Journey</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats?.currentStreak || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats?.totalImprovements || 0}</div>
              <div className="text-xs text-muted-foreground">Improvements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats?.bestStreak || 0}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border space-y-6">
          <h3 className="text-lg font-semibold">Settings</h3>
          
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">Toggle dark theme</div>
              </div>
            </div>
            <Switch 
              checked={theme === "dark"} 
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Daily Reminders</div>
                <div className="text-sm text-muted-foreground">Get notified to log improvements</div>
              </div>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </div>

        {/* Data Management */}
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold">Data Management</h3>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Your Data
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleImportData}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>

        {/* About */}
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">About OneUp</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            OneUp helps you become 1% better every day through small, consistent improvements. 
            Track your progress, maintain streaks, and watch compound growth transform your life.
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            Version 1.0.0 • Built with ❤️ for continuous improvement
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16 flex-col">
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs">Advanced Settings</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Account</span>
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
