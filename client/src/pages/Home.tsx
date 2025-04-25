import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Lesson, Challenge, Achievement, User, LessonProgress, UserChallengeProgress, UserAchievement } from "@shared/schema";
import { AchievementBadge } from "@/components/AchievementBadge";
import { ChallengeCard } from "@/components/ChallengeCard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("learn");

  // Fetch current user
  const { data: user } = useQuery<User | null>({
    queryKey: ['/api/me']
  });

  // Fetch lessons with current user's progress
  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: ['/api/lessons'],
    enabled: !!user,
  });

  // Fetch user's lesson progress
  const { data: lessonProgress } = useQuery<LessonProgress[]>({
    queryKey: ['/api/me/lessons'],
    enabled: !!user && !!lessons,
  });

  // Fetch recommended challenges
  const { data: challenges, isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges/recommended'],
    enabled: !!user,
  });

  // Fetch user's challenge progress
  const { data: challengeProgress } = useQuery<UserChallengeProgress[]>({
    queryKey: ['/api/me/challenges'],
    enabled: !!user && !!challenges,
  });

  // Fetch achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    enabled: !!user,
  });

  // Fetch user's unlocked achievements
  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ['/api/me/achievements'],
    enabled: !!user && !!achievements,
  });

  // Find current lesson
  const currentLesson = lessons && lessonProgress && lessons.length > 0
    ? lessons.find(lesson => {
        const progress = lessonProgress.find(p => p.lessonId === lesson.id);
        return !progress || !progress.completed;
      }) || lessons[0]
    : null;

  // Get progress for current lesson
  const currentLessonProgress = currentLesson && lessonProgress
    ? lessonProgress.find(p => p.lessonId === currentLesson.id)
    : null;

  // Calculate progress percentage
  const progressPercentage = currentLesson && currentLessonProgress
    ? (currentLessonProgress.currentStep / currentLesson.totalSteps) * 100
    : 0;

  return (
    <div className="flex-grow flex flex-col">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-4 font-baloo text-lg">
            <button
              className={`py-4 px-4 ${activeTab === "learn" ? "border-b-4 border-primary text-primary font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("learn")}
            >
              Learn
            </button>
            <button
              className={`py-4 px-4 ${activeTab === "puzzles" ? "border-b-4 border-primary text-primary font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("puzzles")}
            >
              Puzzles
            </button>
            <button
              className={`py-4 px-4 ${activeTab === "projects" ? "border-b-4 border-primary text-primary font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              className={`py-4 px-4 ${activeTab === "games" ? "border-b-4 border-primary text-primary font-semibold" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("games")}
            >
              Games
            </button>
          </nav>
        </div>
      </div>

      {/* Current Lesson Section */}
      {currentLesson && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-baloo text-gray-800">{currentLesson.title}</h2>
                <p className="text-gray-600 font-nunito">{currentLesson.description}</p>
                <div className="mt-2 flex items-center">
                  <div className={`bg-secondary/20 text-secondary rounded-full px-3 py-1 text-sm font-semibold`}>
                    {currentLesson.difficulty}
                  </div>
                  <div className="ml-4 flex items-center text-gray-500 text-sm">
                    <i className="ri-time-line mr-1"></i> {currentLesson.duration} minutes
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-accent rounded-full h-3" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {currentLessonProgress?.currentStep || 1}/{currentLesson.totalSteps}
                  </span>
                </div>
                <Link href={`/lessons/${currentLesson.id}`}>
                  <a className="mt-3 bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-6 rounded-xl shadow-kid hover:shadow-kid-hover transition-all duration-200 font-baloo flex items-center">
                    <span>Continue</span>
                    <i className="ri-arrow-right-line ml-2"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow py-6">
        <div className="container mx-auto px-4">
          {/* Achievement Section */}
          <div className="mt-8">
            <h3 className="font-baloo text-2xl font-bold mb-4 text-gray-800">Your Achievements</h3>
            
            {isLoadingAchievements ? (
              <div className="text-center py-8">Loading achievements...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {achievements?.map(achievement => {
                  const isUnlocked = userAchievements?.some(
                    ua => ua.achievementId === achievement.id
                  ) || false;
                  
                  return (
                    <AchievementBadge 
                      key={achievement.id} 
                      achievement={achievement} 
                      unlocked={isUnlocked} 
                    />
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Recommended Challenges */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-baloo text-2xl font-bold text-gray-800">Fun Challenges</h3>
              <Link href="/challenges">
                <a className="text-primary font-semibold flex items-center hover:underline">
                  See all <i className="ri-arrow-right-s-line ml-1"></i>
                </a>
              </Link>
            </div>
            
            {isLoadingChallenges ? (
              <div className="text-center py-8">Loading challenges...</div>
            ) : (
              <div className="challenges-grid">
                {challenges?.slice(0, 4).map(challenge => {
                  const progress = challengeProgress?.find(
                    p => p.challengeId === challenge.id
                  );
                  
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      progress={progress}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
