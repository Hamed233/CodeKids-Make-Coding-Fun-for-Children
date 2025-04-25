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
    <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
      <div className={`h-36 bg-gradient-to-r ${getGradient(type)} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300"></div>
        <img 
          src={imageUrl} 
          alt={`${title} Challenge`} 
          className="h-20 w-20 drop-shadow-md transform group-hover:scale-110 transition-transform duration-500"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
            <i className="ri-checkbox-circle-fill text-accent text-lg"></i>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-baloo font-semibold text-foreground text-lg leading-tight">{title}</h4>
          <div className={`${getDifficultyColor(difficulty)} rounded-full px-2.5 py-0.5 text-xs font-medium ml-2 flex-shrink-0`}>
            {difficulty}
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-4">{description}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <i 
                key={i} 
                className={`ri-star-${i < starsEarned ? 'fill' : 'line'} ${i < starsEarned ? 'text-yellow-500' : 'text-muted/40'} text-lg`}
              ></i>
            ))}
          </div>
          
          <Link href={`/challenges/${id}`}>
            <a className={`px-3 py-1.5 rounded-md text-sm font-medium 
              ${isCompleted 
                ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                : 'bg-primary/10 text-primary hover:bg-primary/20'
              } transition-colors duration-200 flex items-center`}>
              {isCompleted ? (
                <>
                  <i className="ri-eye-line mr-1.5"></i>
                  <span>Review</span>
                </>
              ) : (
                <>
                  <i className="ri-play-fill mr-1.5"></i>
                  <span>Start</span>
                </>
              )}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
