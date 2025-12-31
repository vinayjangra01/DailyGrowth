import { Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { UserStats } from "@shared/schema";

export default function DailyStreak() {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  if (isLoading) {
    return (
      <section className="p-4">
        <div className="card-shadow rounded-2xl growth-gradient p-6 text-white relative overflow-hidden animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-20"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4">
      <div className="card-shadow rounded-2xl growth-gradient p-6 text-white relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Current Streak</h2>
            <Flame className="text-amber-300 w-6 h-6 animate-pulse-soft" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{stats?.currentStreak || 0}</span>
            <span className="text-xl opacity-90">days</span>
          </div>
          <p className="text-sm opacity-75 mt-2">
            Keep it going! You're building momentum.
          </p>
        </div>
      </div>
    </section>
  );
}
