import { useRef, useEffect, useState } from "react";
import { Block } from "@/components/BlocksPanel";

interface PreviewPanelProps {
  blocks: Block[];
  isRunning: boolean;
  instructions?: string;
}

export function PreviewPanel({ blocks, isRunning, instructions }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLImageElement>(null);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Reset character position when not running
  useEffect(() => {
    if (!isRunning && characterRef.current) {
      characterRef.current.style.transition = "none";
      characterRef.current.style.transform = "translate(-50%, 0)";
      setSpeechBubble(null);
    }
  }, [isRunning]);

  // Run the code when isRunning changes to true
  useEffect(() => {
    if (isRunning && characterRef.current) {
      // Reset position first
      characterRef.current.style.transition = "none";
      characterRef.current.style.transform = "translate(-50%, 0)";
      setSpeechBubble(null);
      
      // Force a reflow
      void characterRef.current.offsetWidth;
      
      // Enable transitions for animations
      characterRef.current.style.transition = "transform 1s ease";
      
      // Process each block in sequence
      let delay = 0;
      blocks.forEach((block) => {
        setTimeout(() => {
          if (!characterRef.current) return;
          
          const currentTransform = characterRef.current.style.transform;
          const [, translateX, translateY] = currentTransform.match(/translate\((-?\d+%)?,\s*(-?\d+px)?\)/) || ["", "-50%", "0px"];
          
          // Get numeric values from the transform
          let x = parseFloat(translateX) || -50;
          let y = parseFloat(translateY) || 0;
          
          switch (block.type) {
            case "move_forward":
              y -= 50; // Move up by 50px
              characterRef.current.style.transform = `translate(${x}%, ${y}px)`;
              break;
            case "turn_right":
              x += 50; // Move right by increasing percentage
              characterRef.current.style.transform = `translate(${x}%, ${y}px)`;
              break;
            case "turn_left":
              x -= 50; // Move left by decreasing percentage
              characterRef.current.style.transform = `translate(${x}%, ${y}px)`;
              break;
            case "say_hello":
              setSpeechBubble("Hello!");
              break;
          }
        }, delay);
        
        delay += 1000; // Add 1 second delay between each action
      });
    }
  }, [isRunning, blocks]);

  return (
    <div className="w-full h-full">
      <div 
        className="bg-gradient-to-b from-primary/5 to-white rounded-lg p-4 min-h-[350px] relative border border-border drop-shadow-sm" 
        ref={canvasRef}
      >
        <div className="grid grid-cols-6 gap-2 opacity-20 absolute inset-0 pointer-events-none">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="border-b border-r border-primary/10"></div>
          ))}
        </div>
        
        <div className="absolute bottom-10 left-1/2" ref={characterRef} style={{ transform: "translate(-50%, 0)" }}>
          <img 
            src="https://img.icons8.com/color/96/000000/turtle.png" 
            alt="Turtle character" 
            className="w-16 h-16 drop-shadow-md transition-transform duration-300"
          />
          {speechBubble && (
            <div className="bg-white rounded-md px-3 py-1.5 shadow-md mt-2 text-center border border-gray-100 transition-all duration-300 animate-fade-in">
              <span className="text-sm font-medium">{speechBubble}</span>
            </div>
          )}
        </div>
        
        {isRunning && (
          <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium animate-pulse">
            Running...
          </div>
        )}
      </div>
      
      {instructions && (
        <div className="mt-4">
          <div className="bg-secondary/10 p-3 rounded-md border border-secondary/20">
            <div className="flex items-start">
              <i className="ri-lightbulb-line text-secondary mr-2 mt-0.5"></i>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {instructions}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
