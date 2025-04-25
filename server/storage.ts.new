import {
  users, lessons, lessonProgress, challenges, achievements, userAchievements, userChallengeProgress,
  type User, type InsertUser, type Lesson, type InsertLesson, type LessonProgress, type InsertLessonProgress,
  type Challenge, type InsertChallenge, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement, type UserChallengeProgress, type InsertUserChallengeProgress
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lesson methods
  getLesson(id: number): Promise<Lesson | undefined>;
  getAllLessons(): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Lesson Progress methods
  getUserLessonProgress(userId: number): Promise<LessonProgress[]>;
  getUserLessonProgressByLesson(userId: number, lessonId: number): Promise<LessonProgress | undefined>;
  createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  updateLessonProgress(userId: number, lessonId: number, currentStep: number, completed?: boolean): Promise<LessonProgress>;
  
  // Challenge methods
  getChallenge(id: number): Promise<Challenge | undefined>;
  getAllChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // User Challenge Progress methods
  getUserChallengeProgress(userId: number): Promise<UserChallengeProgress[]>;
  getUserChallengeProgressByChallenge(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined>;
  createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;
  updateChallengeProgress(userId: number, challengeId: number, completed?: boolean, starsEarned?: number): Promise<UserChallengeProgress>;
  
  // Achievement methods
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User Achievement methods
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private lessons = new Map<number, Lesson>();
  private lessonProgress = new Map<string, LessonProgress>();
  private challenges = new Map<number, Challenge>();
  private userChallengeProgress = new Map<string, UserChallengeProgress>();
  private achievements = new Map<number, Achievement>();
  private userAchievements = new Map<string, UserAchievement>();
  
  private currentUserId = 1;
  private currentLessonId = 1;
  private currentLessonProgressId = 1;
  private currentChallengeId = 1;
  private currentUserChallengeProgressId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  
  // Session store for authentication
  public sessionStore: session.Store;
  
  constructor() {
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, level: 1, points: 0, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Lesson Progress methods
  async getUserLessonProgress(userId: number): Promise<LessonProgress[]> {
    return Array.from(this.lessonProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async getUserLessonProgressByLesson(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    const key = `${userId}-${lessonId}`;
    return this.lessonProgress.get(key);
  }

  async createLessonProgress(insertProgress: InsertLessonProgress): Promise<LessonProgress> {
    const id = this.currentLessonProgressId++;
    const now = new Date();
    const progress: LessonProgress = { ...insertProgress, id, lastUpdated: now };
    
    // Use composite key for faster lookup
    const key = `${insertProgress.userId}-${insertProgress.lessonId}`;
    this.lessonProgress.set(key, progress);
    
    return progress;
  }

  async updateLessonProgress(userId: number, lessonId: number, currentStep: number, completed = false): Promise<LessonProgress> {
    const key = `${userId}-${lessonId}`;
    const existing = this.lessonProgress.get(key);
    
    if (!existing) {
      // Create new progress if it doesn't exist
      return this.createLessonProgress({
        userId,
        lessonId,
        currentStep,
        completed
      });
    }
    
    // Update existing progress
    const now = new Date();
    const updated: LessonProgress = {
      ...existing,
      currentStep,
      completed: completed || existing.completed,
      lastUpdated: now
    };
    
    this.lessonProgress.set(key, updated);
    return updated;
  }

  // Challenge methods
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).sort((a, b) => a.order - b.order);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const challenge: Challenge = { ...insertChallenge, id };
    this.challenges.set(id, challenge);
    return challenge;
  }

  // User Challenge Progress methods
  async getUserChallengeProgress(userId: number): Promise<UserChallengeProgress[]> {
    return Array.from(this.userChallengeProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async getUserChallengeProgressByChallenge(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    const key = `${userId}-${challengeId}`;
    return this.userChallengeProgress.get(key);
  }

  async createUserChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const id = this.currentUserChallengeProgressId++;
    const now = new Date();
    const progress: UserChallengeProgress = { ...insertProgress, id, lastUpdated: now };
    
    // Use composite key for faster lookup
    const key = `${insertProgress.userId}-${insertProgress.challengeId}`;
    this.userChallengeProgress.set(key, progress);
    
    return progress;
  }

  async updateChallengeProgress(userId: number, challengeId: number, completed = false, starsEarned = 0): Promise<UserChallengeProgress> {
    const key = `${userId}-${challengeId}`;
    const existing = this.userChallengeProgress.get(key);
    
    if (!existing) {
      // Create new progress if it doesn't exist
      return this.createUserChallengeProgress({
        userId,
        challengeId,
        completed,
        starsEarned
      });
    }
    
    // Update existing progress
    const now = new Date();
    const updated: UserChallengeProgress = {
      ...existing,
      completed: completed || existing.completed,
      starsEarned: starsEarned !== undefined ? starsEarned : existing.starsEarned,
      lastUpdated: now
    };
    
    this.userChallengeProgress.set(key, updated);
    return updated;
  }

  // Achievement methods
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // User Achievement methods
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (ua) => ua.userId === userId
    );
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const key = `${userId}-${achievementId}`;
    
    // Check if already unlocked
    const existing = this.userAchievements.get(key);
    if (existing) {
      return existing;
    }
    
    // Create new achievement unlock
    const id = this.currentUserAchievementId++;
    const now = new Date();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: now
    };
    
    this.userAchievements.set(key, userAchievement);
    return userAchievement;
  }
}

export const storage = new MemStorage();