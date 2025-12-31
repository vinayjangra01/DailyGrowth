import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "demo_key"
});

export interface SuggestionRequest {
  focusAreas: string[];
  recentImprovements: string[];
  userProfile?: {
    currentStreak: number;
    totalImprovements: number;
  };
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
}

export async function generateImprovementSuggestions(
  request: SuggestionRequest
): Promise<ImprovementSuggestion[]> {
  try {
    const prompt = `You are an AI coach helping users improve 1% every day. Based on the user's focus areas and recent improvements, suggest 3-4 specific, actionable micro-improvements they can do today.

Focus Areas: ${request.focusAreas.join(', ')}
Recent Improvements: ${request.recentImprovements.slice(0, 5).join('; ')}
Current Streak: ${request.userProfile?.currentStreak || 0} days
Total Improvements: ${request.userProfile?.totalImprovements || 0}

Guidelines:
- Suggestions should be small, achievable actions (1% improvements)
- Each should take 5-30 minutes maximum
- Be specific and actionable
- Vary difficulty levels
- Focus on the user's focus areas
- Consider their recent patterns to avoid repetition

Respond with JSON in this format:
{
  "suggestions": [
    {
      "category": "focus area name",
      "suggestion": "specific actionable task",
      "difficulty": "easy|medium|hard",
      "estimatedTime": "5-10 minutes"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a helpful AI coach focused on helping users make small daily improvements. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    // Return fallback suggestions
    return [
      {
        category: request.focusAreas[0] || "General",
        suggestion: "Take 5 minutes to reflect on one thing you learned today",
        difficulty: "easy" as const,
        estimatedTime: "5 minutes"
      },
      {
        category: request.focusAreas[1] || "Health",
        suggestion: "Do 10 deep breathing exercises",
        difficulty: "easy" as const,
        estimatedTime: "3 minutes"
      }
    ];
  }
}

export async function analyzeImprovementPattern(improvements: string[]): Promise<{
  insights: string[];
  recommendations: string[];
}> {
  try {
    const prompt = `Analyze these recent improvement logs and provide insights about patterns and recommendations for future growth:

Recent Improvements:
${improvements.join('\n')}

Provide analysis in JSON format:
{
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an AI coach analyzing user improvement patterns. Provide actionable insights and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": [], "recommendations": []}');
    return {
      insights: result.insights || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error('Error analyzing pattern:', error);
    return {
      insights: ["You're building consistent improvement habits"],
      recommendations: ["Continue focusing on your chosen areas", "Try varying your improvement types"]
    };
  }
}
