import { Lightbulb, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { ImprovementSuggestion } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import AddImprovementModal from "./add-improvement-modal";

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function AISuggestions() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<ImprovementSuggestion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestionsData, isLoading, error } = useQuery<{ suggestions: ImprovementSuggestion[] }>({
    queryKey: ["/api/ai/suggestions"],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/suggestions", {});
      return response.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/suggestions", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/ai/suggestions"], data);
      toast({
        title: "Suggestions refreshed",
        description: "New AI suggestions have been generated for you.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to refresh suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const suggestions = suggestionsData?.suggestions || [];

  const handleUseSuggestion = (suggestion: ImprovementSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowModal(true);
  };

  if (error) {
    return (
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 border border-purple-200 dark:border-purple-700">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">Unable to load AI suggestions</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-4">
        <div className="card-shadow rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Lightbulb className="text-purple-600 dark:text-purple-400 w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold">AI Suggestions</h2>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-background rounded-xl border animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-background dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {suggestion.category}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={difficultyColors[suggestion.difficulty]}
                      >
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{suggestion.estimatedTime}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-purple-600 hover:text-purple-700 h-auto p-1"
                        onClick={() => handleUseSuggestion(suggestion)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="mb-2">No suggestions available</p>
              <p className="text-xs">Set up your focus areas to get personalized suggestions</p>
            </div>
          )}
          
          <Button 
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            variant="outline"
            className="w-full mt-4 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            {refreshMutation.isPending ? 'Generating...' : 'Get New Suggestions'}
          </Button>
        </div>
      </section>

      <AddImprovementModal 
        open={showModal} 
        onOpenChange={setShowModal}
        prefillData={selectedSuggestion ? {
          note: selectedSuggestion.suggestion,
          category: selectedSuggestion.category.toLowerCase()
        } : undefined}
      />
    </>
  );
}
