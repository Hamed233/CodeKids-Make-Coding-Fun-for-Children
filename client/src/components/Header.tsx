import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Challenges", path: "/challenges" },
    { name: "Achievements", path: "/achievements" },
    { name: "Help", path: "/help" }
  ];

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show the first letter of the display name or a default
  const userInitial = user?.displayName?.charAt(0) || "?";
  
  // Calculate user stars based on level (temporary until we have a better system)
  const userLevel = user?.level || 1;
  const userStars = Math.min(userLevel, 5);

  return (
    <header className="bg-white border-b border-border z-10 sticky top-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer group">
              <div className="text-3xl text-primary font-bold font-baloo mr-2 group-hover:text-primary/80 transition-colors duration-200">
                <i className="ri-code-box-fill"></i>
              </div>
              <h1 className="text-2xl font-bold font-baloo text-primary group-hover:text-primary/90 transition-colors duration-200">
                <span>Code</span>
                <span className="text-secondary">Kids</span>
              </h1>
            </div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={`font-medium px-3 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                  location === link.path 
                    ? "text-primary bg-primary/5 shadow-sm" 
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Profile Section */}
        <div className="flex items-center">
          {user ? (
            <>
              <div className="hidden md:flex items-center bg-muted/40 rounded-full px-3 py-1 mr-2">
                <div className="flex items-center text-yellow-500 mr-1.5">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`ri-star-${i < userStars ? 'fill' : 'line'} text-sm`}
                    ></i>
                  ))}
                </div>
                <span className="text-xs text-foreground/70 font-medium">Level {userLevel}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full relative group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold ring-2 ring-background shadow-sm group-hover:shadow-md transition-all duration-200">
                      {userInitial}
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm font-medium flex flex-col">
                    <span className="text-foreground font-semibold">{user.displayName || user.username}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Student</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/auth")}
                className="font-medium"
              >
                Sign up
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => navigate("/auth")}
                className="font-medium bg-primary"
              >
                Log in
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
