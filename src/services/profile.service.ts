import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  learning_level?: string;
  total_xp?: number;
  current_level?: number;
  streak_count?: number;
  streak_freeze_count?: number;
  last_active_date?: string;
  learning_preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const ProfileService = {
  getProfile: async (userId: string) => {
    return await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    // Add updated_at timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return await supabase
      .from("profiles")
      .update(updatesWithTimestamp)
      .eq("id", userId);
  },

  createProfile: async (profile: Profile) => {
    return await supabase.from("profiles").insert([profile]);
  },

  updateLastActive: async (userId: string) => {
    // Update the last_active_date to today
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    return await supabase
      .from("profiles")
      .update({ last_active_date: today, updated_at: new Date().toISOString() })
      .eq("id", userId);
  },

  updateStreak: async (userId: string, currentStreak: number) => {
    return await supabase
      .from("profiles")
      .update({
        streak_count: currentStreak,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  },
};
