import { 
  users, improvements, focusAreas, userStats,
  type User, type InsertUser, 
  type Improvement, type InsertImprovement,
  type FocusArea, type InsertFocusArea,
  type UserStats, type InsertUserStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Improvement methods
  getImprovements(userId: number): Promise<Improvement[]>;
  getImprovementsByDate(userId: number, date: string): Promise<Improvement[]>;
  createImprovement(improvement: InsertImprovement): Promise<Improvement>;
  getRecentImprovements(userId: number, days: number): Promise<Improvement[]>;
  
  // Focus area methods
  getFocusAreas(userId: number): Promise<FocusArea[]>;
  createFocusArea(focusArea: InsertFocusArea): Promise<FocusArea>;
  updateFocusArea(id: number, focusArea: Partial<FocusArea>): Promise<FocusArea | undefined>;
  deleteFocusArea(id: number): Promise<boolean>;
  
  // User stats methods
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private improvements: Map<number, Improvement>;
  private focusAreas: Map<number, FocusArea>;
  private userStats: Map<number, UserStats>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.improvements = new Map();
    this.focusAreas = new Map();
    this.userStats = new Map();
    this.currentId = 1;
    
    // Initialize demo user
    this.initDemoData();
  }

  private initDemoData() {
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "demo",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);
    
    const demoStats: UserStats = {
      id: 1,
      userId: 1,
      currentStreak: 24,
      bestStreak: 31,
      totalImprovements: 156,
      lastLogDate: new Date(),
    };
    this.userStats.set(1, demoStats);
    
    const defaultFocusAreas: FocusArea[] = [
      { id: 1, userId: 1, name: "Fitness", icon: "dumbbell", color: "blue", isActive: true },
      { id: 2, userId: 1, name: "Learning", icon: "book", color: "purple", isActive: true },
      { id: 3, userId: 1, name: "Mindset", icon: "brain", color: "green", isActive: true },
    ];
    
    defaultFocusAreas.forEach(area => this.focusAreas.set(area.id, area));
    this.currentId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    
    // Initialize user stats
    const stats: UserStats = {
      id: this.currentId++,
      userId: id,
      currentStreak: 0,
      bestStreak: 0,
      totalImprovements: 0,
      lastLogDate: null,
    };
    this.userStats.set(id, stats);
    
    return user;
  }

  async getImprovements(userId: number): Promise<Improvement[]> {
    return Array.from(this.improvements.values()).filter(imp => imp.userId === userId);
  }

  async getImprovementsByDate(userId: number, date: string): Promise<Improvement[]> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    return Array.from(this.improvements.values()).filter(imp => 
      imp.userId === userId && 
      imp.date >= startOfDay && 
      imp.date <= endOfDay
    );
  }

  async createImprovement(insertImprovement: InsertImprovement): Promise<Improvement> {
    const id = this.currentId++;
    const improvement: Improvement = { 
      ...insertImprovement, 
      id, 
      date: new Date() 
    };
    this.improvements.set(id, improvement);
    
    // Update user stats
    await this.updateStreakAndStats(insertImprovement.userId);
    
    return improvement;
  }

  async getRecentImprovements(userId: number, days: number): Promise<Improvement[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.improvements.values())
      .filter(imp => imp.userId === userId && imp.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getFocusAreas(userId: number): Promise<FocusArea[]> {
    return Array.from(this.focusAreas.values()).filter(area => 
      area.userId === userId && area.isActive
    );
  }

  async createFocusArea(insertFocusArea: InsertFocusArea): Promise<FocusArea> {
    const id = this.currentId++;
    const focusArea: FocusArea = { 
      ...insertFocusArea, 
      id,
      isActive: insertFocusArea.isActive ?? true
    };
    this.focusAreas.set(id, focusArea);
    return focusArea;
  }

  async updateFocusArea(id: number, updateData: Partial<FocusArea>): Promise<FocusArea | undefined> {
    const existing = this.focusAreas.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updateData };
    this.focusAreas.set(id, updated);
    return updated;
  }

  async deleteFocusArea(id: number): Promise<boolean> {
    return this.focusAreas.delete(id);
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async updateUserStats(userId: number, updateData: Partial<UserStats>): Promise<UserStats> {
    const existing = this.userStats.get(userId) || {
      id: this.currentId++,
      userId,
      currentStreak: 0,
      bestStreak: 0,
      totalImprovements: 0,
      lastLogDate: null,
    };
    
    const updated = { ...existing, ...updateData };
    this.userStats.set(userId, updated);
    return updated;
  }

  private async updateStreakAndStats(userId: number): Promise<void> {
    const stats = await this.getUserStats(userId);
    if (!stats) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayLogs = await this.getImprovementsByDate(userId, today.toISOString());
    const yesterdayLogs = await this.getImprovementsByDate(userId, yesterday.toISOString());
    
    let newStreak = stats.currentStreak;
    
    if (todayLogs.length > 0) {
      if (!stats.lastLogDate || stats.lastLogDate < today) {
        // First log today
        if (yesterdayLogs.length > 0 || !stats.lastLogDate) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak if missed yesterday
        }
      }
    }
    
    await this.updateUserStats(userId, {
      currentStreak: newStreak,
      bestStreak: Math.max(stats.bestStreak, newStreak),
      totalImprovements: stats.totalImprovements + 1,
      lastLogDate: today,
    });
  }
}

export const storage = new MemStorage();
