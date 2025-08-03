import { Button } from "@/components/ui/button";
import { Trophy, Crown, Sword } from "lucide-react";

interface ArenaTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ArenaTabs = ({ activeTab, setActiveTab }: ArenaTabsProps) => {
  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
        {[{id: "challenges", label: "Active Challenges", icon: Trophy}, {id: "leaderboard", label: "Leaderboard", icon: Crown}, {id: "battle", label: "Battle Zone", icon: Sword}].map(tab => (
          <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} className={`rounded-xl px-8 py-3 transition-all duration-300 flex items-center space-x-2 ${activeTab === tab.id ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105"}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon className="w-5 h-5" /><span className="font-semibold">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
