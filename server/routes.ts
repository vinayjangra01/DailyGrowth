import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertImprovementSchema, 
  insertFocusAreaSchema,
  type Improvement,
  type FocusArea,
  type UserStats
} from "@shared/schema";
import { generateImprovementSuggestions, analyzeImprovementPattern } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Default user ID for demo (in real app, get from auth)
  const DEFAULT_USER_ID = 1;

  // Get user stats
  app.get("/api/user/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(DEFAULT_USER_ID);
      if (!stats) {
        return res.status(404).json({ message: "User stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Get all improvements
  app.get("/api/improvements", async (req, res) => {
    try {
      const improvements = await storage.getImprovements(DEFAULT_USER_ID);
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch improvements" });
    }
  });

  // Get improvements by date
  app.get("/api/improvements/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const improvements = await storage.getImprovementsByDate(DEFAULT_USER_ID, date);
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch improvements for date" });
    }
  });

  // Get recent improvements
  app.get("/api/improvements/recent/:days", async (req, res) => {
    try {
      const days = parseInt(req.params.days) || 7;
      const improvements = await storage.getRecentImprovements(DEFAULT_USER_ID, days);
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent improvements" });
    }
  });

  // Create improvement
  app.post("/api/improvements", async (req, res) => {
    try {
      const parsed = insertImprovementSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const improvement = await storage.createImprovement(parsed);
      res.status(201).json(improvement);
    } catch (error) {
      res.status(400).json({ message: "Invalid improvement data" });
    }
  });

  // Get focus areas
  app.get("/api/focus-areas", async (req, res) => {
    try {
      const focusAreas = await storage.getFocusAreas(DEFAULT_USER_ID);
      res.json(focusAreas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch focus areas" });
    }
  });

  // Create focus area
  app.post("/api/focus-areas", async (req, res) => {
    try {
      const parsed = insertFocusAreaSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const focusArea = await storage.createFocusArea(parsed);
      res.status(201).json(focusArea);
    } catch (error) {
      res.status(400).json({ message: "Invalid focus area data" });
    }
  });

  // Update focus area
  app.patch("/api/focus-areas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const focusArea = await storage.updateFocusArea(id, req.body);
      
      if (!focusArea) {
        return res.status(404).json({ message: "Focus area not found" });
      }
      
      res.json(focusArea);
    } catch (error) {
      res.status(400).json({ message: "Failed to update focus area" });
    }
  });

  // Delete focus area
  app.delete("/api/focus-areas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFocusArea(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Focus area not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete focus area" });
    }
  });

  // Get AI suggestions
  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const focusAreas = await storage.getFocusAreas(DEFAULT_USER_ID);
      const recentImprovements = await storage.getRecentImprovements(DEFAULT_USER_ID, 7);
      const userStats = await storage.getUserStats(DEFAULT_USER_ID);

      const suggestions = await generateImprovementSuggestions({
        focusAreas: focusAreas.map(area => area.name),
        recentImprovements: recentImprovements.map(imp => imp.note),
        userProfile: userStats ? {
          currentStreak: userStats.currentStreak,
          totalImprovements: userStats.totalImprovements
        } : undefined
      });

      res.json({ suggestions });
    } catch (error) {
      console.error('AI suggestions error:', error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  // Get weekly analytics
  app.get("/api/analytics/weekly", async (req, res) => {
    try {
      const recentImprovements = await storage.getRecentImprovements(DEFAULT_USER_ID, 7);
      const focusAreas = await storage.getFocusAreas(DEFAULT_USER_ID);
      
      // Count improvements by category
      const categoryStats = focusAreas.map(area => {
        const count = recentImprovements.filter(imp => imp.category.toLowerCase() === area.name.toLowerCase()).length;
        return {
          area: area.name,
          count,
          icon: area.icon,
          color: area.color
        };
      });

      // Calculate consistency (days with at least one improvement)
      const uniqueDays = new Set(
        recentImprovements.map(imp => imp.date.toDateString())
      ).size;
      const consistency = Math.round((uniqueDays / 7) * 100);

      // Find top and lowest performing areas
      const sortedAreas = categoryStats.sort((a, b) => b.count - a.count);
      const topArea = sortedAreas[0];
      const needsAttention = sortedAreas[sortedAreas.length - 1];

      res.json({
        totalImprovements: recentImprovements.length,
        consistency,
        categoryStats,
        topArea,
        needsAttention,
        period: "Dec 9-15, 2024"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly analytics" });
    }
  });

  // Get growth data for chart
  app.get("/api/analytics/growth/:days", async (req, res) => {
    try {
      const days = parseInt(req.params.days) || 30;
      const improvements = await storage.getRecentImprovements(DEFAULT_USER_ID, days);
      
      // Generate growth data points using 1.01^n formula
      const growthData = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Count improvements up to this date
        const improvementsUpToDate = improvements.filter(imp => 
          imp.date <= currentDate
        ).length;
        
        // Calculate compound growth: 1.01^improvements
        const compoundGrowth = Math.pow(1.01, improvementsUpToDate);
        const improvementPercentage = Math.round((compoundGrowth - 1) * 100);
        
        growthData.push({
          date: currentDate.toISOString().split('T')[0],
          improvements: improvementsUpToDate,
          growthMultiplier: compoundGrowth,
          improvementPercentage
        });
      }
      
      res.json({ growthData });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch growth data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
