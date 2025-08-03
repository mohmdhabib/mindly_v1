import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sword, Users, Zap, Target, Play, ArrowRight } from "lucide-react";
import { QuizDuel } from "./QuizDuel";
import { QuickBattle } from "./QuickBattle";

const battleModes = [
    { title: "1v1 Quick Battle", description: "Challenge another learner to a head-to-head quiz", icon: Sword, color: "from-red-500 to-pink-600", action: "Find Opponent", gradient: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20" },
    { title: "Team Challenge", description: "Join a team and compete against other groups", icon: Users, color: "from-blue-500 to-indigo-600", action: "Join Team", gradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" },
    { title: "Quiz Duel", description: "Fast-paced questions with real-time scoring", icon: Zap, color: "from-yellow-500 to-orange-600", action: "Start Duel", gradient: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20" },
    { title: "Study Marathon", description: "Long-form learning session with rewards", icon: Target, color: "from-green-500 to-emerald-600", action: "Begin Marathon", gradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" }
];

export const BattleZoneTab = () => {
    const [duelActive, setDuelActive] = useState(false);
    const [quickBattleActive, setQuickBattleActive] = useState(false);

    if (duelActive) {
        return <QuizDuel setDuelActive={setDuelActive} />;
    }

    if (quickBattleActive) {
        return <QuickBattle setQuickBattleActive={setQuickBattleActive} />;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Battle Zone</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Choose your battle mode and dominate the competition</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                {battleModes.map((mode, index) => (
                    <Card key={index} className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 overflow-hidden relative ${mode.gradient}`}>
                        <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${mode.color}`}></div>
                        <div className="p-8 relative">
                            <div className={`w-20 h-20 bg-gradient-to-r ${mode.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                                <mode.icon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300">{mode.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">{mode.description}</p>
                            <Button
                                className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-xl transition-all duration-300 text-lg font-bold py-4 rounded-xl group-hover:scale-105`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (mode.title === "Quiz Duel") setDuelActive(true);
                                    if (mode.title === "1v1 Quick Battle") setQuickBattleActive(true);
                                }}
                            >
                                <Play className="w-5 h-5 mr-3" />
                                {mode.action}
                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
