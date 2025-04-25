import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, BookOpen, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  // Calculate progress values for demo
  const level = user.level || 1;
  const xp = (level * 100) - 20; // Random XP for demo
  const nextLevelXp = level * 100;
  const progress = (xp / nextLevelXp) * 100;
  
  // Demo stats - would come from backend in real implementation
  const stats = {
    lessonCompleted: 12,
    challengesCompleted: 5,
    achievementsUnlocked: 8,
    totalStars: 24,
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profile Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white font-bold text-4xl mb-2">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{user.displayName || user.username}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              
              <Badge variant="outline" className="mt-2">
                Level {level} Coder
              </Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1 items-center">
                <span className="text-sm">Level Progress</span>
                <span className="text-xs text-muted-foreground">{xp}/{nextLevelXp} XP</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">About me</h3>
              <p className="text-sm text-muted-foreground">
                {user.bio || "You haven't added a bio yet. Edit your profile to add one!"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>See how much you've accomplished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                <BookOpen className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{stats.lessonCompleted}</span>
                <span className="text-sm text-muted-foreground text-center">Lessons Completed</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                <Trophy className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{stats.challengesCompleted}</span>
                <span className="text-sm text-muted-foreground text-center">Challenges Completed</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                <Award className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{stats.achievementsUnlocked}</span>
                <span className="text-sm text-muted-foreground text-center">Achievements Unlocked</span>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg">
                <Star className="h-8 w-8 mb-2 text-primary" />
                <span className="text-2xl font-bold">{stats.totalStars}</span>
                <span className="text-sm text-muted-foreground text-center">Total Stars Earned</span>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Recent Activity</h3>
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed "Loops Challenge"</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Unlocked "Code Master" achievement</p>
                    <p className="text-sm text-muted-foreground">4 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Completed "Variables and Constants" lesson</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}