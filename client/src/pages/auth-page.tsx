import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Define form schemas with validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Use useEffect for navigation to avoid React errors
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  // Handle register submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth Forms */}
      <div className="w-full lg:w-1/2 py-12 px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-3xl text-primary font-bold font-baloo mr-2">
                <i className="ri-code-box-fill"></i>
              </div>
              <h1 className="text-2xl font-bold font-baloo">
                <span className="text-primary">Code</span>
                <span className="text-secondary">Kids</span>
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome!</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {activeTab === "login" 
                ? "Log in to continue your coding journey and track your progress" 
                : "Join our community of young coders and start creating amazing projects"}
            </p>
          </div>

          <div className="bg-muted/20 p-0.5 rounded-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                <TabsTrigger 
                  value="login" 
                  className={`rounded-md py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm ${activeTab === 'login' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className={`rounded-md py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm ${activeTab === 'register' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-6 space-y-1">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-foreground/80">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="yourusername" 
                              className="border-muted bg-background/50 focus-visible:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm text-foreground/80">Password</FormLabel>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                          </div>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="border-muted bg-background/50 focus-visible:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full mt-6 bg-primary hover:bg-primary/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-6 space-y-1">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-foreground/80">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="coolcoder123" 
                              className="border-muted bg-background/50 focus-visible:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-foreground/80">Display Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Alex" 
                              className="border-muted bg-background/50 focus-visible:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-foreground/80">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="border-muted bg-background/50 focus-visible:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">By registering, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                      ) : (
                        "Create Free Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need assistance? <a href="/help" className="text-primary hover:underline font-medium">Contact Support</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image/Info */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-accent p-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm inline-flex items-center">
            <i className="ri-shield-check-line mr-2 text-secondary"></i>
            <span>Safe for kids aged 6-12</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            Unlock the world of <span className="text-secondary">coding</span><br />
            through play and creativity
          </h2>
          
          <div className="space-y-6 mb-12">
            <div className="flex items-start bg-white/10 p-4 rounded-lg">
              <div className="bg-secondary/20 p-2 rounded-full mr-4 text-secondary text-lg">
                <i className="ri-gamepad-line"></i>
              </div>
              <div>
                <h3 className="font-bold mb-1">Learn While Playing</h3>
                <p className="text-white/80 text-sm">Build your own games and animations with colorful drag-and-drop blocks</p>
              </div>
            </div>
            
            <div className="flex items-start bg-white/10 p-4 rounded-lg">
              <div className="bg-secondary/20 p-2 rounded-full mr-4 text-secondary text-lg">
                <i className="ri-trophy-line"></i>
              </div>
              <div>
                <h3 className="font-bold mb-1">Track Your Progress</h3>
                <p className="text-white/80 text-sm">Earn achievements, collect badges, and level up as you master new skills</p>
              </div>
            </div>
            
            <div className="flex items-start bg-white/10 p-4 rounded-lg">
              <div className="bg-secondary/20 p-2 rounded-full mr-4 text-secondary text-lg">
                <i className="ri-rocket-line"></i>
              </div>
              <div>
                <h3 className="font-bold mb-1">No Typing Required</h3>
                <p className="text-white/80 text-sm">Perfect for beginners - just drag, drop, and learn programming fundamentals</p>
              </div>
            </div>
          </div>

          <div className="mt-auto p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className="ri-star-fill text-yellow-400 mr-1"></i>
              ))}
            </div>
            <p className="text-white/90 italic text-sm leading-relaxed">
              "My 8-year-old daughter loves CodeKids! She's already building her own animations and learning coding concepts in a way that's fun and engaging."
            </p>
            <div className="mt-3 flex items-center">
              <div className="w-8 h-8 bg-white/30 rounded-full mr-2 flex items-center justify-center text-lg font-bold">P</div>
              <p className="text-sm font-medium">Parent of a CodeKids user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}