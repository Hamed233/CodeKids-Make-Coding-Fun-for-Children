import { useQuery } from "@tanstack/react-query";
import { Achievement, UserAchievement } from "@shared/schema";
import { AchievementBadge } from "@/components/AchievementBadge";

export default function Achievements() {
  // Fetch all achievements
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  // Fetch user's unlocked achievements
  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ['/api/me/achievements'],
  });

  // Organize achievements by category
  const achievementCategories = {
    "Getting Started": ["rocket", "code"],
    "Programming Skills": ["loop", "brain"],
    "Creativity": ["puzzle", "star"],
    "Games & Challenges": ["gamepad", "trophy", "medal"],
  };

  // Filter achievements by category
  const getAchievementsByCategory = (categoryIcons: string[]) => {
    return achievements?.filter(achievement => 
      categoryIcons.includes(achievement.iconName)
    ) || [];
  };
  
  // Check if achievement is unlocked
  const isUnlocked = (achievementId: number) => {
    return userAchievements?.some(ua => ua.achievementId === achievementId) || false;
  };

  // Calculate progress
  const unlockedCount = userAchievements?.length || 0;
  const totalCount = achievements?.length || 0;
  const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Achievements</h1>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">Achievement Progress</h2>
            <p className="text-gray-600">
              You've unlocked {unlockedCount} out of {totalCount} achievements
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-5">
                <div 
                  className="bg-primary rounded-full h-5" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="ml-3 font-semibold">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="text-2xl text-gray-400">Loading achievements...</div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Render achievements by category */}
          {Object.entries(achievementCategories).map(([category, icons]) => {
            const categoryAchievements = getAchievementsByCategory(icons);
            
            if (categoryAchievements.length === 0) return null;
            
            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{category}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {categoryAchievements.map(achievement => (
                    <AchievementBadge 
                      key={achievement.id}
                      achievement={achievement}
                      unlocked={isUnlocked(achievement.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
