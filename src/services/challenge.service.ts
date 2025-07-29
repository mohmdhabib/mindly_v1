import { supabase } from "@/lib/supabase";

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  challenge_type: "daily" | "weekly" | "tournament" | "duel";
  subject?: string;
  difficulty_level?: string;
  start_date?: string;
  end_date?: string;
  max_participants?: number;
  xp_reward: number;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  participant_count?: number; // Calculated field
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  score: number;
  completion_time?: number; // in seconds
  completed_at?: string;
  joined_at: string;
}

export const ChallengeService = {
  // Get all active challenges
  getActiveChallenges: async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select(
          `
          *,
          participant_count: challenge_participations(count)
        `
        )
        .eq("is_active", true)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching active challenges:", error);
        return { data: null, error };
      }

      // Format the participant count
      const formattedData = data?.map((challenge) => ({
        ...challenge,
        participant_count: challenge.participant_count[0]?.count || 0,
      }));

      return { data: formattedData, error: null };
    } catch (err) {
      console.error("Exception in getActiveChallenges:", err);
      return { data: null, error: err };
    }
  },

  // Get a specific challenge by ID
  getChallengeById: async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select(
          `
          *,
          participant_count: challenge_participations(count)
        `
        )
        .eq("id", challengeId)
        .single();

      if (error) {
        console.error("Error fetching challenge:", error);
        return { data: null, error };
      }

      // Format the participant count
      const formattedData = {
        ...data,
        participant_count: data.participant_count[0]?.count || 0,
      };

      return { data: formattedData, error: null };
    } catch (err) {
      console.error("Exception in getChallengeById:", err);
      return { data: null, error: err };
    }
  },

  // Create a new challenge
  createChallenge: async (challenge: Omit<Challenge, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .insert(challenge)
        .select()
        .single();

      if (error) {
        console.error("Error creating challenge:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in createChallenge:", err);
      return { data: null, error: err };
    }
  },

  // Update an existing challenge
  updateChallenge: async (challengeId: string, updates: Partial<Challenge>) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .update(updates)
        .eq("id", challengeId)
        .select()
        .single();

      if (error) {
        console.error("Error updating challenge:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateChallenge:", err);
      return { data: null, error: err };
    }
  },

  // Delete a challenge
  deleteChallenge: async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .delete()
        .eq("id", challengeId);

      if (error) {
        console.error("Error deleting challenge:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in deleteChallenge:", err);
      return { data: null, error: err };
    }
  },

  // Join a challenge
  joinChallenge: async (challengeId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenge_participations")
        .insert({
          challenge_id: challengeId,
          user_id: userId,
          score: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Error joining challenge:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in joinChallenge:", err);
      return { data: null, error: err };
    }
  },

  // Update participation (e.g., update score, mark as completed)
  updateParticipation: async (
    participationId: string,
    updates: Partial<ChallengeParticipation>
  ) => {
    try {
      const { data, error } = await supabase
        .from("challenge_participations")
        .update(updates)
        .eq("id", participationId)
        .select()
        .single();

      if (error) {
        console.error("Error updating participation:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateParticipation:", err);
      return { data: null, error: err };
    }
  },

  // Get user's challenge participations
  getUserChallenges: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenge_participations")
        .select(
          `
          *,
          challenge:challenges(*)
        `
        )
        .eq("user_id", userId)
        .order("joined_at", { ascending: false });

      if (error) {
        console.error("Error fetching user challenges:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getUserChallenges:", err);
      return { data: null, error: err };
    }
  },

  // Get challenge leaderboard
  getChallengeLeaderboard: async (challengeId: string, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from("challenge_participations")
        .select(
          `
          *,
          user:profiles!user_id(id, username, full_name, avatar_url, total_xp, current_level)
        `
        )
        .eq("challenge_id", challengeId)
        .order("score", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching challenge leaderboard:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getChallengeLeaderboard:", err);
      return { data: null, error: err };
    }
  },
};
