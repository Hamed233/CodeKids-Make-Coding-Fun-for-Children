import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, Code, Trophy, Award, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Help() {
  const faqItems = [
    {
      question: "What is CodeKids?",
      answer: "CodeKids is an educational platform designed to help children learn coding concepts through interactive block-based programming. It offers lessons, challenges, and achievements to make learning fun and engaging."
    },
    {
      question: "How do I get started?",
      answer: "Start by creating an account and logging in. Then, check out the lessons section where you'll find step-by-step tutorials that introduce you to programming concepts. After completing a few lessons, try out some challenges to test your skills!"
    },
    {
      question: "How does block-based coding work?",
      answer: "Block-based coding uses visual blocks that you can drag and drop to create programs without typing code. Each block represents a specific command or action. You can connect these blocks to build your program and then run it to see the results."
    },
    {
      question: "What age group is CodeKids suitable for?",
      answer: "CodeKids is designed for children aged 6-12, but it can be enjoyed by learners of all ages who are new to programming. The platform uses simple language and visual elements to make coding accessible to everyone."
    },
    {
      question: "Can I save my progress?",
      answer: "Yes! When you're logged in, your progress is automatically saved. You can see your completed lessons, challenges, and earned achievements in your profile."
    },
    {
      question: "What do I do if I get stuck?",
      answer: "If you get stuck on a lesson or challenge, try looking at the instructions again. You can also reset the workspace to start over. If you still need help, check out the tutorials section or contact our support team."
    }
  ];
  
  const sections = [
    {
      title: "Lessons",
      icon: BookOpen,
      description: "Step-by-step tutorials to learn coding concepts",
      link: "/"
    },
    {
      title: "Challenges",
      icon: Trophy,
      description: "Test your skills with fun programming puzzles",
      link: "/challenges"
    },
    {
      title: "Achievements",
      icon: Award,
      description: "Earn badges as you master different skills",
      link: "/achievements"
    },
    {
      title: "Coding Workspace",
      icon: Code,
      description: "Learn about the block-based programming interface",
      link: "/lessons/1"
    }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to the CodeKids help center! Here you'll find answers to common questions and guides to help you make the most of your learning journey.
        </p>
      </div>
      
      {/* Quick Links Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section, index) => (
            <Link key={index} href={section.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <section.icon className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{section.description}</CardDescription>
                  <div className="flex items-center text-primary text-sm mt-2">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7">{item.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      {/* Contact Support */}
      <div className="bg-accent/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          If you couldn't find an answer to your question, our support team is here to help.
          Feel free to reach out and we'll get back to you as soon as possible.
        </p>
        <Button size="lg">
          Contact Support
        </Button>
      </div>
    </div>
  );
}