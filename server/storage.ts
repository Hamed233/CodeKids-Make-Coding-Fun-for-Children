import {
  users, lessons, lessonProgress, challenges, achievements, userAchievements, userChallengeProgress,
  type User, type InsertUser, type Lesson, type InsertLesson, type LessonProgress, type InsertLessonProgress,
  type Challenge, type InsertChallenge, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement, type UserChallengeProgress, type InsertUserChallengeProgress
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and } from "drizzle-orm";

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
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    const result = await db.select().from(lessons).where(eq(lessons.id, id));
    return result[0];
  }

  async getAllLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).orderBy(lessons.order);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const result = await db.insert(lessons).values(lesson).returning();
    return result[0];
  }

  // Lesson Progress methods
  async getUserLessonProgress(userId: number): Promise<LessonProgress[]> {
    return db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  }

  async getUserLessonProgressByLesson(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    const result = await db.select().from(lessonProgress).where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.lessonId, lessonId)
      )
    );
    return result[0];
  }

  async createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const result = await db.insert(lessonProgress).values(progress).returning();
    return result[0];
  }

  async updateLessonProgress(userId: number, lessonId: number, currentStep: number, completed = false): Promise<LessonProgress> {
    const existing = await this.getUserLessonProgressByLesson(userId, lessonId);
    
    if (!existing) {
      return this.createLessonProgress({
        userId,
        lessonId,
        currentStep,
        completed
      });
    }
    
    const result = await db.update(lessonProgress)
      .set({ 
        currentStep, 
        completed: completed || existing.completed,
        lastUpdated: new Date()
      })
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonId, lessonId)
        )
      )
      .returning();
    
    return result[0];
  }

  // Challenge methods
  async getChallenge(id: number): Promise<Challenge | undefined> {
    const result = await db.select().from(challenges).where(eq(challenges.id, id));
    return result[0];
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).orderBy(challenges.order);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const result = await db.insert(challenges).values(challenge).returning();
    return result[0];
  }

  // User Challenge Progress methods
  async getUserChallengeProgress(userId: number): Promise<UserChallengeProgress[]> {
    return db.select().from(userChallengeProgress).where(eq(userChallengeProgress.userId, userId));
  }

  async getUserChallengeProgressByChallenge(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    const result = await db.select().from(userChallengeProgress).where(
      and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId)
      )
    );
    return result[0];
  }

  async createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const result = await db.insert(userChallengeProgress).values(progress).returning();
    return result[0];
  }

  async updateChallengeProgress(userId: number, challengeId: number, completed = false, starsEarned = 0): Promise<UserChallengeProgress> {
    const existing = await this.getUserChallengeProgressByChallenge(userId, challengeId);
    
    if (!existing) {
      return this.createUserChallengeProgress({
        userId,
        challengeId,
        completed,
        starsEarned
      });
    }
    
    const result = await db.update(userChallengeProgress)
      .set({ 
        completed: completed || existing.completed, 
        starsEarned: (starsEarned !== undefined) ? starsEarned : existing.starsEarned,
        lastUpdated: new Date()
      })
      .where(
        and(
          eq(userChallengeProgress.userId, userId),
          eq(userChallengeProgress.challengeId, challengeId)
        )
      )
      .returning();
    
    return result[0];
  }

  // Achievement methods
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const result = await db.select().from(achievements).where(eq(achievements.id, id));
    return result[0];
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  // User Achievement methods
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    // Check if already unlocked
    const existing = await db.select().from(userAchievements).where(
      and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      )
    );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    // Create new achievement unlock
    const result = await db.insert(userAchievements).values({
      userId,
      achievementId,
    }).returning();
    
    return result[0];
  }
}

export const storage = new DatabaseStorage();