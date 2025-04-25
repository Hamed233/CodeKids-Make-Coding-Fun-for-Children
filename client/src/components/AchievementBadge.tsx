import { Achievement } from "@shared/schema";

export interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  // Map achievement icon names to Remix icon classes
  const getIconClass = (iconName: string) => {
    const iconMap: Record<string, string> = {
      rocket: "ri-rocket-line",
      code: "ri-code-line",
      loop: "ri-loop-left-line",
      gamepad: "ri-gamepad-line",
      trophy: "ri-trophy-line",
      fire: "ri-fire-line",
      star: "ri-star-line",
      medal: "ri-medal-line",
      puzzle: "ri-puzzle-line",
      brain: "ri-brain-line",
    };

    return iconMap[iconName] || "ri-award-line";
  };

  // Map achievement icons to background color classes
  const getBackgroundClass = (iconName: string) => {
    const bgColorMap: Record<string, string> = {
      rocket: "bg-primary/10",
      code: "bg-purple/10",
      loop: "bg-secondary/10",
      gamepad: "bg-teal/10",
      trophy: "bg-yellow/10",
      fire: "bg-red-400/10",
      star: "bg-yellow/10",
      medal: "bg-primary/10",
      puzzle: "bg-purple/10",
      brain: "bg-accent/10",
    };

    return unlocked ? bgColorMap[iconName] || "bg-primary/10" : "bg-gray-200";
  };

  // Map achievement icons to text color classes
  const getTextColorClass = (iconName: string) => {
    const textColorMap: Record<string, string> = {
      rocket: "text-primary",
      code: "text-purple",
      loop: "text-secondary",
      gamepad: "text-teal",
      trophy: "text-yellow-500",
      fire: "text-red-400",
      star: "text-yellow-500",
      medal: "text-primary",
      puzzle: "text-purple",
      brain: "text-accent",
    };

    return unlocked ? textColorMap[iconName] || "text-primary" : "text-gray-400";
  };

  return (
    <div className={`badge bg-white p-4 rounded-2xl shadow-md text-center ${!unlocked ? "opacity-50" : ""}`}>
      <div className={`w-16 h-16 mx-auto ${getBackgroundClass(achievement.iconName)} rounded-full flex items-center justify-center`}>
        <i className={`${getIconClass(achievement.iconName)} text-2xl ${getTextColorClass(achievement.iconName)}`}></i>
      </div>
      <h4 className={`font-baloo font-semibold mt-2 ${unlocked ? "text-gray-800" : "text-gray-400"}`}>
        {achievement.title}
      </h4>
      <p className={`text-xs mt-1 ${unlocked ? "text-gray-500" : "text-gray-400"}`}>
        {achievement.description}
      </p>
    </div>
  );
}
