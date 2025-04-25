import { db } from "./db";
import { challenges } from "@shared/schema";
import { eq } from "drizzle-orm";

async function resetChallengeImagePaths() {
  try {
    // Update the Maze Runner challenge
    await db.update(challenges)
      .set({ imageUrl: "/images/challenges/maze.svg" })
      .where(eq(challenges.title, "Maze Runner"));
    
    // Update the Pattern Artist challenge
    await db.update(challenges)
      .set({ imageUrl: "/images/challenges/drawing.svg" })
      .where(eq(challenges.title, "Pattern Artist"));
    
    // Update the Dino Jump challenge
    await db.update(challenges)
      .set({ imageUrl: "/images/challenges/dinosaur.svg" })
      .where(eq(challenges.title, "Dino Jump"));
    
    // Update the Bug Finder challenge
    await db.update(challenges)
      .set({ imageUrl: "/images/challenges/bug.svg" })
      .where(eq(challenges.title, "Bug Finder"));
    
    console.log("Challenge image paths updated successfully");
  } catch (error) {
    console.error("Error updating challenge image paths:", error);
  }
}

// Execute the function
resetChallengeImagePaths()
  .then(() => {
    console.log("Database reset complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to reset database:", error);
    process.exit(1);
  });