import { Sparkles, Trophy } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Fire } from "lucide-react";

export const ArenaHeader = () => {
  const { session } = useAuth();
  const userStats = {rank: 5, xp: 12450, level: 23, winRate: 78, streak: 7};

  return (
    <>
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 dark:border-yellow-400/40 mb-8 backdrop-blur-xl shadow-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-3"><Trophy className="w-4 h-4 text-white" /></div>
          <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">Competitive Learning Arena</span>
          <Sparkles className="w-5 h-5 text-yellow-600 ml-3 animate-pulse" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">Learning Arena</h1>
        <div className="text-2xl mb-2">🏆</div>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">Challenge yourself and others. Compete, learn, and climb the leaderboards in this ultimate learning battlefield!</p>
      </div>
      <Card className="p-8 mb-10 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 border-2 border-yellow-200 dark:border-yellow-700 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16 ring-4 ring-white dark:ring-slate-800 shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-xl">{session?.user?.email?.substring(0, 2).toUpperCase() || "GU"}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-white">#{userStats.rank}</span></div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{session?.user?.email?.split("@")[0] || "Guest User"}</div>
                <div className="text-lg text-slate-600 dark:text-slate-300 font-medium">Level {userStats.level} Warrior</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="group"><div className="text-3xl font-black text-yellow-600 group-hover:scale-110 transition-transform duration-200">{userStats.xp.toLocaleString()}</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total XP</div></div>
              <div className="group"><div className="text-3xl font-black text-green-600 group-hover:scale-110 transition-transform duration-200">{userStats.winRate}%</div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Win Rate</div></div>
              <div className="group"><div className="flex items-center justify-center space-x-2 group-hover:scale-110 transition-transform duration-200"><Fire className="w-6 h-6 text-orange-500 animate-pulse" /><span className="text-3xl font-black text-orange-600">{userStats.streak}</span></div><div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Day Streak</div></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right"><div className="text-sm text-slate-600 dark:text-slate-400">Next Level</div><div className="text-lg font-bold text-slate-900 dark:text-white">2,550 XP to go</div></div>
            <Progress value={65} className="w-40 h-4" />
          </div>
        </div>
      </Card>
    </>
  );
};
