export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export interface WeeklyAnalytics {
  totalImprovements: number;
  consistency: number;
  categoryStats: {
    area: string;
    count: number;
    icon: string;
    color: string;
  }[];
  topArea: {
    area: string;
    count: number;
    icon: string;
    color: string;
  };
  needsAttention: {
    area: string;
    count: number;
    icon: string;
    color: string;
  };
  period: string;
}

export interface GrowthData {
  date: string;
  improvements: number;
  growthMultiplier: number;
  improvementPercentage: number;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;
  message: string;
}
