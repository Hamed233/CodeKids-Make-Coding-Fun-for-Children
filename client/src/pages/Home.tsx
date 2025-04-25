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
      {/* Hero banner with tabs */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-3xl md:text-4xl font-bold font-baloo text-foreground mb-2">
            Welcome to <span className="text-primary">Code</span><span className="text-secondary">Kids</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-6">
            Learn coding through fun challenges and interactive lessons designed for young minds.
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm inline-flex space-x-1">
            {["learn", "puzzles", "projects", "games"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-5 rounded-lg transition-all duration-200 font-medium ${
                  activeTab === tab 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-foreground/70 hover:text-primary hover:bg-white/70"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Lesson Section */}
      {currentLesson && (
        <div className="bg-white border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-6 border border-border shadow-sm">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <span className="bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                        {currentLesson.difficulty}
                      </span>
                      <span className="text-muted-foreground text-sm flex items-center">
                        <i className="ri-time-line mr-1.5"></i> {currentLesson.duration} min
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-1.5">{currentLesson.title}</h2>
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                    
                    <div className="mt-4 flex items-center w-full">
                      <div className="w-full bg-muted rounded-full h-2.5 mr-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary rounded-full h-2.5 transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground min-w-[55px]">
                        {currentLessonProgress?.currentStep || 1}/{currentLesson.totalSteps}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link 
                      href={`/lessons/${currentLesson.id}`}
                      className="bg-gradient-to-r from-secondary to-secondary/90 text-white font-medium py-3 px-5 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center whitespace-nowrap"
                    >
                      <span>Continue Learning</span>
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Recommended Challenges Section - Moved up */}
          <div className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-foreground">Recommended Challenges</h3>
              <Link href="/challenges">
                <a className="text-primary font-medium flex items-center hover:underline text-sm">
                  View All Challenges <i className="ri-arrow-right-s-line ml-1"></i>
                </a>
              </Link>
            </div>
            
            {isLoadingChallenges ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-muted/50 rounded-full mb-2"></div>
                  <div className="h-5 bg-muted/50 rounded-full w-32 mb-1"></div>
                  <div className="h-4 bg-muted/50 rounded-full w-40"></div>
                </div>
              </div>
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
          
          {/* Achievement Section */}
          <div className="mt-14">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-2xl text-foreground">Your Achievements</h3>
              <Link href="/achievements">
                <a className="text-primary font-medium flex items-center hover:underline text-sm">
                  View All <i className="ri-arrow-right-s-line ml-1"></i>
                </a>
              </Link>
            </div>
            
            {isLoadingAchievements ? (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 bg-muted/50 rounded-full mb-2"></div>
                  <div className="h-5 bg-muted/50 rounded-full w-32"></div>
                </div>
              </div>
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
          
          {/* Info cards section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 hover:shadow-md transition-all duration-300">
              <div className="text-primary text-2xl mb-4">
                <i className="ri-cpu-line"></i>
              </div>
              <h4 className="text-lg font-bold mb-2">Logical Thinking</h4>
              <p className="text-muted-foreground text-sm">Develop problem-solving skills and computational thinking through fun activities and challenges.</p>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-5 hover:shadow-md transition-all duration-300">
              <div className="text-secondary text-2xl mb-4">
                <i className="ri-game-line"></i>
              </div>
              <h4 className="text-lg font-bold mb-2">Play & Learn</h4>
              <p className="text-muted-foreground text-sm">Our game-based approach makes learning to code fun and engaging for kids of all ages.</p>
            </div>
            
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-5 hover:shadow-md transition-all duration-300">
              <div className="text-accent text-2xl mb-4">
                <i className="ri-rocket-line"></i>
              </div>
              <h4 className="text-lg font-bold mb-2">Build Projects</h4>
              <p className="text-muted-foreground text-sm">Create your own games, animations, and interactive stories as you progress through lessons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
