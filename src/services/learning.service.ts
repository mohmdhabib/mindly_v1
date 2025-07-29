import { supabase } from "@/lib/supabase";

export const LearningService = {
  getLearningPaths: async (limit = 10) => {
    return await supabase.from("learning_paths").select("*").limit(limit);
  },

  getUserProgress: async (userId: string, limit = 10) => {
    return await supabase
      .from("user_progress")
      .select("*, learning_paths(*)")
      .eq("user_id", userId)
      .order("last_accessed", { ascending: false })
      .limit(limit);
  },

  updateUserProgress: async (userId: string, pathId: string, updates: any) => {
    return await supabase
      .from("user_progress")
      .update(updates)
      .eq("user_id", userId)
      .eq("path_id", pathId);
  },
};
