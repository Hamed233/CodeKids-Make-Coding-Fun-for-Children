import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CodeWorkspace } from "@/components/CodeWorkspace";
import { PreviewPanel } from "@/components/PreviewPanel";
import { BlocksPanel } from "@/components/BlocksPanel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import type { Challenge, UserChallengeProgress } from "@shared/schema";
import type { Block } from "@/components/BlocksPanel";

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  
  // Fetch challenge data
  const { data: challenge, isLoading: isLoadingChallenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/challenges/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
  
  // Fetch progress data if user is logged in
  const { data: progress, isLoading: isLoadingProgress } = useQuery<UserChallengeProgress>({
    queryKey: ['/api/me/challenges', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/me/challenges/${id}`);
      return res.json();
    },
    enabled: !!user && !!id,
  });
  
  useEffect(() => {
    if (progress) {
      setHasCompleted(progress.completed);
      setStarsEarned(progress.starsEarned);
    }
  }, [progress]);
  
  // If challenge has initial blocks, parse them
  useEffect(() => {
    if (challenge?.initialBlocks) {
      try {
        const parsedBlocks = JSON.parse(challenge.initialBlocks);
        setBlocks(parsedBlocks);
      } catch (error) {
        console.error("Error parsing initial blocks:", error);
      }
    }
  }, [challenge]);
  
  const handleRun = (executedBlocks: Block[]) => {
    setIsRunning(true);
    setBlocks(executedBlocks);
    
    // Simulate challenge completion after delay
    setTimeout(() => {
      setIsRunning(false);
      
      // Check if completed for the first time
      if (!hasCompleted) {
        setHasCompleted(true);
        setStarsEarned(3); // Award 3 stars for demonstration
        
        // Save progress
        if (user && id) {
          apiRequest('POST', `/api/me/challenges/${id}/complete`, {
            completed: true,
            starsEarned: 3
          });
        }
      }
    }, 2000);
  };
  
  const isLoading = isLoadingChallenge || isLoadingProgress;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!challenge) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Challenge Not Found</h1>
          <p className="mb-6">The challenge you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/challenges")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/challenges")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
      </div>
      
      {/* Challenge Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Challenge Instructions</CardTitle>
          <CardDescription>Difficulty: {challenge.difficulty}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Description:</h3>
            <p>{challenge.description}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Goal:</h3>
            <p>{challenge.goalDescription}</p>
          </div>
          {hasCompleted && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Challenge Completed!
              </h3>
              <div className="flex items-center">
                <p className="mr-2">You earned:</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < starsEarned ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Main workspace area */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left sidebar with blocks */}
        <div className="w-full lg:w-1/4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Blocks Library</CardTitle>
              <CardDescription>Drag blocks to build your solution</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <BlocksPanel onDragStart={(block) => {
                // This is just to handle the drag start event
                console.log("Block dragged:", block);
              }} />
            </CardContent>
          </Card>
        </div>
        
        {/* Center workspace */}
        <div className="w-full lg:w-2/5">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Workspace</CardTitle>
              <CardDescription>
                Arrange your blocks here and click "Run" to test
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <CodeWorkspace 
                onRun={handleRun} 
                initialBlocks={blocks.length ? blocks : undefined} 
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right side preview */}
        <div className="w-full lg:w-1/3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-primary">Preview</CardTitle>
              <CardDescription>
                See your code in action
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <PreviewPanel 
                blocks={blocks} 
                isRunning={isRunning} 
                instructions={challenge.goalDescription} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}