import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Challenges from "@/pages/Challenges";
import Achievements from "@/pages/Achievements";
import LessonPage from "@/pages/LessonPage";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/challenges" component={Challenges} />
      <ProtectedRoute path="/achievements" component={Achievements} />
      <ProtectedRoute path="/lessons/:id" component={LessonPage} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
