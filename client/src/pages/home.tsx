import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import DailyStreak from "@/components/improvement/daily-streak";
import TodayImprovement from "@/components/improvement/today-improvement";
import GrowthChart from "@/components/improvement/growth-chart";
import FocusAreas from "@/components/improvement/focus-areas";
import AISuggestions from "@/components/improvement/ai-suggestions";
import WeeklySummary from "@/components/improvement/weekly-summary";
import AddImprovementModal from "@/components/improvement/add-improvement-modal";

export default function Home() {
  const [showQuickModal, setShowQuickModal] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <Header />
      
      <main className="pb-20">
        <DailyStreak />
        <TodayImprovement />
        <GrowthChart />
        <FocusAreas />
        <AISuggestions />
        <WeeklySummary />
      </main>

      <BottomNavigation />

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowQuickModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 primary-gradient rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-soft"
        size="icon"
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>

      <AddImprovementModal 
        open={showQuickModal} 
        onOpenChange={setShowQuickModal}
      />
    </div>
  );
}
