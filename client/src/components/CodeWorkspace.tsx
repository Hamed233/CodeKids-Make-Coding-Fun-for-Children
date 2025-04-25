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
    <div className="w-full lg:w-2/5 bg-white rounded-2xl shadow-md p-4 code-workspace">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-baloo text-xl font-bold text-gray-800">My Code</h3>
        <div className="flex space-x-2">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200"
            onClick={handleClearWorkspace}
            disabled={isWorkspaceEmpty}
          >
            <i className="ri-delete-bin-line mr-1"></i>Clear
          </button>
          <button 
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200"
            onClick={handleRunCode}
            disabled={isWorkspaceEmpty}
          >
            <i className="ri-play-fill mr-1"></i>Run
          </button>
        </div>
      </div>
      
      <div 
        ref={workspaceRef}
        className="bg-gray-100 rounded-xl p-4 min-h-[400px] flex flex-col transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isWorkspaceEmpty ? (
          <div className="text-center text-gray-500 font-nunito mb-4">
            <p>Drag blocks here to build your code</p>
            <div className="text-4xl mt-2">
              <i className="ri-arrow-down-line animate-bounce-slow"></i>
            </div>
          </div>
        ) : null}
        
        <div className="flex-grow">
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div 
                key={block.id} 
                className={`block block-${block.category} text-white p-3 rounded-xl ${index > 0 ? "ml-4" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${block.icon} mr-2`}></i>
                    <span>{block.text}</span>
                  </div>
                  <button 
                    className="text-white/80 hover:text-white"
                    onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
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
