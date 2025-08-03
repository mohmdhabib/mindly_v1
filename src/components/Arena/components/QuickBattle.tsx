import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sword, Users, Play, ArrowRight, Timer } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ChallengeService } from "@/services/challenge.service";
import { getQuestions, getScore, type Difficulty, type Subject, type QuizQuestion } from "@/lib/quiz";

declare global {
    interface Window {
        quickBattleInterval: NodeJS.Timeout | null;
    }
}

interface QuickBattleProps {
    setQuickBattleActive: (active: boolean) => void;
}

const getProgressWidth = (current: number, total: number) => `${Math.round(((current + 1) / total) * 100)}%`;

export const QuickBattle = ({ setQuickBattleActive }: QuickBattleProps) => {
    const { session } = useAuth();
    const [quickBattleJoining, setQuickBattleJoining] = useState(false);
    const [quickBattleCreated, setQuickBattleCreated] = useState(false);
    const [quickBattleStarted, setQuickBattleStarted] = useState(false);
    const [quickBattleShowResult, setQuickBattleShowResult] = useState(false);
    const [quickBattleSubject, setQuickBattleSubject] = useState<Subject>("Mathematics");
    const [quickBattleDifficulty, setQuickBattleDifficulty] = useState<Difficulty>("medium");
    const [quickBattleInviteCode, setQuickBattleInviteCode] = useState("");
    const [quickBattleId, setQuickBattleId] = useState<string | null>(null);
    const [quickBattleError, setQuickBattleError] = useState<string | null>(null);
    const [quickBattleStatus, setQuickBattleStatus] = useState<any>(null);
    const [quickBattleQuestions, setQuickBattleQuestions] = useState<QuizQuestion[]>([]);
    const [quickBattleCurrent, setQuickBattleCurrent] = useState(0);
    const [quickBattleUserAnswers, setQuickBattleUserAnswers] = useState<string[]>([]);
    const [quickBattleScore, setQuickBattleScore] = useState(0);

    useEffect(() => {
        return () => {
            if (window.quickBattleInterval) {
                clearInterval(window.quickBattleInterval);
                window.quickBattleInterval = null;
            }
        };
    }, []);

    const generateInvitationCode = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateQuickBattle = async () => {
        if (!session?.user) {
            setQuickBattleError("You must be logged in to create a battle");
            return;
        }
        try {
            setQuickBattleError(null);
            const inviteCode = generateInvitationCode();
            const { data, error } = await ChallengeService.createChallenge({
                title: `Quick Battle: ${quickBattleSubject}`,
                description: `1v1 Quick Battle with ${quickBattleSubject} at ${quickBattleDifficulty} difficulty`,
                challenge_type: "duel",
                subject: quickBattleSubject,
                difficulty_level: quickBattleDifficulty,
                is_active: true,
                xp_reward: 100,
                created_by: session.user.id
            });
            if (error) {
                console.error("Error creating quick battle:", error);
                setQuickBattleError("Failed to create battle. Please try again.");
                return;
            }
            if (data) {
                await ChallengeService.joinChallenge(data.id, session.user.id);
                setQuickBattleId(data.id);
                setQuickBattleInviteCode(inviteCode);
                setQuickBattleCreated(true);
                const checkInterval = setInterval(async () => {
                    const { data: leaderboard } = await ChallengeService.getChallengeLeaderboard(data.id);
                    if (leaderboard && leaderboard.length > 1) {
                        clearInterval(checkInterval);
                        setQuickBattleStatus({ isReady: true, participants: leaderboard });
                    }
                }, 3000);
                window.quickBattleInterval = checkInterval;
            }
        } catch (err) {
            console.error("Exception in handleCreateQuickBattle:", err);
            setQuickBattleError("An unexpected error occurred. Please try again.");
        }
    };

    const handleJoinQuickBattle = async () => {
        if (!session?.user) {
            setQuickBattleError("You must be logged in to join a battle");
            return;
        }
        if (quickBattleInviteCode.length !== 6) {
            setQuickBattleError("Please enter a valid 6-character invitation code");
            return;
        }
        try {
            setQuickBattleError(null);
            const { data: challenges, error } = await ChallengeService.getActiveChallenges();
            if (error) {
                console.error("Error finding battle:", error);
                setQuickBattleError("Failed to find battle. Please check your code and try again.");
                return;
            }
            const challenge = challenges.find(c => c.challenge_type === "duel" && c.title.startsWith("Quick Battle:") && !c.is_completed);
            if (!challenge) {
                setQuickBattleError("Battle not found. Please check your invitation code.");
                return;
            }
            const { data: userChallenges } = await ChallengeService.getUserChallenges(session.user.id);
            const alreadyJoined = userChallenges?.some(p => p.challenge_id === challenge.id);

            if (!alreadyJoined) {
                const { data: joinData, error: joinError } = await ChallengeService.joinChallenge(challenge.id, session.user.id);
                if (joinError && !(joinError.code === '23505' && joinError.message?.includes('challenge_participations_challenge_id_user_id_key'))) {
                    console.error("Error joining battle:", joinError);
                    setQuickBattleError("Failed to join battle. Please try again.");
                    return;
                }
            }

            setQuickBattleId(challenge.id);
            setQuickBattleCreated(true);
            setQuickBattleStatus({ isReady: true, participants: [{ profiles: { username: session.user.email?.split("@")[0] } }] });
            const { data: leaderboard } = await ChallengeService.getChallengeLeaderboard(challenge.id);
            if (leaderboard) {
                setQuickBattleStatus({ isReady: true, participants: leaderboard });
            }
        } catch (err) {
            console.error("Exception in handleJoinQuickBattle:", err);
            setQuickBattleError("An unexpected error occurred. Please try again.");
        }
    };

    const setupQuestions = async (subject: Subject) => {
        try {
            const [easyQs, mediumQs, hardQs] = await Promise.all([
                getQuestions(subject, "easy", 5),
                getQuestions(subject, "medium", 5),
                getQuestions(subject, "hard", 5),
            ]);
            const allQuestions = [...easyQs, ...mediumQs, ...hardQs];
            if (allQuestions.length < 15) {
                console.error("Not enough questions available");
                return;
            }
            const shuffled = [...allQuestions];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setQuickBattleQuestions(shuffled);
            setQuickBattleCurrent(0);
            setQuickBattleUserAnswers([]);
            setQuickBattleScore(0);
            setQuickBattleStarted(true);
            setQuickBattleShowResult(false);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        }
    };

    if (quickBattleStarted && quickBattleQuestions.length > 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Timer className="w-5 h-5 text-red-600" />
                            <span className="font-bold text-gray-900 dark:text-white">Question {quickBattleCurrent + 1} of {quickBattleQuestions.length}</span>
                        </div>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500 rounded-full" style={{ width: getProgressWidth(quickBattleCurrent, quickBattleQuestions.length) }}></div>
                    </div>
                </Card>
                <Card className="p-8 bg-white dark:bg-gray-800 shadow-2xl">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Badge variant={quickBattleQuestions[quickBattleCurrent].difficulty === "easy" ? "secondary" : quickBattleQuestions[quickBattleCurrent].difficulty === "medium" ? "default" : "destructive"} className="text-sm px-3 py-1">{quickBattleQuestions[quickBattleCurrent].difficulty.charAt(0).toUpperCase() + quickBattleQuestions[quickBattleCurrent].difficulty.slice(1)}</Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">{quickBattleQuestions[quickBattleCurrent].subject}</Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{quickBattleQuestions[quickBattleCurrent].question}</h3>
                        <div className="space-y-3">
                            {quickBattleQuestions[quickBattleCurrent].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${quickBattleUserAnswers[quickBattleCurrent] === opt ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"}`}
                                    onClick={() => {
                                        const isCorrect = opt === quickBattleQuestions[quickBattleCurrent].answer;
                                        const newAnswers = [...quickBattleUserAnswers];
                                        newAnswers[quickBattleCurrent] = opt;
                                        setQuickBattleUserAnswers(newAnswers);
                                        setTimeout(() => {
                                            if (quickBattleCurrent + 1 === quickBattleQuestions.length) {
                                                let score = 0;
                                                newAnswers.forEach((ans, idx) => {
                                                    if (ans === quickBattleQuestions[idx].answer) {
                                                        score += getScore(quickBattleQuestions[idx].difficulty);
                                                    }
                                                });
                                                setQuickBattleScore(score);
                                                setQuickBattleStarted(false);
                                                setQuickBattleShowResult(true);
                                            } else {
                                                setQuickBattleCurrent(quickBattleCurrent + 1);
                                            }
                                        }, 1000);
                                    }}
                                >
                                    <span className="flex-1 text-left">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (quickBattleShowResult) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
                    <div className="space-y-8">
                        <div className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">Battle Complete!</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">Your Score: {quickBattleScore}</div>
                        <div className="text-center">
                            <Button
                                onClick={() => setQuickBattleActive(false)}
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <Play className="w-6 h-6 mr-3" />
                                Play Again
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">1v1 Quick Battle ⚔️</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Challenge another player to a head-to-head quiz battle</p>
            </div>
            {!quickBattleCreated ? (
                <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                            {[{ id: "create", label: "Create Battle", icon: Sword }, { id: "join", label: "Join Battle", icon: Users }].map(tab => (
                                <Button
                                    key={tab.id}
                                    variant={quickBattleJoining ? "ghost" : "default"}
                                    className={`rounded-xl px-8 py-3 transition-all duration-300 flex items-center space-x-2 ${quickBattleJoining === (tab.id === "join") ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105"}`}
                                    onClick={() => setQuickBattleJoining(tab.id === "join")}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span className="font-semibold">{tab.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                    {quickBattleJoining ? (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Enter Invitation Code:</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 uppercase"
                                    value={quickBattleInviteCode}
                                    onChange={(e) => setQuickBattleInviteCode(e.target.value.toUpperCase())}
                                    placeholder="Enter 6-character code"
                                    maxLength={6}
                                />
                            </div>
                            {quickBattleError && <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">{quickBattleError}</div>}
                            <div className="text-center">
                                <Button onClick={handleJoinQuickBattle} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" disabled={quickBattleInviteCode.length !== 6}>
                                    <Users className="w-6 h-6 mr-3" />
                                    Join Battle
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Subject:</label>
                                    <select className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200" value={quickBattleSubject} onChange={(e) => setQuickBattleSubject(e.target.value as Subject)} title="Select subject">
                                        {["Mathematics", "Science", "Programming", "History", "Geography"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Difficulty:</label>
                                    <div className="space-y-3">
                                        <input type="range" min={0} max={3} value={["easy", "medium", "hard", "very hard"].indexOf(quickBattleDifficulty)} onChange={(e) => setQuickBattleDifficulty(["easy", "medium", "hard", "very hard"][parseInt(e.target.value)] as Difficulty)} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" title="Select difficulty" />
                                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">{["Easy", "Medium", "Hard", "Expert"].map(d => <span key={d}>{d}</span>)}</div>
                                        <div className="text-center">
                                            <Badge variant={quickBattleDifficulty === "easy" ? "secondary" : quickBattleDifficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{quickBattleDifficulty.charAt(0).toUpperCase() + quickBattleDifficulty.slice(1)}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {quickBattleError && <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">{quickBattleError}</div>}
                            <div className="text-center">
                                <Button onClick={handleCreateQuickBattle} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    <Sword className="w-6 h-6 mr-3" />
                                    Create Battle
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            ) : (
                <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
                    {quickBattleStatus?.isReady ? (
                        <div className="space-y-8">
                            <div className="text-4xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text mb-4">Battle Ready! Starting soon...</div>
                            <div className="flex justify-center space-x-8">
                                {quickBattleStatus.participants.map((participant: any, index: number) => (
                                    <div key={index} className="text-center">
                                        <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white dark:ring-slate-800 shadow-xl">
                                            <AvatarFallback className={`bg-gradient-to-br ${index === 0 ? "from-blue-400 to-blue-600" : "from-red-400 to-red-600"} text-white font-bold text-2xl`}>
                                                {participant.user.username?.substring(0, 2).toUpperCase() || "P"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-bold text-lg text-gray-900 dark:text-white">{participant.user.username || "Player"}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="animate-pulse">
                                <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 rounded-full px-6 py-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                    <span className="text-green-700 dark:text-green-300 font-bold">Preparing battle...</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">Waiting for Opponent</div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 mb-8">
                                <div className="text-2xl font-black text-red-600 dark:text-red-400 mb-4">Share this invitation code with your opponent:</div>
                                <div className="flex justify-center">
                                    <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl border-2 border-red-300 dark:border-red-700 text-4xl font-black tracking-widest text-red-600 dark:text-red-400 shadow-lg">{quickBattleInviteCode}</div>
                                </div>
                            </div>
                            <div className="animate-pulse">
                                <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-6 py-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                    <span className="text-yellow-700 dark:text-yellow-300 font-bold">Waiting for opponent to join...</span>
                                </div>
                            </div>
                            <Button variant="outline" className="mt-4" onClick={() => setQuickBattleActive(false)}>Cancel Battle</Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};
