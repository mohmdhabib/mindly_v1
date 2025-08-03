import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Medal, Star } from "lucide-react";
import { Fire } from "lucide-react";

const leaderboard = [
    { rank: 1, name: "Alex Chen", xp: 15420, avatar: "AC", badge: "crown", winStreak: 12 },
    { rank: 2, name: "Sarah Kim", xp: 14890, avatar: "SK", badge: "medal", winStreak: 8 },
    { rank: 3, name: "Mike Johnson", xp: 14250, avatar: "MJ", badge: "medal", winStreak: 6 },
    { rank: 4, name: "Emma Davis", xp: 13800, avatar: "ED", badge: null, winStreak: 4 },
    { rank: 5, name: "You", xp: 12450, avatar: "YU", badge: null, isUser: true, winStreak: 7 }
];

export const LeaderboardTab = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Global Leaderboard</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">See how you rank against the best learners worldwide</p>
                </div>
                <div className="space-y-6">
                    {leaderboard.map((user, index) => (
                        <div key={index} className={`flex items-center space-x-6 p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${user.isUser ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-600 shadow-xl" : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl"}`}>
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" : user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white" : user.rank === 3 ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white" : "bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 text-gray-700 dark:text-gray-300"}`}>{user.rank}</div>
                                {user.badge === "crown" && <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />}
                                {user.badge === "medal" && <Medal className="w-6 h-6 text-gray-400" />}
                            </div>
                            <Avatar className="w-14 h-14 shadow-lg">
                                <AvatarFallback className={`font-black text-lg ${user.isUser ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}>{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className={`font-black text-xl ${user.isUser ? "text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text" : "text-gray-900 dark:text-white"}`}>{user.name}</div>
                                <div className="text-gray-500 dark:text-gray-400 font-medium">{user.xp.toLocaleString()} XP</div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-lg font-black text-gray-700 dark:text-gray-300">Level {Math.floor(user.xp / 500)}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center space-x-1">
                                        <Fire className="w-4 h-4 text-orange-500" />
                                        <span className="text-lg font-black text-orange-600">{user.winStreak}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">streak</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
