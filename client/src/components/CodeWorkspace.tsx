import { useRef, useState, useEffect } from "react";
import { Block } from "@/components/BlocksPanel";
import { useToast } from "@/hooks/use-toast";

interface CodeWorkspaceProps {
  onRun: (blocks: Block[]) => void;
  initialBlocks?: Block[];
}

export function CodeWorkspace({ onRun, initialBlocks = [] }: CodeWorkspaceProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (workspaceRef.current) {
      workspaceRef.current.classList.add("bg-gray-200");
    }
  };

  const handleDragLeave = () => {
    if (workspaceRef.current) {
      workspaceRef.current.classList.remove("bg-gray-200");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (workspaceRef.current) {
      workspaceRef.current.classList.remove("bg-gray-200");
    }
    
    try {
      const blockData = JSON.parse(e.dataTransfer.getData("application/json")) as Block;
      
      // Create a new block with a unique ID
      const newBlock = {
        ...blockData,
        id: `${blockData.id}-${Date.now()}`
      };
      
      setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      
      toast({
        title: "Block added",
        description: `Added ${blockData.text} block`,
        duration: 1500,
      });
    } catch (error) {
      console.error("Failed to parse dropped block:", error);
    }
  };

  const handleRunCode = () => {
    onRun(blocks);
    
    toast({
      title: "Running code",
      description: "Your code is now running!",
      duration: 2000,
    });
  };

  const handleClearWorkspace = () => {
    setBlocks([]);
    
    toast({
      title: "Workspace cleared",
      description: "All blocks have been removed",
      duration: 2000,
    });
  };

  const isWorkspaceEmpty = blocks.length === 0;

  return (
    <div className="w-full h-full">
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button 
          className="bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-1.5 px-3 rounded-md text-sm transition-all duration-200 flex items-center"
          onClick={handleClearWorkspace}
          disabled={isWorkspaceEmpty}
        >
          <i className="ri-delete-bin-line mr-1.5"></i>Clear
        </button>
        <button 
          className="bg-primary hover:bg-primary/90 text-white font-medium py-1.5 px-3 rounded-md text-sm transition-all duration-200 flex items-center"
          onClick={handleRunCode}
          disabled={isWorkspaceEmpty}
        >
          <i className="ri-play-fill mr-1.5"></i>Run
        </button>
      </div>
      
      <div 
        ref={workspaceRef}
        className="bg-muted/30 border border-border rounded-lg p-4 min-h-[350px] flex flex-col transition-all duration-200 drop-shadow-sm hover:drop-shadow"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isWorkspaceEmpty ? (
          <div className="text-center text-muted-foreground font-nunito my-8 flex flex-col items-center justify-center h-40">
            <p className="mb-2">Drag blocks here to build your code</p>
            <div className="text-4xl text-primary/60 my-2">
              <i className="ri-arrow-down-line animate-bounce-slow"></i>
            </div>
            <p className="text-sm">Start by dragging blocks from the library</p>
          </div>
        ) : null}
        
        <div className="flex-grow">
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div 
                key={block.id} 
                className={`block block-${block.category} text-white p-3 rounded-md ${index > 0 ? "ml-6" : ""} drop-shadow-sm transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${block.icon} mr-2 text-white/90`}></i>
                    <span className="font-medium">{block.text}</span>
                  </div>
                  <button 
                    className="text-white/70 hover:text-white transition-colors"
                    onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                    aria-label="Remove block"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
