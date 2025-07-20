import { Edit, Dumbbell, Book, Brain, Heart, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { FocusArea, Improvement } from "@shared/schema";

const areaIcons = {
  dumbbell: Dumbbell,
  book: Book,
  brain: Brain,
  heart: Heart,
  briefcase: Briefcase,
  users: Users,
};

const areaColors = {
  blue: "bg-blue-50 dark:bg-blue-900/20",
  purple: "bg-purple-50 dark:bg-purple-900/20",
  green: "bg-green-50 dark:bg-green-900/20",
  red: "bg-red-50 dark:bg-red-900/20",
  orange: "bg-orange-50 dark:bg-orange-900/20",
  pink: "bg-pink-50 dark:bg-pink-900/20",
};

const iconColors = {
  blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  pink: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400",
};

export default function FocusAreas() {
  const { data: focusAreas = [], isLoading: areasLoading } = useQuery<FocusArea[]>({
    queryKey: ["/api/focus-areas"],
  });

  const { data: recentImprovements = [] } = useQuery<Improvement[]>({
    queryKey: ["/api/improvements/recent", "7"],
  });

  if (areasLoading) {
    return (
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Calculate weekly count for each focus area
  const areasWithStats = focusAreas.map(area => {
    const weeklyCount = recentImprovements.filter(
      imp => imp.category.toLowerCase() === area.name.toLowerCase()
    ).length;
    
    return {
      ...area,
      weeklyCount
    };
  });

  return (
    <section className="p-4">
      <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Focus Areas</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
        
        <div className="space-y-3">
          {areasWithStats.map((area) => {
            const IconComponent = areaIcons[area.icon as keyof typeof areaIcons] || Brain;
            const bgColor = areaColors[area.color as keyof typeof areaColors] || areaColors.blue;
            const iconColor = iconColors[area.color as keyof typeof iconColors] || iconColors.blue;
            
            return (
              <div key={area.id} className={`flex items-center justify-between p-3 rounded-xl ${bgColor}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{area.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{area.weeklyCount}/7</div>
                  <div className="text-xs text-muted-foreground">this week</div>
                </div>
              </div>
            );
          })}
        </div>

        {areasWithStats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No focus areas set up yet.</p>
            <Button variant="outline" size="sm" className="mt-2">
              Add Focus Areas
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
