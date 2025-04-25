import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, LessonProgress, UserChallengeProgress, UserAchievement } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useUserProgress() {
  const { toast } = useToast();

  // Get current user
  const { data: user } = useQuery<User | null>({
    queryKey: ['/api/me'],
  });

  // Get user's lesson progress
  const { data: lessonProgress } = useQuery<LessonProgress[]>({
    queryKey: ['/api/me/lessons'],
    enabled: !!user,
  });

  // Get user's challenge progress
  const { data: challengeProgress } = useQuery<UserChallengeProgress[]>({
    queryKey: ['/api/me/challenges'],
    enabled: !!user,
  });

  // Get user's achievements
  const { data: achievements } = useQuery<UserAchievement[]>({
    queryKey: ['/api/me/achievements'],
    enabled: !!user,
  });

  // Update lesson progress
  const updateLessonProgressMutation = useMutation({
    mutationFn: async ({ 
      lessonId, 
      currentStep, 
      completed = false 
    }: {
      lessonId: number,
      currentStep: number,
      completed?: boolean
    }) => {
      return apiRequest('PATCH', `/api/me/lessons/${lessonId}`, { currentStep, completed });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/me/lessons/${variables.lessonId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/lessons'] });
      
      toast({
        title: variables.completed ? "Lesson Completed!" : "Progress Saved",
        description: variables.completed 
          ? "Congratulations on completing this lesson!" 
          : `Moved to step ${variables.currentStep}`,
        variant: variables.completed ? "success" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Progress",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Update challenge progress
  const updateChallengeProgressMutation = useMutation({
    mutationFn: async ({ 
      challengeId, 
      completed = false,
      starsEarned = 0 
    }: {
      challengeId: number,
      completed?: boolean,
      starsEarned?: number
    }) => {
      return apiRequest('PATCH', `/api/me/challenges/${challengeId}`, { completed, starsEarned });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/me/challenges/${variables.challengeId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/challenges'] });
      
      const message = variables.completed 
        ? `Challenge completed with ${variables.starsEarned} stars!` 
        : "Challenge progress saved";
      
      toast({
        title: variables.completed ? "Challenge Completed!" : "Progress Saved",
        description: message,
        variant: variables.completed ? "success" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Progress",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    lessonProgress,
    challengeProgress,
    achievements,
    updateLessonProgress: updateLessonProgressMutation.mutate,
    updateChallengeProgress: updateChallengeProgressMutation.mutate,
    isUpdatingLesson: updateLessonProgressMutation.isPending,
    isUpdatingChallenge: updateChallengeProgressMutation.isPending,
  };
}
