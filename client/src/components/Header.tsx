import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function Header() {
  const [location] = useLocation();
  const { data: user } = useQuery<User | null>({ 
    queryKey: ["/api/me"],
    staleTime: 60 * 1000, // 1 minute
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Challenges", path: "/challenges" },
    { name: "Achievements", path: "/achievements" },
    { name: "Help", path: "/help" }
  ];

  // Show the first letter of the display name or a default
  const userInitial = user?.displayName.charAt(0) || "?";
  
  // Calculate user stars based on level (temporary until we have a better system)
  const userLevel = user?.level || 1;
  const userStars = Math.min(userLevel, 5);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <div className="text-3xl text-primary font-bold font-baloo mr-2">
                <i className="ri-code-box-line"></i>
              </div>
              <h1 className="text-2xl font-bold font-baloo text-primary">CodeKids</h1>
            </a>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a 
                className={`font-semibold text-lg transition-colors duration-200 ${
                  location === link.path 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {link.name}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Profile Section */}
        <div className="flex items-center">
          <div className="hidden md:block mr-4">
            <div className="font-semibold text-gray-700 font-nunito">
              {user?.displayName || "Guest"}
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
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
}
