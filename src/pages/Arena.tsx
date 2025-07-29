import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Zap,
  Users,
  Clock,
  Star,
  Sword,
  Target,
  Medal,
  Crown,
  Siren as Fire,
  TrendingUp,
  Calendar,
  Play,
  Plus,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ChallengeService, type Challenge } from "@/services/challenge.service";
import { ProfileService } from "@/services/profile.service";
import { ChallengeForm } from "@/components/Arena/ChallengeForm";
import { useNavigate } from "react-router-dom";

export function Arena() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("challenges");
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChallenges, setUserChallenges] = useState<Record<string, any>[]>(
    []
  );
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const navigate = useNavigate();

  // Fetch challenges when component mounts
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await ChallengeService.getActiveChallenges();

        if (error) {
          setError("Failed to load challenges");
          console.error("Error loading challenges:", error);
        } else if (data) {
          setActiveChallenges(data);

          // If user is logged in, fetch their challenge participations
          if (session?.user) {
            const { data: userParticipations } =
              await ChallengeService.getUserChallenges(session.user.id);
            if (userParticipations) {
              // Create a map of challenge ID to participation data
              const userChallengesMap = userParticipations.reduce(
                (acc, participation) => {
                  acc[participation.challenge_id] = participation;
                  return acc;
                },
                {}
              );
              setUserChallenges(userChallengesMap);
            }
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Exception in fetchChallenges:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [session]);

  const leaderboard = [
    { rank: 1, name: "Alex Chen", xp: 15420, avatar: "AC", badge: "crown" },
    { rank: 2, name: "Sarah Kim", xp: 14890, avatar: "SK", badge: "medal" },
    { rank: 3, name: "Mike Johnson", xp: 14250, avatar: "MJ", badge: "medal" },
    { rank: 4, name: "Emma Davis", xp: 13800, avatar: "ED", badge: null },
    {
      rank: 5,
      name: "You",
      xp: 12450,
      avatar: "YU",
      badge: null,
      isUser: true,
    },
  ];

  const battleModes = [
    {
      title: "1v1 Quick Battle",
      description: "Challenge another learner to a head-to-head quiz",
      icon: Sword,
      color: "from-red-500 to-pink-600",
      action: "Find Opponent",
    },
    {
      title: "Team Challenge",
      description: "Join a team and compete against other groups",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      action: "Join Team",
    },
    {
      title: "Quiz Duel",
      description: "Fast-paced questions with real-time scoring",
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
      action: "Start Duel",
    },
    {
      title: "Study Marathon",
      description: "Long-form learning session with rewards",
      icon: Target,
      color: "from-green-500 to-emerald-600",
      action: "Begin Marathon",
    },
  ];

  const userStats = {
    rank: 5,
    xp: 12450,
    level: 23,
    winRate: 78,
    streak: 7,
  };

  // Handle joining a challenge
  const handleJoinChallenge = async (challengeId: string) => {
    if (!session?.user) {
      // Handle not logged in state
      return;
    }

    try {
      const { data, error } = await ChallengeService.joinChallenge(
        challengeId,
        session.user.id
      );

      if (error) {
        console.error("Error joining challenge:", error);
        // Show error notification
      } else if (data) {
        // Update local state to reflect the user has joined
        setUserChallenges((prev) => ({
          ...prev,
          [challengeId]: data,
        }));
        // Show success notification
      }
    } catch (err) {
      console.error("Exception in handleJoinChallenge:", err);
      // Show error notification
    }
  };

  // Handle creating a new challenge
  const handleCreateChallenge = () => {
    setShowChallengeForm(true);
  };

  // Handle challenge created event
  const handleChallengeCreated = async () => {
    // Refresh the challenges list
    try {
      const { data } = await ChallengeService.getActiveChallenges();
      if (data) {
        setActiveChallenges(data);
      }
    } catch (err) {
      console.error("Error refreshing challenges:", err);
    }
  };

  // Handle navigating to challenge detail page
  const handleViewChallenge = (challengeId: string) => {
    navigate(`/arena/challenge/${challengeId}`);
  };

  // Calculate time remaining for a challenge
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 dark:border-yellow-400/30 mb-6 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Competitive Learning Arena
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Learning Arena 🏆
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Challenge yourself and others with competitive learning activities
            and earn rewards.
          </p>
        </div>

        {/* User Stats Bar */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-yellow-500">
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                  {session?.user?.email?.substring(0, 2).toUpperCase() || "GU"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {session?.user?.email?.split("@")[0] || "Guest User"}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>Level {userStats.level}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rank
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    #{userStats.rank}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    XP
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {userStats.xp.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Win Rate
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {userStats.winRate}%
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Fire className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Streak
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {userStats.streak} days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0">
            {[
              { id: "challenges", label: "Challenges" },
              { id: "leaderboard", label: "Leaderboard" },
              { id: "battle", label: "Battle Modes" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "challenges" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Active Challenges */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Active Challenges
                </h2>
                <Button
                  className="bg-gradient-to-r from-mindly-primary to-mindly-accent"
                  onClick={handleCreateChallenge}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-mindly-primary" />
                  <span className="ml-2 text-gray-600 dark:text-gray-300">
                    Loading challenges...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : activeChallenges.length === 0 ? (
                <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-lg p-6">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Active Challenges
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    There are no active challenges at the moment. Be the first
                    to create one!
                  </p>
                  <Button
                    className="bg-gradient-to-r from-mindly-primary to-mindly-accent"
                    onClick={handleCreateChallenge}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeChallenges.map((challenge) => {
                    const userParticipation = userChallenges[challenge.id];
                    const progress = userParticipation
                      ? (userParticipation.score / 100) * 100
                      : 0;

                    return (
                      <Card
                        key={challenge.id}
                        className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {challenge.title}
                              </h3>
                              <Badge
                                variant={
                                  challenge.difficulty_level === "Easy"
                                    ? "secondary"
                                    : challenge.difficulty_level === "Medium"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {challenge.difficulty_level || "Medium"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {challenge.description ||
                                "Complete this challenge to earn XP and improve your ranking."}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {challenge.participant_count || 0} participants
                              </div>
                              <div className="flex items-center">
                                <Zap className="w-4 h-4 mr-1" />
                                {challenge.xp_reward} XP
                              </div>
                              {challenge.end_date && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {getTimeRemaining(challenge.end_date)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {progress > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-300">
                                Progress
                              </span>
                              <span className="text-gray-600 dark:text-gray-300">
                                {progress}%
                              </span>
                            </div>
                            <Progress value={progress} />
                          </div>
                        )}
                        
                        <Button
                          className={`w-full ${
                            userParticipation
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                          }`}
                          onClick={() => handleViewChallenge(challenge.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {userParticipation
                            ? "Continue Challenge"
                            : "View Challenge"}
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-mindly-primary" />
                  This Week
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Challenges Won
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      12
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      XP Earned
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      2,450
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Rank Change
                    </span>
                    <span className="font-semibold text-green-600">+3</span>
                  </div>
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-mindly-accent" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Weekly Tournament
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Starts in 2 days
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Math Championship
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Next Monday
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Global Leaderboard
              </h2>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                      user.isUser
                        ? "bg-gradient-to-r from-mindly-primary/10 to-mindly-accent/10 border border-mindly-primary/20"
                        : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                            ? "bg-gray-400 text-white"
                            : user.rank === 3
                            ? "bg-amber-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.rank}
                      </div>
                      {user.badge === "crown" && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                      {user.badge === "medal" && (
                        <Medal className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <Avatar className="w-10 h-10">
                      <AvatarFallback
                        className={`font-semibold ${
                          user.isUser
                            ? "bg-mindly-primary text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div
                        className={`font-semibold ${
                          user.isUser
                            ? "text-mindly-primary"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.xp.toLocaleString()} XP
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Level {Math.floor(user.xp / 500)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "battle" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Choose Your Battle Mode
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {battleModes.map((mode, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 overflow-hidden"
                >
                  <div className={`h-4 bg-gradient-to-r ${mode.color}`}></div>
                  <div className="p-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${mode.color} rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {mode.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {mode.description}
                    </p>
                    <Button
                      className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-lg transition-all duration-200`}
                    >
                      {mode.action}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Form Dialog */}
        <ChallengeForm
          open={showChallengeForm}
          onOpenChange={setShowChallengeForm}
          onChallengeCreated={handleChallengeCreated}
        />
      </div>
    </div>
  );
}
