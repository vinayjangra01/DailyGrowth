import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Book, Brain, Heart, Briefcase, Users } from "lucide-react";
import type { WeeklyAnalytics } from "@/lib/types";

const areaIcons = {
  dumbbell: Dumbbell,
  book: Book,
  brain: Brain,
  heart: Heart,
  briefcase: Briefcase,
  users: Users,
};

export default function WeeklySummary() {
  const { data: analytics, isLoading } = useQuery<WeeklyAnalytics>({
    queryKey: ["/api/analytics/weekly"],
  });

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-muted rounded-xl"></div>
            <div className="h-20 bg-muted rounded-xl"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!analytics) return null;

  const TopIcon = areaIcons[analytics.topArea?.icon as keyof typeof areaIcons] || Brain;
  const AttentionIcon = areaIcons[analytics.needsAttention?.icon as keyof typeof areaIcons] || Brain;

  return (
    <section className="p-4">
      <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">This Week</h2>
          <span className="text-sm text-muted-foreground">{analytics.period}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{analytics.totalImprovements}</div>
            <div className="text-sm text-muted-foreground">Improvements</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{analytics.consistency}%</div>
            <div className="text-sm text-muted-foreground">Consistency</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Top improved area</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TopIcon className="text-purple-600 dark:text-purple-400 w-3 h-3" />
              </div>
              <span className="font-medium">{analytics.topArea?.area}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Needs attention</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <AttentionIcon className="text-green-600 dark:text-green-400 w-3 h-3" />
              </div>
              <span className="font-medium">{analytics.needsAttention?.area}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
