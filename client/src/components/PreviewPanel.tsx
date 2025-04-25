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
    <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md p-4 preview-panel">
      <h3 className="font-baloo text-xl font-bold mb-4 text-gray-800">Preview</h3>
      
      <div className="bg-primary/5 rounded-xl p-4 min-h-[400px] relative" ref={canvasRef}>
        <div className="absolute bottom-10 left-1/2" ref={characterRef} style={{ transform: "translate(-50%, 0)" }}>
          <img 
            src="https://img.icons8.com/color/96/000000/turtle.png" 
            alt="Turtle character" 
            className="w-16 h-16"
          />
          {speechBubble && (
            <div className="bg-white rounded-lg px-2 py-1 shadow-md mt-2 text-center">
              <span className="text-sm">{speechBubble}</span>
            </div>
          )}
        </div>
      </div>
      
      {instructions && (
        <div className="mt-4">
          <h4 className="font-baloo font-semibold text-gray-700 mb-2">Instructions</h4>
          <div className="bg-yellow/10 p-4 rounded-xl">
            <p className="text-gray-700 font-nunito">
              <i className="ri-lightbulb-line text-yellow mr-2"></i>
              {instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
