import Header from "@/components/layout/header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Calendar, Filter, Dumbbell, Book, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Improvement } from "@shared/schema";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const categoryIcons = {
  fitness: Dumbbell,
  learning: Book,
  mindset: Brain,
  health: Calendar,
  skills: Calendar,
  relationships: Calendar,
  other: Calendar,
};

export default function History() {
  const [filter, setFilter] = useState<string>("all");
  
  const { data: improvements = [], isLoading } = useQuery<Improvement[]>({
    queryKey: ["/api/improvements/recent", "30"],
  });

  const filteredImprovements = improvements.filter(imp => 
    filter === "all" || imp.category === filter
  );

  const groupedImprovements = filteredImprovements.reduce((groups, improvement) => {
    const date = format(parseISO(improvement.date.toISOString()), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(improvement);
    return groups;
  }, {} as Record<string, Improvement[]>);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const categories = Array.from(new Set(improvements.map(imp => imp.category)));

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <Header />
        <main className="pb-20 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-shadow rounded-2xl bg-card p-4 border border-border animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen relative">
      <Header />
      
      <main className="pb-20 p-4 space-y-6">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold mb-2">Improvement History</h1>
          <p className="text-muted-foreground">Review your daily progress</p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className="whitespace-nowrap capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Improvements List */}
        <div className="space-y-4">
          {Object.entries(groupedImprovements)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, dayImprovements]) => (
              <div key={date} className="card-shadow rounded-2xl bg-card p-4 border border-border">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">{getDateLabel(date)}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({dayImprovements.length} improvement{dayImprovements.length !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="space-y-3">
                  {dayImprovements.map((improvement) => {
                    const IconComponent = categoryIcons[improvement.category as keyof typeof categoryIcons] || Calendar;
                    return (
                      <div key={improvement.id} className="flex items-start space-x-3 p-3 bg-muted rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="text-primary w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed">{improvement.note}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground capitalize">
                              {improvement.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(improvement.date.toISOString()), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {filteredImprovements.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No improvements found</h3>
            <p className="text-muted-foreground">
              {filter === "all" 
                ? "Start logging your daily improvements to see them here."
                : `No improvements in the "${filter}" category yet.`
              }
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
