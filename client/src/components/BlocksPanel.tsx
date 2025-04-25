import { useEffect, useState } from "react";
import { getBlocksByCategory } from "@/lib/blockCategories";

export interface Block {
  id: string;
  type: string;
  category: string;
  text: string;
  icon: string;
}

interface BlocksPanelProps {
  onDragStart: (block: Block) => void;
}

export function BlocksPanel({ onDragStart }: BlocksPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    motion: true,
    looks: true,
    control: true,
  });
  
  const [categories, setCategories] = useState<{ [key: string]: Block[] }>({});

  useEffect(() => {
    // Get the blocks by their categories
    const blocksByCategory = getBlocksByCategory();
    setCategories(blocksByCategory);
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDragStart = (e: React.DragEvent, block: Block) => {
    // Set dataTransfer data to identify the block
    e.dataTransfer.setData("application/json", JSON.stringify(block));
    
    // Set the drag image
    const dragImage = document.createElement("div");
    dragImage.className = `block block-${block.category} p-3 rounded-xl`;
    dragImage.innerHTML = `
      <div class="flex items-center">
        <i class="${block.icon} mr-2"></i>
        <span>${block.text}</span>
      </div>
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    
    // Call the parent's onDragStart
    onDragStart(block);
    
    // Clean up drag image after a delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const getCategoryBackground = (category: string) => {
    switch (category) {
      case "motion": return "bg-primary/10";
      case "looks": return "bg-purple/10";
      case "control": return "bg-secondary/10";
      case "events": return "bg-yellow/10";
      case "operators": return "bg-teal/10";
      default: return "bg-gray-100";
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case "motion": return "text-primary";
      case "looks": return "text-purple";
      case "control": return "text-secondary";
      case "events": return "text-yellow-600";
      case "operators": return "text-teal";
      default: return "text-gray-700";
    }
  };

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-md p-4 blocks-panel">
      <h3 className="font-baloo text-xl font-bold mb-4 text-gray-800">Blocks</h3>
      
      <div className="space-y-2">
        {Object.entries(categories).map(([category, blocks]) => (
          <div key={category} className={`${getCategoryBackground(category)} rounded-xl p-3`}>
            <h4 
              className={`font-baloo font-semibold ${getCategoryTextColor(category)} mb-2 cursor-pointer flex items-center justify-between`}
              onClick={() => toggleCategory(category)}
            >
              <span className="capitalize">{category}</span>
              <i className={`ri-arrow-${expandedCategories[category] ? 'down' : 'right'}-s-line`}></i>
            </h4>
            
            {expandedCategories[category] && (
              <div className="space-y-2">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`block block-${block.category} text-white p-3 rounded-xl`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, block)}
                  >
                    <div className="flex items-center">
                      <i className={`${block.icon} mr-2`}></i>
                      <span>{block.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
