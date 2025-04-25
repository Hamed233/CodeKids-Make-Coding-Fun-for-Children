import { useState, useEffect } from "react";
import { Block } from "@/components/BlocksPanel";
import { createBlocklyWorkspace, BlocklyWorkspace, interpretBlockCode } from "@/lib/blockly";

interface UseBlocklyOptions {
  initialBlocks?: Block[];
  onExecute?: (commands: string[]) => void;
}

export function useBlockly(options: UseBlocklyOptions = {}) {
  const [workspace, setWorkspace] = useState<BlocklyWorkspace | null>(null);
  const [blocks, setBlocks] = useState<Block[]>(options.initialBlocks || []);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize workspace
  useEffect(() => {
    const newWorkspace = createBlocklyWorkspace();
    
    // Add initial blocks if provided
    if (options.initialBlocks && options.initialBlocks.length > 0) {
      options.initialBlocks.forEach(block => newWorkspace.addBlock(block));
    }
    
    setWorkspace(newWorkspace);
    
    // Cleanup function
    return () => {
      // Any cleanup needed for the workspace
    };
  }, []);

  // Update blocks when workspace changes
  useEffect(() => {
    if (workspace) {
      setBlocks([...workspace.blocks]);
    }
  }, [workspace]);

  // Add a block to the workspace
  const addBlock = (block: Block) => {
    if (workspace) {
      workspace.addBlock(block);
      setBlocks([...workspace.blocks]);
    }
  };

  // Remove a block from the workspace
  const removeBlock = (blockId: string) => {
    if (workspace) {
      workspace.removeBlock(blockId);
      setBlocks([...workspace.blocks]);
    }
  };

  // Clear all blocks from the workspace
  const clearWorkspace = () => {
    if (workspace) {
      workspace.clear();
      setBlocks([]);
    }
  };

  // Run the code in the workspace
  const runCode = () => {
    if (workspace && !isRunning) {
      setIsRunning(true);
      
      const commands = interpretBlockCode(workspace.blocks);
      
      if (options.onExecute) {
        options.onExecute(commands);
      }
      
      // Reset running state after execution
      setTimeout(() => {
        setIsRunning(false);
      }, commands.length * 1000 + 500); // Basic timing based on number of commands
    }
  };

  // Save workspace state to JSON
  const saveWorkspace = (): string => {
    if (workspace) {
      return workspace.serializeBlocks();
    }
    return "{}";
  };

  // Load workspace state from JSON
  const loadWorkspace = (data: string) => {
    if (workspace) {
      workspace.deserializeBlocks(data);
      setBlocks([...workspace.blocks]);
    }
  };

  return {
    blocks,
    isRunning,
    addBlock,
    removeBlock,
    clearWorkspace,
    runCode,
    saveWorkspace,
    loadWorkspace
  };
}
