import { Block } from "@/components/BlocksPanel";

// This file contains utility functions to work with the block-based programming environment
// In a real implementation, this would integrate with Google's Blockly library

export type BlocklyWorkspace = {
  blocks: Block[];
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  clear: () => void;
  serializeBlocks: () => string;
  deserializeBlocks: (data: string) => void;
};

export function createBlocklyWorkspace(): BlocklyWorkspace {
  let blocks: Block[] = [];

  return {
    blocks,
    
    addBlock: (block: Block) => {
      blocks.push(block);
    },
    
    removeBlock: (blockId: string) => {
      blocks = blocks.filter(block => block.id !== blockId);
    },
    
    clear: () => {
      blocks = [];
    },
    
    serializeBlocks: () => {
      return JSON.stringify(blocks);
    },
    
    deserializeBlocks: (data: string) => {
      try {
        blocks = JSON.parse(data);
      } catch (error) {
        console.error("Failed to deserialize blocks:", error);
      }
    }
  };
}

// Interpreter for executing block code
export function interpretBlockCode(blocks: Block[]): string[] {
  // This is a simple interpreter that returns a sequence of commands
  // In a real implementation, this would be more complex and interactive
  
  const commands: string[] = [];
  
  blocks.forEach(block => {
    switch (block.type) {
      case "move_forward":
        commands.push("MOVE_FORWARD");
        break;
      case "turn_right":
        commands.push("TURN_RIGHT");
        break;
      case "turn_left":
        commands.push("TURN_LEFT");
        break;
      case "say_hello":
        commands.push("SAY_HELLO");
        break;
      case "repeat":
        // In a real implementation, this would handle nested blocks
        commands.push("REPEAT_START");
        commands.push("REPEAT_END");
        break;
    }
  });
  
  return commands;
}

// Function to check if a solution is correct
export function checkSolution(blocks: Block[], expectedSolution: string[]): boolean {
  const userSolution = interpretBlockCode(blocks);
  
  if (userSolution.length !== expectedSolution.length) {
    return false;
  }
  
  for (let i = 0; i < userSolution.length; i++) {
    if (userSolution[i] !== expectedSolution[i]) {
      return false;
    }
  }
  
  return true;
}
