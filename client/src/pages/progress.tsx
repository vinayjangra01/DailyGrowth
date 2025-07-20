import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { UserStats } from "@shared/schema";
import type { GrowthData } from "@/lib/types";

export default function Progress() {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const { data: growthResponse } = useQuery<{ growthData: GrowthData[] }>({
    queryKey: ["/api/analytics/growth", "90"],
  });

  const growthData = growthResponse?.growthData || [];
  const latestGrowth = growthData[growthData.length - 1];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <Header />
      
      <main className="pb-20 p-4 space-y-6">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your 1% daily improvements</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-shadow rounded-2xl bg-card p-6 border border-border text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          
          <div className="card-shadow rounded-2xl bg-card p-6 border border-border text-center">
            <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats?.bestStreak || 0}</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </div>
          
          <div className="card-shadow rounded-2xl bg-card p-6 border border-border text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats?.totalImprovements || 0}</div>
            <div className="text-sm text-muted-foreground">Total Improvements</div>
          </div>
          
          <div className="card-shadow rounded-2xl bg-card p-6 border border-border text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{latestGrowth?.improvementPercentage || 0}%</div>
            <div className="text-sm text-muted-foreground">Growth (90 days)</div>
          </div>
        </div>

        {/* Compound Growth Explanation */}
        <div className="card-shadow rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold mb-3">The Power of 1%</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Small daily improvements compound over time. Here's what 1% better every day looks like:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>After 30 days:</span>
              <span className="font-semibold">1.35x better</span>
            </div>
            <div className="flex justify-between">
              <span>After 90 days:</span>
              <span className="font-semibold">2.45x better</span>
            </div>
            <div className="flex justify-between">
              <span>After 365 days:</span>
              <span className="font-semibold text-green-600">37.78x better!</span>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Milestone Progress</h3>
          
          <div className="space-y-4">
            {/* 30-day milestone */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">30-Day Streak</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min(stats?.currentStreak || 0, 30)}/30
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats?.currentStreak || 0) / 30) * 100, 100}%` }}
                ></div>
              </div>
            </div>

            {/* 100 improvements milestone */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">100 Improvements</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min(stats?.totalImprovements || 0, 100)}/100
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats?.totalImprovements || 0) / 100) * 100, 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
