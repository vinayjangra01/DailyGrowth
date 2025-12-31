import { CheckCircle, Plus, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Improvement } from "@shared/schema";
import AddImprovementModal from "./add-improvement-modal";

const categoryIcons = {
  fitness: Dumbbell,
  learning: CheckCircle,
  mindset: CheckCircle,
  health: CheckCircle,
  skills: CheckCircle,
  relationships: CheckCircle,
  other: CheckCircle,
};

export default function TodayImprovement() {
  const [showModal, setShowModal] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const { data: todayImprovements = [], isLoading } = useQuery<Improvement[]>({
    queryKey: ["/api/improvements/date", today],
  });

  const hasLoggedToday = todayImprovements.length > 0;

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="h-16 bg-muted rounded mb-4"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's 1%</h2>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          {hasLoggedToday ? (
            <div className="space-y-4">
              {todayImprovements.map((improvement) => {
                const IconComponent = categoryIcons[improvement.category as keyof typeof categoryIcons] || CheckCircle;
                return (
                  <div key={improvement.id} className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <IconComponent className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{improvement.note}</p>
                      <p className="text-sm text-muted-foreground capitalize">{improvement.category}</p>
                    </div>
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No improvements logged today yet.</p>
            </div>
          )}

          <Button 
            onClick={() => setShowModal(true)}
            className="w-full mt-4 primary-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Today's Improvement
          </Button>
        </div>
      </section>

      <AddImprovementModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </>
  );
}
