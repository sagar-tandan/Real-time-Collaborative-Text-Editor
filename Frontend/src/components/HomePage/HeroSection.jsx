import { Brain, Code2, Target } from "lucide-react";
import React from "react";
import PlatformCard from "../CardComponents/PlatformCard";

const platforms = [
  {
    name: "LeetCode",
    icon: <Code2 className="w-5 h-5" />,
    solved: 245,
    total: 2400,
    rating: 1842,
    streak: 15,
  },
  {
    name: "CodeForces",
    icon: <Target className="w-5 h-5" />,
    solved: 178,
    total: 1500,
    rating: 1456,
    streak: 8,
  },
  {
    name: "HackerRank",
    icon: <Brain className="w-5 h-5" />,
    solved: 312,
    total: 850,
    rating: 2100,
    streak: 22,
  },
];

const HeroSection = () => {
  return (
    <div className="w-full container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {platforms.map((platform) => (
          <PlatformCard key={platform.name} {...platform} />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
