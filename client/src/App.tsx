import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Challenges from "@/pages/Challenges";
import Achievements from "@/pages/Achievements";
import LessonPage from "@/pages/LessonPage";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/lessons/:id" component={LessonPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;
