import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Clock, Plus, Loader2, ArrowRight, Gift, Award, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ChallengeService, type Challenge } from "@/services/challenge.service";
import { ChallengeForm } from "@/components/Arena/ChallengeForm";

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

export const ChallengesTab = () => {
  const { session } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChallenges, setUserChallenges] = useState<Record<string, any>>({});
  const [showChallengeForm, setShowChallengeForm] = useState(false);

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
          if (session?.user) {
            const { data: userParticipations } = await ChallengeService.getUserChallenges(session.user.id);
            if (userParticipations) {
              setUserChallenges(userParticipations.reduce((acc, participation) => {
                acc[participation.challenge_id] = participation;
                return acc;
              }, {} as Record<string, any>));
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

  const handleJoinChallenge = async (challengeId: string) => {
    if (!session?.user) return;
    try {
      const { data, error } = await ChallengeService.joinChallenge(challengeId, session.user.id);
      if (error) {
        console.error("Error joining challenge:", error);
      } else if (data) {
        setUserChallenges(prev => ({ ...prev, [challengeId]: data }));
      }
    } catch (err) {
      console.error("Exception in handleJoinChallenge:", err);
    }
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Active Challenges</h2>
              <p className="text-gray-600 dark:text-gray-400">Join the competition and earn rewards</p>
            </div>
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3" onClick={() => setShowChallengeForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Challenge
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading challenges...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : activeChallenges.length === 0 ? (
            <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-lg p-6">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Challenges</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">There are no active challenges at the moment. Be the first to create one!</p>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500" onClick={() => setShowChallengeForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Challenge
              </Button>
            </div>
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
                      <Button className={`w-full py-4 text-lg font-bold transition-all duration-300 ${userParticipation ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl" : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-xl hover:scale-105"}`} onClick={() => userParticipation ? console.log("Continue challenge") : handleJoinChallenge(challenge.id)}>
                        {userParticipation ? "Continue Challenge" : "Join Challenge"}
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm shadow-xl">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3"><TrendingUp className="w-4 h-4 text-white" /></div>
              This Week
            </h3>
            <div className="space-y-4">
              {[{label: "Challenges Won", icon: Award, color: "green", value: "12"}, {label: "XP Earned", icon: Star, color: "yellow", value: "2,450"}, {label: "Rank Change", icon: TrendingUp, color: "green", value: "+3"}].map((stat, i) => (
                <div key={i} className={`flex justify-between items-center p-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-lg`}>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</span>
                  <div className="flex items-center space-x-2">
                    <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                    <span className={`font-black text-gray-900 dark:text-white text-lg ${stat.label === "Rank Change" ? `text-${stat.color}-600` : ""}`}>{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <ChallengeForm open={showChallengeForm} onOpenChange={setShowChallengeForm} onChallengeCreated={async () => {
        try {
          const { data } = await ChallengeService.getActiveChallenges();
          if (data) setActiveChallenges(data);
        } catch (err) {
          console.error("Error refreshing challenges:", err);
        }
      }} />
    </>
  );
};
