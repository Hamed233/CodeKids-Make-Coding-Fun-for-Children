import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Lesson, LessonProgress } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BlocksPanel, Block } from "@/components/BlocksPanel";
import { CodeWorkspace } from "@/components/CodeWorkspace";
import { PreviewPanel } from "@/components/PreviewPanel";
import { useToast } from "@/hooks/use-toast";

export default function LessonPage() {
  const [match, params] = useRoute("/lessons/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([]);
  
  // Fetch lesson data
  const { data: lesson, isLoading: isLoadingLesson } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${params?.id}`],
    enabled: !!params?.id,
  });
  
  // Fetch lesson progress
  const { data: lessonProgress, isLoading: isLoadingProgress } = useQuery<LessonProgress>({
    queryKey: [`/api/me/lessons/${params?.id}`],
    enabled: !!params?.id,
  });

  // Update lesson progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { currentStep: number; completed?: boolean }) => {
      return apiRequest('PATCH', `/api/me/lessons/${params?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/me/lessons/${params?.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/lessons'] });
    },
  });

  // Handle "Run" button click
  const handleRunCode = (blocks: Block[]) => {
    setCurrentBlocks(blocks);
    setIsRunning(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsRunning(false);
      
      // Check if this advances the lesson
      if (lessonProgress && lesson) {
        const nextStep = lessonProgress.currentStep + 1;
        const isCompleted = nextStep > lesson.totalSteps;
        
        updateProgressMutation.mutate({
          currentStep: isCompleted ? lesson.totalSteps : nextStep,
          completed: isCompleted
        });
        
        if (isCompleted) {
          toast({
            title: "Lesson Completed!",
            description: `You've completed "${lesson.title}"!`,
            variant: "success",
          });
          
          // Navigate back to home after a delay
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast({
            title: "Step Completed!",
            description: `Step ${lessonProgress.currentStep} completed. Moving to step ${nextStep}.`,
            variant: "default",
          });
        }
      }
    }, blocks.length * 1000 + 1000); // Allow time for animations to complete
  };
  
  // Handle block drag start
  const handleBlockDragStart = (block: Block) => {
    // This could be used for custom drag behavior if needed
  };

  if (isLoadingLesson || isLoadingProgress) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-2xl text-gray-400">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Lesson Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the lesson you're looking for.</p>
        <button 
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-xl shadow-kid hover:shadow-kid-hover transition-all duration-200"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-baloo text-gray-800">{lesson.title}</h2>
              <p className="text-gray-600 font-nunito">{lesson.description}</p>
              <div className="mt-2 flex items-center">
                <div className="bg-secondary/20 text-secondary rounded-full px-3 py-1 text-sm font-semibold">
                  {lesson.difficulty}
                </div>
                <div className="ml-4 flex items-center text-gray-500 text-sm">
                  <i className="ri-time-line mr-1"></i> {lesson.duration} minutes
                </div>
              </div>
            </div>
            
            {lessonProgress && (
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-accent rounded-full h-3" 
                      style={{ 
                        width: `${(lessonProgress.currentStep / lesson.totalSteps) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {lessonProgress.currentStep}/{lesson.totalSteps}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-grow py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row workspace-container gap-4">
            <BlocksPanel onDragStart={handleBlockDragStart} />
            <CodeWorkspace onRun={handleRunCode} />
            <PreviewPanel 
              blocks={currentBlocks} 
              isRunning={isRunning} 
              instructions="Make the turtle move in a square pattern. Try using the 'repeat' block and the motion blocks."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
