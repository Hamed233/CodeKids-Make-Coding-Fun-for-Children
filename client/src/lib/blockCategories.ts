import { Block } from "@/components/BlocksPanel";

// Helper function to generate a unique ID
const generateId = () => `block_${Math.random().toString(36).substr(2, 9)}`;

// Define the available blocks organized by category
export function getBlocksByCategory(): { [key: string]: Block[] } {
  return {
    motion: [
      {
        id: generateId(),
        type: "move_forward",
        category: "motion",
        text: "Move forward 10 steps",
        icon: "ri-arrow-right-line"
      },
      {
        id: generateId(),
        type: "turn_right",
        category: "motion",
        text: "Turn right 90 degrees",
        icon: "ri-turn-right-line"
      },
      {
        id: generateId(),
        type: "turn_left",
        category: "motion",
        text: "Turn left 90 degrees",
        icon: "ri-turn-left-line"
      }
    ],
    looks: [
      {
        id: generateId(),
        type: "say_hello",
        category: "looks",
        text: "Say \"Hello!\"",
        icon: "ri-chat-1-line"
      },
      {
        id: generateId(),
        type: "change_color",
        category: "looks",
        text: "Change color",
        icon: "ri-palette-line"
      },
      {
        id: generateId(),
        type: "hide",
        category: "looks",
        text: "Hide",
        icon: "ri-eye-off-line"
      },
      {
        id: generateId(),
        type: "show",
        category: "looks",
        text: "Show",
        icon: "ri-eye-line"
      }
    ],
    control: [
      {
        id: generateId(),
        type: "repeat",
        category: "control",
        text: "Repeat 10 times",
        icon: "ri-repeat-line"
      },
      {
        id: generateId(),
        type: "wait",
        category: "control",
        text: "Wait 1 second",
        icon: "ri-time-line"
      },
      {
        id: generateId(),
        type: "if",
        category: "control",
        text: "If... then",
        icon: "ri-git-branch-line"
      }
    ],
    events: [
      {
        id: generateId(),
        type: "when_clicked",
        category: "events",
        text: "When ▶️ clicked",
        icon: "ri-flag-line"
      },
      {
        id: generateId(),
        type: "when_key_pressed",
        category: "events",
        text: "When space key pressed",
        icon: "ri-keyboard-line"
      }
    ],
    operators: [
      {
        id: generateId(),
        type: "equals",
        category: "operators",
        text: "= (equals)",
        icon: "ri-equal-line"
      },
      {
        id: generateId(),
        type: "greater_than",
        category: "operators",
        text: "> (greater than)",
        icon: "ri-arrow-right-line"
      },
      {
        id: generateId(),
        type: "less_than",
        category: "operators",
        text: "< (less than)",
        icon: "ri-arrow-left-line"
      }
    ]
  };
}

// Get all available blocks as a flat array
export function getAllBlocks(): Block[] {
  const categories = getBlocksByCategory();
  return Object.values(categories).flat();
}

// Get blocks by their type
export function getBlockByType(type: string): Block | undefined {
  return getAllBlocks().find(block => block.type === type);
}

// Default blocks to include in a new project
export function getDefaultBlocks(): Block[] {
  const categories = getBlocksByCategory();
  
  return [
    categories.events[0], // "When clicked" block
  ];
}
