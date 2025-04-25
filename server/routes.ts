import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertUserSchema,
  insertLessonSchema,
  insertChallengeSchema,
  insertAchievementSchema,
  insertLessonProgressSchema,
  insertUserChallengeProgressSchema,
  insertUserAchievementSchema,
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize with sample data
  await initializeSampleData();

  // User routes
  app.get("/api/me", async (req, res) => {
    try {
      // Mock user for demo purposes - in a real app this would use auth
      const user = await storage.getUserByUsername("demo_user");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getAllLessons();
      return res.json(lessons);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      return res.json(lesson);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // User lesson progress routes
  app.get("/api/me/lessons", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const progress = await storage.getUserLessonProgress(userId);
      return res.json(progress);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/me/lessons/:id", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const lessonId = parseInt(req.params.id);
      
      const progress = await storage.getUserLessonProgressByLesson(userId, lessonId);
      
      if (!progress) {
        // Create default progress if it doesn't exist
        const newProgress = await storage.createLessonProgress({
          userId,
          lessonId,
          currentStep: 1,
          completed: false
        });
        return res.json(newProgress);
      }
      
      return res.json(progress);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/me/lessons/:id", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const lessonId = parseInt(req.params.id);
      
      // Validate request body
      const schema = z.object({
        currentStep: z.number().int().positive(),
        completed: z.boolean().optional()
      });
      
      const validatedData = schema.parse(req.body);
      
      // Update progress
      const updatedProgress = await storage.updateLessonProgress(
        userId,
        lessonId,
        validatedData.currentStep,
        validatedData.completed
      );
      
      return res.json(updatedProgress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Challenge routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      return res.json(challenges);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/challenges/recommended", async (req, res) => {
    try {
      // Get a subset of challenges as recommendations
      const challenges = await storage.getAllChallenges();
      const recommended = challenges.slice(0, 4);
      return res.json(recommended);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await storage.getChallenge(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      return res.json(challenge);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  // User challenge progress routes
  app.get("/api/me/challenges", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const progress = await storage.getUserChallengeProgress(userId);
      return res.json(progress);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/me/challenges/:id", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const challengeId = parseInt(req.params.id);
      
      // Validate request body
      const schema = z.object({
        completed: z.boolean().optional(),
        starsEarned: z.number().int().min(0).max(3).optional()
      });
      
      const validatedData = schema.parse(req.body);
      
      // Update progress
      const updatedProgress = await storage.updateChallengeProgress(
        userId,
        challengeId,
        validatedData.completed,
        validatedData.starsEarned
      );
      
      return res.json(updatedProgress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      return res.json(achievements);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/me/achievements", async (req, res) => {
    try {
      // Mock user ID for demo
      const userId = 1;
      const achievements = await storage.getUserAchievements(userId);
      return res.json(achievements);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize sample data for the app
async function initializeSampleData() {
  try {
    // Check if user exists, if not create one
    const existingUser = await storage.getUserByUsername("demo_user");
    if (!existingUser) {
      await storage.createUser({
        username: "demo_user",
        password: "password", // In a real app, this would be hashed
        displayName: "Alex"
      });
    }

    // Create sample lessons if none exist
    const lessons = await storage.getAllLessons();
    if (lessons.length === 0) {
      await storage.createLesson({
        title: "Move the Turtle 🐢",
        description: "Learn how to use motion blocks to move characters on screen",
        difficulty: "Beginner",
        duration: 10,
        totalSteps: 6,
        order: 1
      });

      await storage.createLesson({
        title: "Fun with Loops 🔄",
        description: "Learn how to repeat actions using loops",
        difficulty: "Beginner",
        duration: 15,
        totalSteps: 5,
        order: 2
      });

      await storage.createLesson({
        title: "Make Decisions ⚖️",
        description: "Use if-then blocks to make decisions in your code",
        difficulty: "Intermediate",
        duration: 20,
        totalSteps: 8,
        order: 3
      });
    }

    // Create sample challenges if none exist
    const challenges = await storage.getAllChallenges();
    if (challenges.length === 0) {
      await storage.createChallenge({
        title: "Maze Runner",
        description: "Guide the character through a maze using code blocks",
        difficulty: "Beginner",
        initialBlocks: "[]",
        goalDescription: "Get to the end of the maze",
        imageUrl: "https://img.icons8.com/color/96/000000/maze.png",
        type: "maze",
        order: 1
      });

      await storage.createChallenge({
        title: "Pattern Artist",
        description: "Create beautiful patterns with loops and movement",
        difficulty: "Intermediate",
        initialBlocks: "[]",
        goalDescription: "Draw a colorful pattern",
        imageUrl: "https://img.icons8.com/color/96/000000/drawing.png",
        type: "art",
        order: 2
      });

      await storage.createChallenge({
        title: "Dino Jump",
        description: "Create a simple jumping game with events and controls",
        difficulty: "Intermediate",
        initialBlocks: "[]",
        goalDescription: "Make a dinosaur jump over obstacles",
        imageUrl: "https://img.icons8.com/color/96/000000/dinosaur.png",
        type: "game",
        order: 3
      });

      await storage.createChallenge({
        title: "Bug Finder",
        description: "Find and fix the bugs in the code",
        difficulty: "Advanced",
        initialBlocks: "[]",
        goalDescription: "Fix all the bugs to make the program work",
        imageUrl: "https://img.icons8.com/color/96/000000/bug.png",
        type: "puzzle",
        order: 4
      });
    }

    // Create sample achievements if none exist
    const achievements = await storage.getAllAchievements();
    if (achievements.length === 0) {
      await storage.createAchievement({
        title: "First Steps",
        description: "Completed your first challenge",
        iconName: "rocket",
        requirement: "challenge_complete",
        requiredCount: 1
      });

      await storage.createAchievement({
        title: "Block Master",
        description: "Used 10 different blocks",
        iconName: "code",
        requirement: "blocks_used",
        requiredCount: 10
      });

      await storage.createAchievement({
        title: "Loop Expert",
        description: "Used loops in 5 projects",
        iconName: "loop",
        requirement: "loops_used",
        requiredCount: 5
      });

      await storage.createAchievement({
        title: "Game Creator",
        description: "Made your first game",
        iconName: "gamepad",
        requirement: "game_created",
        requiredCount: 1
      });

      await storage.createAchievement({
        title: "Star Collector",
        description: "Earned 10 stars in challenges",
        iconName: "star",
        requirement: "stars_earned",
        requiredCount: 10
      });

      await storage.createAchievement({
        title: "Perfect Score",
        description: "Earned 3 stars in a challenge",
        iconName: "trophy",
        requirement: "perfect_challenge",
        requiredCount: 1
      });
    }

    // Add some unlocked achievements for the demo user
    const user = await storage.getUserByUsername("demo_user");
    if (user) {
      const userAchievements = await storage.getUserAchievements(user.id);
      
      if (userAchievements.length === 0) {
        const allAchievements = await storage.getAllAchievements();
        
        // Unlock the first two achievements
        if (allAchievements.length >= 2) {
          await storage.unlockAchievement(user.id, allAchievements[0].id);
          await storage.unlockAchievement(user.id, allAchievements[1].id);
        }
      }
    }

    // Create initial lesson progress for the demo user
    const demoUser = await storage.getUserByUsername("demo_user");
    if (demoUser) {
      const userLessonProgress = await storage.getUserLessonProgress(demoUser.id);
      
      if (userLessonProgress.length === 0) {
        const allLessons = await storage.getAllLessons();
        
        if (allLessons.length > 0) {
          // Create progress for the first lesson
          await storage.createLessonProgress({
            userId: demoUser.id,
            lessonId: allLessons[0].id,
            currentStep: 2,
            completed: false
          });
        }
      }
    }

    // Create initial challenge progress for the demo user
    if (demoUser) {
      const userChallengeProgress = await storage.getUserChallengeProgress(demoUser.id);
      
      if (userChallengeProgress.length === 0) {
        const allChallenges = await storage.getAllChallenges();
        
        if (allChallenges.length > 0) {
          // Mark the first challenge as completed
          await storage.createUserChallengeProgress({
            userId: demoUser.id,
            challengeId: allChallenges[0].id,
            completed: true,
            starsEarned: 2
          });
          
          // Add in-progress for the second challenge
          if (allChallenges.length > 1) {
            await storage.createUserChallengeProgress({
              userId: demoUser.id,
              challengeId: allChallenges[1].id,
              completed: false,
              starsEarned: 0
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}
