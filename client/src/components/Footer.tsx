import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-4 md:mb-0 col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="text-3xl text-primary font-bold font-baloo mr-2">
                <i className="ri-code-box-fill"></i>
              </div>
              <h2 className="text-xl font-bold font-baloo">
                <span className="text-primary">Code</span>
                <span className="text-secondary">Kids</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mt-3 max-w-md leading-relaxed">
              Our mission is to make coding fun and accessible for kids aged 6-12, helping them
              develop computational thinking and creativity through interactive learning.
            </p>
            <div className="flex mt-4 space-x-3">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors duration-200"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors duration-200"
              >
                <i className="ri-twitter-fill"></i>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors duration-200"
              >
                <i className="ri-instagram-fill"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Challenges
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/parents" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  For Parents
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  For Teachers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CodeKids. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link 
              href="/help"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              title="Help"
            >
              <i className="ri-question-line text-lg"></i>
            </Link>
            <Link 
              href="/settings"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              title="Settings"
            >
              <i className="ri-settings-line text-lg"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
