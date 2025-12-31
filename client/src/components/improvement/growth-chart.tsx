import { useQuery } from "@tanstack/react-query";
import type { GrowthData } from "@/lib/types";
import type { UserStats } from "@shared/schema";

export default function GrowthChart() {
  const { data: growthResponse } = useQuery<{ growthData: GrowthData[] }>({
    queryKey: ["/api/analytics/growth", "30"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
  });

  const growthData = growthResponse?.growthData || [];
  const latestGrowth = growthData[growthData.length - 1];
  const improvementPercentage = latestGrowth?.improvementPercentage || 0;

  // Generate SVG path for growth curve
  const generatePath = () => {
    if (growthData.length === 0) return "";
    
    const width = 300;
    const height = 100;
    const padding = 20;
    
    const maxImprovements = Math.max(...growthData.map(d => d.improvements), 1);
    
    const points = growthData.map((d, i) => {
      const x = padding + (i / (growthData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.improvements / maxImprovements) * (height - 2 * padding);
      return { x, y };
    });
    
    if (points.length === 0) return "";
    
    let path = `M${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const cpx1 = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
      const cpy1 = prevPoint.y;
      const cpx2 = currentPoint.x - (currentPoint.x - prevPoint.x) * 0.5;
      const cpy2 = currentPoint.y;
      
      path += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${currentPoint.x},${currentPoint.y}`;
    }
    
    return path;
  };

  return (
    <section className="p-4">
      <div className="card-shadow rounded-2xl bg-card p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Growth Trajectory</h2>
          <div className="text-sm text-muted-foreground">1.01^n formula</div>
        </div>
        
        {/* Growth Chart */}
        <div className="relative h-32 bg-gradient-to-t from-green-100/50 dark:from-green-900/20 to-transparent rounded-xl p-4 mb-4">
          <svg className="w-full h-full" viewBox="0 0 300 100">
            <defs>
              <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(158, 64%, 52%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(158, 64%, 52%)" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path 
              d={generatePath()} 
              stroke="hsl(158, 64%, 52%)" 
              strokeWidth="3" 
              fill="none" 
              className="animate-pulse-soft"
            />
            {growthData.length > 0 && (
              <circle 
                cx={290} 
                cy={20} 
                r="4" 
                fill="hsl(158, 64%, 52%)"
              />
            )}
          </svg>
          <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
            {improvementPercentage}% improvement over 30 days
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{stats?.totalImprovements || 0}</div>
            <div className="text-xs text-muted-foreground">Total Logs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {stats?.totalImprovements ? Math.round((stats.totalImprovements / 4.3) * 10) / 10 : 0}
            </div>
            <div className="text-xs text-muted-foreground">Avg/Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{stats?.bestStreak || 0}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </div>
    </section>
  );
}
