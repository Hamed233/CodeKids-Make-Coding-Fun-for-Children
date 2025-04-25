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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-3xl text-primary font-bold font-baloo mr-2">
                <i className="ri-code-box-line"></i>
              </div>
              <h1 className="text-2xl font-bold font-baloo text-primary">CodeKids</h1>
            </div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <div 
                className={`font-semibold text-lg transition-colors duration-200 cursor-pointer ${
                  location === link.path 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
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
              <div className="hidden md:block mr-4">
                <div className="font-semibold text-gray-700 font-nunito">
                  {user.displayName || user.username}
                </div>
                <div className="flex">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`ri-star-${i < userStars ? 'fill' : 'line'} text-sm`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-xs ml-1 text-gray-500">Level {userLevel}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                      {userInitial}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.displayName || user.username}
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
                  <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
