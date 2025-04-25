import { Link } from "wouter";
import { Challenge, UserChallengeProgress } from "@shared/schema";

interface ChallengeCardProps {
  challenge: Challenge;
  progress?: UserChallengeProgress;
}

export function ChallengeCard({ challenge, progress }: ChallengeCardProps) {
  const { id, title, description, difficulty, imageUrl, type } = challenge;
  
  // Determine stars earned
  const starsEarned = progress?.starsEarned || 0;
  const isCompleted = progress?.completed || false;
  
  // Get color scheme based on challenge type
  const getGradient = (type: string) => {
    switch (type) {
      case "maze":
        return "from-primary to-purple";
      case "art":
        return "from-secondary to-yellow";
      case "game":
        return "from-accent to-teal";
      case "puzzle":
        return "from-purple to-primary";
      default:
        return "from-primary to-accent";
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-accent/20 text-accent";
      case "intermediate":
        return "bg-secondary/20 text-secondary";
      case "advanced":
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className={`h-32 bg-gradient-to-r ${getGradient(type)} flex items-center justify-center`}>
        <img 
          src={imageUrl} 
          alt={`${title} Challenge`} 
          className="h-16 w-16"
        />
      </div>
      <div className="p-4">
        <h4 className="font-baloo font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="flex items-center mt-3">
          <div className={`${getDifficultyColor(difficulty)} rounded-full px-2 py-0.5 text-xs font-semibold`}>
            {difficulty}
          </div>
          <div className="ml-auto flex">
            {[...Array(3)].map((_, i) => (
              <i 
                key={i} 
                className={`ri-star-${i < starsEarned ? 'fill' : 'line'} ${i < starsEarned ? 'text-yellow' : 'text-gray-300'}`}
              ></i>
            ))}
          </div>
        </div>
        {isCompleted ? (
          <div className="mt-3 text-xs text-accent font-semibold">
            <i className="ri-check-line mr-1"></i> Completed
          </div>
        ) : (
          <div className="mt-3">
            <Link href={`/challenges/${id}`}>
              <a className="text-primary text-sm font-semibold hover:underline">
                Start Challenge <i className="ri-arrow-right-s-line"></i>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
