import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Zap,
  Users,
  Clock,
  ArrowLeft,
  Play,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ChallengeService, type Challenge } from "@/services/challenge.service";
import { useToast } from "@/hooks/use-toast";

export function StartChallenge() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userParticipation, setUserParticipation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenge details when component mounts
  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (!challengeId) {
        setError("Challenge ID is missing");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch challenge details
        const { data: challengeData, error: challengeError } = 
          await ChallengeService.getChallengeById(challengeId);

        if (challengeError) {
          setError("Failed to load challenge details");
          console.error("Error loading challenge:", challengeError);
          return;
        }

        if (!challengeData) {
          setError("Challenge not found");
          return;
        }

        setChallenge(challengeData);

        // If user is logged in, check if they've already joined this challenge
        if (session?.user) {
          const { data: userParticipations } = 
            await ChallengeService.getUserChallenges(session.user.id);
          
          if (userParticipations) {
            const participation = userParticipations.find(
              (p) => p.challenge_id === challengeId
            );
            if (participation) {
              setUserParticipation(participation);
            }
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Exception in fetchChallengeDetails:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [challengeId, session]);

  // Handle joining a challenge
  const handleJoinChallenge = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to join a challenge",
        variant: "destructive",
      });
      return;
    }

    if (!challenge) return;

    setIsJoining(true);

    try {
      const { data, error } = await ChallengeService.joinChallenge(
        challenge.id,
        session.user.id
      );

      if (error) {
        console.error("Error joining challenge:", error);
        toast({
          title: "Error",
          description: "Failed to join challenge. Please try again.",
          variant: "destructive",
        });
      } else if (data) {
        setUserParticipation(data);
        toast({
          title: "Success",
          description: "You have successfully joined the challenge!",
        });
      }
    } catch (err) {
      console.error("Exception in handleJoinChallenge:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Handle starting or continuing a challenge
  const handleStartChallenge = () => {
    // This would navigate to the actual challenge content/questions
    toast({
      title: "Challenge Started",
      description: "Good luck with your challenge!",
    });
    // For now, we'll just show a toast, but in a real app, you'd navigate to the challenge content
    // navigate(`/challenge/${challengeId}/play`);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => navigate("/arena")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Arena
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-mindly-primary" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading challenge...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-lg p-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => navigate("/arena")}
            >
              Return to Arena
            </Button>
          </div>
        ) : challenge ? (
          <Card className="p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {challenge.title}
              </h1>
              <Badge
                variant={
                  challenge.difficulty_level === "Easy"
                    ? "secondary"
                    : challenge.difficulty_level === "Medium"
                    ? "default"
                    : "destructive"
                }
              >
                {challenge.difficulty_level || "Medium"}
              </Badge>
            </div>

            <div className="mb-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {challenge.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Participants
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {challenge.participant_count || 0}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      XP Reward
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {challenge.xp_reward}
                  </p>
                </div>

                {challenge.end_date && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Time Remaining
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getTimeRemaining(challenge.end_date)}
                    </p>
                  </div>
                )}
              </div>

              {userParticipation && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Your Progress
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {userParticipation.score || 0}%
                    </span>
                  </div>
                  <Progress value={userParticipation.score || 0} />
                </div>
              )}

              <Button
                className={`w-full py-6 text-lg ${
                  userParticipation
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                }`}
                onClick={
                  userParticipation ? handleStartChallenge : handleJoinChallenge
                }
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {userParticipation ? "Continue Challenge" : "Join Challenge"}
                  </>
                )}
              </Button>
            </div>

            {/* Additional sections could be added here, such as:
            - Leaderboard for this challenge
            - Rules or instructions
            - Related challenges
            */}
          </Card>
        ) : (
          <div className="text-center py-12 bg-white/80 dark:bg-gray-900/80 rounded-lg p-6">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Challenge Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The challenge you're looking for doesn't exist or has been removed.
            </p>
            <Button
              className="bg-gradient-to-r from-mindly-primary to-mindly-accent"
              onClick={() => navigate("/arena")}
            >
              Return to Arena
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}