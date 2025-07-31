import { useState, useEffect } from "react";
declare global { interface Window { quickBattleInterval: NodeJS.Timeout | null; } }
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Zap, Users, Clock, Star, Sword, Target, Medal, Crown, Siren as Fire, TrendingUp, Calendar, Play, Plus, Loader2, CheckCircle2, XCircle, HelpCircle, User, Bot, ArrowRight, Sparkles, Timer, Award, Activity, BarChart3, Gift } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ChallengeService, type Challenge } from "@/services/challenge.service";
import { ProfileService } from "@/services/profile.service";
import { ChallengeForm } from "@/components/Arena/ChallengeForm";
import { getQuestions, aiAnswerAdvanced, getScore, type Difficulty, type Subject, type QuizQuestion, type AIPersonality } from "@/lib/quiz";

export function Arena() {
  const { session } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChallenges, setUserChallenges] = useState<Record<string, any>>({});
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [activeTab, setActiveTab] = useState("challenges");
  const [duelActive, setDuelActive] = useState(false);
  const [duelStarted, setDuelStarted] = useState(false);
  const [duelQuestions, setDuelQuestions] = useState<QuizQuestion[]>([]);
  const [duelCurrent, setDuelCurrent] = useState(0);
  const [duelUserAnswers, setDuelUserAnswers] = useState<string[]>([]);
  const [duelAiAnswers, setDuelAiAnswers] = useState<string[]>([]);
  const [duelSelected, setDuelSelected] = useState<string | null>(null);
  const [duelAiSelected, setDuelAiSelected] = useState<string | null>(null);
  const [duelCorrect, setDuelCorrect] = useState<boolean | null>(null);
  const [duelShowAi, setDuelShowAi] = useState(false);
  const [duelAiThinking, setDuelAiThinking] = useState(false);
  const [duelAiExplanation, setDuelAiExplanation] = useState("");
  const [duelScore, setDuelScore] = useState(0);
  const [duelShowResult, setDuelShowResult] = useState(false);
  const [duelSubject, setDuelSubject] = useState<Subject>("Mathematics");
  const [duelDifficulty, setDuelDifficulty] = useState<Difficulty>("easy");
  const [quickBattleActive, setQuickBattleActive] = useState(false);
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

  const leaderboard = [{rank: 1, name: "Alex Chen", xp: 15420, avatar: "AC", badge: "crown", winStreak: 12}, {rank: 2, name: "Sarah Kim", xp: 14890, avatar: "SK", badge: "medal", winStreak: 8}, {rank: 3, name: "Mike Johnson", xp: 14250, avatar: "MJ", badge: "medal", winStreak: 6}, {rank: 4, name: "Emma Davis", xp: 13800, avatar: "ED", badge: null, winStreak: 4}, {rank: 5, name: "You", xp: 12450, avatar: "YU", badge: null, isUser: true, winStreak: 7}];
  const battleModes = [{title: "1v1 Quick Battle", description: "Challenge another learner to a head-to-head quiz", icon: Sword, color: "from-red-500 to-pink-600", action: "Find Opponent", gradient: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"}, {title: "Team Challenge", description: "Join a team and compete against other groups", icon: Users, color: "from-blue-500 to-indigo-600", action: "Join Team", gradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"}, {title: "Quiz Duel", description: "Fast-paced questions with real-time scoring", icon: Zap, color: "from-yellow-500 to-orange-600", action: "Start Duel", gradient: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"}, {title: "Study Marathon", description: "Long-form learning session with rewards", icon: Target, color: "from-green-500 to-emerald-600", action: "Begin Marathon", gradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"}];
  const userStats = {rank: 5, xp: 12450, level: 23, winRate: 78, streak: 7};

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true); setError(null);
      try {
        const { data, error } = await ChallengeService.getActiveChallenges();
        if (error) { setError("Failed to load challenges"); console.error("Error loading challenges:", error); }
        else if (data) {
          setActiveChallenges(data);
          if (session?.user) {
            const { data: userParticipations } = await ChallengeService.getUserChallenges(session.user.id);
            if (userParticipations) setUserChallenges(userParticipations.reduce((acc, participation) => { acc[participation.challenge_id] = participation; return acc; }, {}));
          }
        }
      } catch (err) { setError("An unexpected error occurred"); console.error("Exception in fetchChallenges:", err); }
      finally { setIsLoading(false); }
    };
    fetchChallenges();
  }, [session]);

  useEffect(() => () => { if (window.quickBattleInterval) { clearInterval(window.quickBattleInterval); window.quickBattleInterval = null; } }, []);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!session?.user) return;
    try {
      const { data, error } = await ChallengeService.joinChallenge(challengeId, session.user.id);
      if (error) console.error("Error joining challenge:", error);
      else if (data) setUserChallenges(prev => ({...prev, [challengeId]: data}));
    } catch (err) { console.error("Exception in handleJoinChallenge:", err); }
  };

  const generateInvitationCode = () => { const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let code = ""; for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length)); return code; };

  const handleCreateQuickBattle = async () => {
    if (!session?.user) { setQuickBattleError("You must be logged in to create a battle"); return; }
    try {
      setQuickBattleError(null);
      const inviteCode = generateInvitationCode();
      const { data, error } = await ChallengeService.createChallenge({title: `Quick Battle: ${quickBattleSubject}`, description: `1v1 Quick Battle with ${quickBattleSubject} at ${quickBattleDifficulty} difficulty`, challenge_type: "duel", subject: quickBattleSubject, difficulty_level: quickBattleDifficulty, is_active: true, xp_reward: 100, created_by: session.user.id});
      if (error) { console.error("Error creating quick battle:", error); setQuickBattleError("Failed to create battle. Please try again."); return; }
      if (data) {
        await ChallengeService.joinChallenge(data.id, session.user.id);
        setQuickBattleId(data.id); setQuickBattleInviteCode(inviteCode); setQuickBattleCreated(true);
        const checkInterval = setInterval(async () => {
          const { data: leaderboard } = await ChallengeService.getChallengeLeaderboard(data.id);
          if (leaderboard && leaderboard.length > 1) { clearInterval(checkInterval); setQuickBattleStatus({isReady: true, participants: leaderboard}); }
        }, 3000);
        window.quickBattleInterval = checkInterval;
      }
    } catch (err) { console.error("Exception in handleCreateQuickBattle:", err); setQuickBattleError("An unexpected error occurred. Please try again."); }
  };

  const handleJoinQuickBattle = async () => {
    if (!session?.user) { setQuickBattleError("You must be logged in to join a battle"); return; }
    if (quickBattleInviteCode.length !== 6) { setQuickBattleError("Please enter a valid 6-character invitation code"); return; }
    try {
      setQuickBattleError(null);
      const { data: challenges, error } = await ChallengeService.getActiveChallenges();
      if (error) { console.error("Error finding battle:", error); setQuickBattleError("Failed to find battle. Please check your code and try again."); return; }
      const challenge = challenges.find(c => c.challenge_type === "duel" && c.title.startsWith("Quick Battle:") && !c.is_completed);
      if (!challenge) { setQuickBattleError("Battle not found. Please check your invitation code."); return; }
      const { data: userChallenges } = await ChallengeService.getUserChallenges(session.user.id);
      const alreadyJoined = userChallenges?.some(p => p.challenge_id === challenge.id);
      
      if (!alreadyJoined) {
        const { data: joinData, error: joinError } = await ChallengeService.joinChallenge(challenge.id, session.user.id);
        if (joinError && !(joinError.code === '23505' && joinError.message?.includes('challenge_participations_challenge_id_user_id_key'))) {
          console.error("Error joining battle:", joinError); setQuickBattleError("Failed to join battle. Please try again."); return;
        }
      }
      
      setQuickBattleId(challenge.id); setQuickBattleCreated(true); setQuickBattleStatus({isReady: true, participants: [{profiles: {username: session.user.email?.split("@")[0]}}]});
      const { data: leaderboard } = await ChallengeService.getChallengeLeaderboard(challenge.id);
      if (leaderboard) setQuickBattleStatus({isReady: true, participants: leaderboard});
    } catch (err) { console.error("Exception in handleJoinQuickBattle:", err); setQuickBattleError("An unexpected error occurred. Please try again."); }
  };

  const setupQuestions = async (subject: Subject, setQuestions: any, setStarted: any, setCurrent: any, setUserAnswers: any, setScore: any, setShowResult: any) => {
    try {
      const [easyQs, mediumQs, hardQs] = await Promise.all([getQuestions(subject, "easy", 5), getQuestions(subject, "medium", 5), getQuestions(subject, "hard", 5)]);
      const allQuestions = [...easyQs, ...mediumQs, ...hardQs];
      if (allQuestions.length < 15) { console.error("Not enough questions available"); return; }
      const shuffled = [...allQuestions]; for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      setQuestions(shuffled); setCurrent(0); setUserAnswers([]); setScore(0); setStarted(true); setShowResult(false);
    } catch (error) { console.error("Failed to fetch questions:", error); }
  };

  const getTimeRemaining = (endDate: string) => { const end = new Date(endDate); const now = new Date(); const diff = end.getTime() - now.getTime(); if (diff <= 0) return "Ended"; const days = Math.floor(diff / (1000 * 60 * 60 * 24)); const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`; return `${hours} hour${hours !== 1 ? "s" : ""}`; };
  const getProgressWidth = (current: number, total: number) => `${Math.round(((current + 1) / total) * 100)}%`;

  const renderHeader = () => (
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
  );

  const renderUserStats = () => (
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
  );

  const renderTabs = () => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderHeader()}
        {renderUserStats()}
        {renderTabs()}

        {activeTab === "challenges" && !duelActive && (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div><h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Active Challenges</h2><p className="text-gray-600 dark:text-gray-400">Join the competition and earn rewards</p></div>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3" onClick={() => setShowChallengeForm(true)}><Plus className="w-5 h-5 mr-2" />Create Challenge</Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-yellow-500" /><span className="ml-2 text-gray-600 dark:text-gray-300">Loading challenges...</span></div>
              ) : error ? (
                <div className="text-center py-12"><p className="text-red-500">{error}</p><Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button></div>
              ) : activeChallenges.length === 0 ? (
                <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-lg p-6"><Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Challenges</h3><p className="text-gray-600 dark:text-gray-300 mb-6">There are no active challenges at the moment. Be the first to create one!</p><Button className="bg-gradient-to-r from-yellow-500 to-orange-500" onClick={() => setShowChallengeForm(true)}><Plus className="w-4 h-4 mr-2" />Create Challenge</Button></div>
              ) : (
                <div className="space-y-8">
                  {activeChallenges.map(challenge => {
                    const userParticipation = userChallenges[challenge.id];
                    const progress = userParticipation ? (userParticipation.score / 100) * 100 : 0;
                    return (
                      <Card key={challenge.id} className="group p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300">{challenge.title}</h3>
                                <Badge variant={challenge.difficulty_level === "Easy" ? "secondary" : challenge.difficulty_level === "Medium" ? "default" : "destructive"} className="text-sm font-bold px-3 py-1">{challenge.difficulty_level || "Medium"}</Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">{challenge.description || "Complete this challenge to earn XP and improve your ranking."}</p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"><Users className="w-4 h-4" /><span className="font-medium">{challenge.participant_count || 0} participants</span></div>
                                {challenge.end_date && <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"><Clock className="w-4 h-4" /><span className="font-medium">{getTimeRemaining(challenge.end_date)} left</span></div>}
                                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full px-3 py-1"><Gift className="w-4 h-4 text-yellow-600" /><span className="font-bold text-yellow-700 dark:text-yellow-400">{challenge.xp_reward} XP</span></div>
                              </div>
                            </div>
                          </div>
                          {progress > 0 && <div className="mb-6"><div className="flex items-center justify-between text-sm mb-2"><span className="text-gray-600 dark:text-gray-300 font-medium">Your Progress</span><span className="text-gray-600 dark:text-gray-300 font-bold">{progress}%</span></div><Progress value={progress} className="h-3" /></div>}
                          <Button className={`w-full py-4 text-lg font-bold transition-all duration-300 ${userParticipation ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl" : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-xl hover:scale-105"}`} onClick={() => userParticipation ? console.log("Continue challenge") : handleJoinChallenge(challenge.id)}><Play className="w-5 h-5 mr-3" />{userParticipation ? "Continue Challenge" : "Join Challenge"}<ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" /></Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm shadow-xl">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center"><div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3"><TrendingUp className="w-4 h-4 text-white" /></div>This Week</h3>
                <div className="space-y-4">
                  {[{label: "Challenges Won", icon: Award, color: "green", value: "12"}, {label: "XP Earned", icon: Star, color: "yellow", value: "2,450"}, {label: "Rank Change", icon: TrendingUp, color: "green", value: "+3"}].map((stat, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-lg`}>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</span>
                      <div className="flex items-center space-x-2"><stat.icon className={`w-4 h-4 text-${stat.color}-600`} /><span className={`font-black text-gray-900 dark:text-white text-lg ${stat.label === "Rank Change" ? `text-${stat.color}-600` : ""}`}>{stat.value}</span></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-8"><h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Global Leaderboard</h2><p className="text-gray-600 dark:text-gray-400 text-lg">See how you rank against the best learners worldwide</p></div>
              <div className="space-y-6">
                {leaderboard.map((user, index) => (
                  <div key={index} className={`flex items-center space-x-6 p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${user.isUser ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-600 shadow-xl" : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl"}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white" : user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500 text-white" : user.rank === 3 ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white" : "bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 text-gray-700 dark:text-gray-300"}`}>{user.rank}</div>
                      {user.badge === "crown" && <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />}
                      {user.badge === "medal" && <Medal className="w-6 h-6 text-gray-400" />}
                    </div>
                    <Avatar className="w-14 h-14 shadow-lg"><AvatarFallback className={`font-black text-lg ${user.isUser ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}>{user.avatar}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className={`font-black text-xl ${user.isUser ? "text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text" : "text-gray-900 dark:text-white"}`}>{user.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 font-medium">{user.xp.toLocaleString()} XP</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center"><div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span className="text-lg font-black text-gray-700 dark:text-gray-300">Level {Math.floor(user.xp / 500)}</span></div></div>
                      <div className="text-center"><div className="flex items-center space-x-1"><Fire className="w-4 h-4 text-orange-500" /><span className="text-lg font-black text-orange-600">{user.winStreak}</span></div><div className="text-xs text-gray-500 dark:text-gray-400">streak</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {duelActive && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8"><h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text mb-4">Quiz Duel ⚡</h2><p className="text-xl text-gray-600 dark:text-gray-300">Fast-paced challenge against AI</p></div>
            
            {!duelStarted && !duelShowResult && (
              <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div><label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Subject:</label><select className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200" value={duelSubject} onChange={(e) => setDuelSubject(e.target.value as Subject)} title="Select subject">{["Mathematics", "Science", "Programming", "History", "Geography"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Difficulty:</label><div className="space-y-3"><input type="range" min={0} max={3} value={["easy", "medium", "hard", "very hard"].indexOf(duelDifficulty)} onChange={(e) => setDuelDifficulty(["easy", "medium", "hard", "very hard"][parseInt(e.target.value)] as Difficulty)} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" title="Select difficulty" /><div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">{["Easy", "Medium", "Hard", "Expert"].map(d => <span key={d}>{d}</span>)}</div><div className="text-center"><Badge variant={duelDifficulty === "easy" ? "secondary" : duelDifficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{duelDifficulty.charAt(0).toUpperCase() + duelDifficulty.slice(1)}</Badge></div></div></div>
                  </div>
                  <div className="text-center"><Button onClick={() => setupQuestions(duelSubject, setDuelQuestions, setDuelStarted, setDuelCurrent, setDuelUserAnswers, setDuelScore, setDuelShowResult)} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"><Zap className="w-6 h-6 mr-3" />Start Epic Duel<ArrowRight className="w-6 h-6 ml-3" /></Button></div>
                </div>
              </Card>
            )}

            {duelStarted && duelQuestions.length > 0 && (
              <div className="space-y-8">
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3"><Timer className="w-5 h-5 text-yellow-600" /><span className="font-bold text-gray-900 dark:text-white">Question {duelCurrent + 1} of {duelQuestions.length}</span></div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2"><User className="w-5 h-5 text-blue-500" /><span className="font-bold text-blue-600">You: {duelUserAnswers.filter((ans, idx) => ans === duelQuestions[idx]?.answer).length}</span></div>
                      <div className="flex items-center space-x-2"><Bot className="w-5 h-5 text-yellow-500" /><span className="font-bold text-yellow-600">AI: {duelAiAnswers.filter((ans, idx) => ans === duelQuestions[idx]?.answer).length}</span></div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 rounded-full" style={{width: getProgressWidth(duelCurrent, duelQuestions.length)}}></div></div>
                </Card>

                <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-0">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-2"><User className="w-5 h-5 text-blue-500" /><span className="font-bold text-blue-700 dark:text-blue-300">You</span></div>
                      <span className="text-2xl font-black text-gray-400">VS</span>
                      <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-4 py-2"><Bot className="w-5 h-5 text-yellow-500" /><span className="font-bold text-yellow-700 dark:text-yellow-300">AI</span></div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Badge variant={duelQuestions[duelCurrent].difficulty === "easy" ? "secondary" : duelQuestions[duelCurrent].difficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{duelQuestions[duelCurrent].difficulty.charAt(0).toUpperCase() + duelQuestions[duelCurrent].difficulty.slice(1)}</Badge>
                      <Badge variant="outline" className="text-lg px-4 py-2 font-bold">{duelQuestions[duelCurrent].subject}</Badge>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 leading-tight">{duelQuestions[duelCurrent].question}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {duelQuestions[duelCurrent].options.map((opt, i) => {
                      let colorClasses = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300";
                      let icon = null;
                      if (duelSelected) {
                        if (opt === duelQuestions[duelCurrent].answer) {
                          colorClasses = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 shadow-green-200";
                          if (opt === duelSelected) icon = <CheckCircle2 className="w-6 h-6 text-green-600" title="Correct!" />;
                        } else if (opt === duelSelected && !duelCorrect) {
                          colorClasses = "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300 shadow-red-200";
                          icon = <XCircle className="w-6 h-6 text-red-600" title="Incorrect" />;
                        } else if (opt === duelSelected && duelCorrect) {
                          colorClasses = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 shadow-green-200";
                          icon = <CheckCircle2 className="w-6 h-6 text-green-600" title="Correct!" />;
                        } else if (opt === duelAiSelected) {
                          colorClasses = "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-300 shadow-yellow-200";
                          if (["easy", "medium"].includes(duelDifficulty)) icon = <HelpCircle className="w-6 h-6 text-yellow-500" title="AI is guessing" />;
                        }
                      }
                      return (
                        <button key={i} className={`group p-6 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 cursor-pointer border-2 flex items-center justify-between hover:scale-105 ${colorClasses} ${duelSelected && opt === duelAiSelected ? "ring-4 ring-yellow-400" : ""}`} onClick={async () => {
                          if (duelSelected) return;
                          setDuelSelected(opt); setDuelCorrect(opt === duelQuestions[duelCurrent].answer); setDuelAiThinking(true); setDuelAiSelected(null); setDuelAiExplanation("");
                          const aiRes = await aiAnswerAdvanced(duelQuestions[duelCurrent], {difficulty: duelDifficulty});
                          setDuelAiSelected(aiRes.answer); setDuelAiExplanation(aiRes.explanation); setDuelAiThinking(false); setDuelShowAi(true);
                          setTimeout(() => {
                            const ua = [...duelUserAnswers, opt]; const aiA = [...duelAiAnswers, aiRes.answer];
                            setDuelUserAnswers(ua); setDuelAiAnswers(aiA);
                            setTimeout(() => {
                              setDuelSelected(null); setDuelAiSelected(null); setDuelShowAi(false); setDuelAiExplanation(""); setDuelCorrect(null);
                              if (duelCurrent + 1 === duelQuestions.length) {
                                let s = 0; [...ua].forEach((ans, idx) => { if (ans === duelQuestions[idx].answer) s += getScore(duelQuestions[idx].difficulty); });
                                setDuelScore(s); setDuelStarted(false); setDuelShowResult(true);
                              } else setDuelCurrent(duelCurrent + 1);
                            }, 1200);
                          }, 400);
                        }} disabled={!!duelSelected || duelAiThinking}>
                          <span className="flex-1 text-left">{opt}</span>
                          <div className="flex items-center space-x-2">
                            {duelShowAi && duelAiSelected === opt && <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-bold">AI</Badge>}
                            {icon}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {duelAiThinking && <div className="mt-8 text-center"><div className="inline-flex items-center space-x-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-6 py-3"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div><span className="text-yellow-700 dark:text-yellow-300 font-bold">AI is thinking...</span></div></div>}
                  {duelShowAi && duelAiExplanation && <Card className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"><div className="flex items-start space-x-3"><Bot className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" /><div><div className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">AI's Reasoning:</div><p className="text-yellow-700 dark:text-yellow-400">{duelAiExplanation}</p></div></div></Card>}
                  {duelSelected && <div className={`mt-8 text-center p-6 rounded-2xl ${duelCorrect ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500" : "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"}`}><div className={`text-3xl font-black ${duelCorrect ? "text-green-600" : "text-red-600"}`}>{duelCorrect ? "🎉 Correct!" : "❌ Incorrect!"}</div></div>}
                </Card>
              </div>
            )}

            {duelShowResult && (
              <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
                <div className="mb-8"><div className="text-6xl mb-4">🏆</div><h3 className="text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text mb-4">Duel Complete!</h3></div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl"><User className="w-8 h-8 text-blue-500 mx-auto mb-3" /><div className="text-2xl font-black text-blue-600 mb-2">Your Score</div><div className="text-4xl font-black text-blue-700">{duelScore}</div></div>
                  <div className="p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl"><Bot className="w-8 h-8 text-yellow-500 mx-auto mb-3" /><div className="text-2xl font-black text-yellow-600 mb-2">AI Score</div><div className="text-4xl font-black text-yellow-700">{duelAiAnswers.reduce((acc, ans, idx) => ans === duelQuestions[idx].answer ? acc + getScore(duelQuestions[idx].difficulty) : acc, 0)}</div></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {["easy", "medium", "hard"].map(diff => {
                    const total = duelQuestions.filter(q => q.difficulty === diff).length;
                    const userCorrect = duelQuestions.filter((q, idx) => q.difficulty === diff && duelUserAnswers[idx] === q.answer).length;
                    const aiCorrect = duelQuestions.filter((q, idx) => q.difficulty === diff && duelAiAnswers[idx] === q.answer).length;
                    return (
                      <Card key={diff} className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                        <div className="text-center mb-4"><Badge variant={diff === "easy" ? "secondary" : diff === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{diff.charAt(0).toUpperCase() + diff.slice(1)}</Badge></div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-600 dark:text-gray-400">You:</span><span className="font-black text-green-600">{userCorrect}/{total}</span></div>
                          <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-600 dark:text-gray-400">AI:</span><span className="font-black text-yellow-600">{aiCorrect}/{total}</span></div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <Button onClick={() => { setDuelStarted(false); setDuelShowResult(false); setDuelUserAnswers([]); setDuelAiAnswers([]); setDuelQuestions([]); setDuelCurrent(0); setDuelScore(0); setDuelActive(false); }} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"><Play className="w-6 h-6 mr-3" />Play Again</Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === "battle" && !duelActive && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10"><h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Battle Zone</h2><p className="text-xl text-gray-600 dark:text-gray-300">Choose your battle mode and dominate the competition</p></div>
            <div className="grid gap-8 md:grid-cols-2">
              {battleModes.map((mode, index) => (
                <Card key={index} className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 overflow-hidden relative ${mode.gradient}`}>
                  <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${mode.color}`}></div>
                  <div className="p-8 relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${mode.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}><mode.icon className="w-10 h-10 text-white" /></div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300">{mode.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">{mode.description}</p>
                    <Button className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-xl transition-all duration-300 text-lg font-bold py-4 rounded-xl group-hover:scale-105`} onClick={(e) => { e.stopPropagation(); if (mode.title === "Quiz Duel") setDuelActive(true); if (mode.title === "1v1 Quick Battle") setQuickBattleActive(true); }}><Play className="w-5 h-5 mr-3" />{mode.action}<ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {quickBattleActive && !quickBattleStarted && !quickBattleShowResult && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8"><h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">1v1 Quick Battle ⚔️</h2><p className="text-xl text-gray-600 dark:text-gray-300">Challenge another player to a head-to-head quiz battle</p></div>
            {!quickBattleCreated ? (
              <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl">
                <div className="flex justify-center mb-8">
                  <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                    {[{id: "create", label: "Create Battle", icon: Sword}, {id: "join", label: "Join Battle", icon: Users}].map(tab => (
                      <Button key={tab.id} variant={quickBattleJoining ? "ghost" : "default"} className={`rounded-xl px-8 py-3 transition-all duration-300 flex items-center space-x-2 ${quickBattleJoining === (tab.id === "join") ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105"}`} onClick={() => setQuickBattleJoining(tab.id === "join")}><tab.icon className="w-5 h-5" /><span className="font-semibold">{tab.label}</span></Button>
                    ))}
                  </div>
                </div>
                {quickBattleJoining ? (
                  <div className="space-y-8">
                    <div><label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Enter Invitation Code:</label><input type="text" className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 uppercase" value={quickBattleInviteCode} onChange={(e) => setQuickBattleInviteCode(e.target.value.toUpperCase())} placeholder="Enter 6-character code" maxLength={6} /></div>
                    {quickBattleError && <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">{quickBattleError}</div>}
                    <div className="text-center"><Button onClick={handleJoinQuickBattle} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" disabled={quickBattleInviteCode.length !== 6}><Users className="w-6 h-6 mr-3" />Join Battle<ArrowRight className="w-6 h-6 ml-3" /></Button></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div><label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Subject:</label><select className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-3 text-lg font-medium bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200" value={quickBattleSubject} onChange={(e) => setQuickBattleSubject(e.target.value as Subject)} title="Select subject">{["Mathematics", "Science", "Programming", "History", "Geography"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Difficulty:</label><div className="space-y-3"><input type="range" min={0} max={3} value={["easy", "medium", "hard", "very hard"].indexOf(quickBattleDifficulty)} onChange={(e) => setQuickBattleDifficulty(["easy", "medium", "hard", "very hard"][parseInt(e.target.value)] as Difficulty)} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" title="Select difficulty" /><div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">{["Easy", "Medium", "Hard", "Expert"].map(d => <span key={d}>{d}</span>)}</div><div className="text-center"><Badge variant={quickBattleDifficulty === "easy" ? "secondary" : quickBattleDifficulty === "medium" ? "default" : "destructive"} className="text-lg px-4 py-2 font-bold">{quickBattleDifficulty.charAt(0).toUpperCase() + quickBattleDifficulty.slice(1)}</Badge></div></div></div>
                    </div>
                    {quickBattleError && <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">{quickBattleError}</div>}
                    <div className="text-center"><Button onClick={handleCreateQuickBattle} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"><Sword className="w-6 h-6 mr-3" />Create Battle<ArrowRight className="w-6 h-6 ml-3" /></Button></div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
                {quickBattleStatus?.isReady ? (
                  <div className="space-y-8">
                    <div className="text-4xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text mb-4">Battle Ready! Starting soon...</div>
                    <div className="flex justify-center space-x-8">{quickBattleStatus.participants.map((participant: any, index: number) => (<div key={index} className="text-center"><Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white dark:ring-slate-800 shadow-xl"><AvatarFallback className={`bg-gradient-to-br ${index === 0 ? "from-blue-400 to-blue-600" : "from-red-400 to-red-600"} text-white font-bold text-2xl`}>{participant.profiles.username?.substring(0, 2).toUpperCase() || "P"}</AvatarFallback></Avatar><div className="font-bold text-lg text-gray-900 dark:text-white">{participant.profiles.username || "Player"}</div></div>))}</div>
                    <div className="animate-pulse"><div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 rounded-full px-6 py-3"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div><span className="text-green-700 dark:text-green-300 font-bold">Preparing battle...</span></div></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">Waiting for Opponent</div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 mb-8">
                      <div className="text-2xl font-black text-red-600 dark:text-red-400 mb-4">Share this invitation code with your opponent:</div>
                      <div className="flex justify-center"><div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl border-2 border-red-300 dark:border-red-700 text-4xl font-black tracking-widest text-red-600 dark:text-red-400 shadow-lg">{quickBattleInviteCode}</div></div>
                    </div>
                    <div className="animate-pulse"><div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-6 py-3"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div><span className="text-yellow-700 dark:text-yellow-300 font-bold">Waiting for opponent to join...</span></div></div>
                    <Button variant="outline" className="mt-4" onClick={() => { setQuickBattleActive(false); setQuickBattleCreated(false); setQuickBattleId(null); setQuickBattleInviteCode(""); setQuickBattleStatus(null); }}>Cancel Battle</Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {quickBattleActive && quickBattleStarted && quickBattleQuestions.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-xl">
              <div className="flex items-center justify-between mb-4"><div className="flex items-center space-x-3"><Timer className="w-5 h-5 text-red-600" /><span className="font-bold text-gray-900 dark:text-white">Question {quickBattleCurrent + 1} of {quickBattleQuestions.length}</span></div></div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500 rounded-full" style={{width: getProgressWidth(quickBattleCurrent, quickBattleQuestions.length)}}></div></div>
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
                    <button key={idx} className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${quickBattleUserAnswers[quickBattleCurrent] === opt ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"}`} onClick={() => {
                      const isCorrect = opt === quickBattleQuestions[quickBattleCurrent].answer;
                      const newAnswers = [...quickBattleUserAnswers]; newAnswers[quickBattleCurrent] = opt; setQuickBattleUserAnswers(newAnswers);
                      setTimeout(() => {
                        if (quickBattleCurrent + 1 === quickBattleQuestions.length) {
                          let score = 0; newAnswers.forEach((ans, idx) => { if (ans === quickBattleQuestions[idx].answer) score += getScore(quickBattleQuestions[idx].difficulty); });
                          setQuickBattleScore(score); setQuickBattleStarted(false); setQuickBattleShowResult(true);
                        } else setQuickBattleCurrent(quickBattleCurrent + 1);
                      }, 1000);
                    }}><span className="flex-1 text-left">{opt}</span></button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {quickBattleActive && !quickBattleStarted && quickBattleShowResult && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl text-center">
              <div className="space-y-8">
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text mb-4">Battle Complete!</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Your Score: {quickBattleScore}</div>
                <div className="text-center"><Button onClick={() => { setQuickBattleActive(false); setQuickBattleCreated(false); setQuickBattleId(null); setQuickBattleInviteCode(""); setQuickBattleStatus(null); setQuickBattleQuestions([]); setQuickBattleUserAnswers([]); setQuickBattleScore(0); }} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"><Play className="w-6 h-6 mr-3" />Play Again</Button></div>
              </div>
            </Card>
          </div>
        )}

        <ChallengeForm open={showChallengeForm} onOpenChange={setShowChallengeForm} onChallengeCreated={async () => { try { const { data } = await ChallengeService.getActiveChallenges(); if (data) setActiveChallenges(data); } catch (err) { console.error("Error refreshing challenges:", err); } }} />
      </div>
    </div>
  );
}