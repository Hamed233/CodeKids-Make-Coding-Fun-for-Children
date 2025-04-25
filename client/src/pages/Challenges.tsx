import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Challenge, UserChallengeProgress } from "@shared/schema";
import { ChallengeCard } from "@/components/ChallengeCard";

export default function Challenges() {
  const [filter, setFilter] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  // Fetch all challenges
  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  // Fetch user's challenge progress
  const { data: userProgress } = useQuery<UserChallengeProgress[]>({
    queryKey: ['/api/me/challenges'],
  });

  // Filter challenges based on selected filters
  const filteredChallenges = challenges?.filter(challenge => {
    const difficultyMatch = difficulty === "all" || challenge.difficulty.toLowerCase() === difficulty.toLowerCase();
    
    if (filter === "all") return difficultyMatch;
    if (filter === "completed") {
      return difficultyMatch && userProgress?.some(p => p.challengeId === challenge.id && p.completed);
    }
    if (filter === "in-progress") {
      return difficultyMatch && userProgress?.some(p => p.challengeId === challenge.id && !p.completed);
    }
    if (filter === "not-started") {
      return difficultyMatch && !userProgress?.some(p => p.challengeId === challenge.id);
    }
    
    return difficultyMatch && challenge.type === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Challenges</h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Filter By:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "maze" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("maze")}
              >
                Maze
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "art" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("art")}
              >
                Art
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "game" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("game")}
              >
                Games
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "puzzle" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("puzzle")}
              >
                Puzzles
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Difficulty:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${difficulty === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setDifficulty("all")}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${difficulty === "beginner" ? "bg-accent text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setDifficulty("beginner")}
              >
                Beginner
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${difficulty === "intermediate" ? "bg-secondary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setDifficulty("intermediate")}
              >
                Intermediate
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${difficulty === "advanced" ? "bg-purple text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setDifficulty("advanced")}
              >
                Advanced
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Status:</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "completed" ? "bg-accent text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "in-progress" ? "bg-yellow text-gray-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("in-progress")}
              >
                In Progress
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${filter === "not-started" ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("not-started")}
              >
                Not Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="text-2xl text-gray-400">Loading challenges...</div>
        </div>
      ) : filteredChallenges && filteredChallenges.length > 0 ? (
        <div className="challenges-grid">
          {filteredChallenges.map(challenge => {
            const progress = userProgress?.find(p => p.challengeId === challenge.id);
            return (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                progress={progress}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-5xl mb-4">
            <i className="ri-search-line text-gray-300"></i>
          </div>
          <div className="text-2xl text-gray-400">No challenges found</div>
          <p className="text-gray-500 mt-2">Try changing your filters</p>
        </div>
      )}
    </div>
  );
}
