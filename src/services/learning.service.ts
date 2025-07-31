import { supabase } from "@/lib/supabase";

export interface LearningPath {
  id?: string;
  title: string;
  description?: string;
  subject: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  estimated_hours?: number;
  prerequisites?: string[];
  lessons: any[];
  is_featured?: boolean;
  created_by?: string;
  created_at?: string;
}

export const LearningService = {
  getLearningPaths: async (limit = 10) => {
    return await supabase.from("learning_paths").select("*").limit(limit);
  },

  getLearningPathById: async (pathId: string) => {
    return await supabase
      .from("learning_paths")
      .select("*")
      .eq("id", pathId)
      .single();
  },

  getLearningPathsBySubject: async (subject: string, limit = 10) => {
    return await supabase
      .from("learning_paths")
      .select("*")
      .eq("subject", subject)
      .limit(limit);
  },

  getFeaturedLearningPaths: async (limit = 10) => {
    return await supabase
      .from("learning_paths")
      .select("*")
      .eq("is_featured", true)
      .limit(limit);
  },

  createLearningPath: async (path: LearningPath) => {
    // Ensure prerequisites is an array
    if (!path.prerequisites) {
      path.prerequisites = [];
    }

    // Ensure lessons is a valid JSON array
    if (!path.lessons || !Array.isArray(path.lessons)) {
      path.lessons = [];
    }

    console.log("Creating learning path:", path);

    return await supabase.from("learning_paths").insert(path).select().single();
  },

  updateLearningPath: async (
    pathId: string,
    updates: Partial<LearningPath>
  ) => {
    return await supabase
      .from("learning_paths")
      .update(updates)
      .eq("id", pathId)
      .select()
      .single();
  },

  deleteLearningPath: async (pathId: string) => {
    return await supabase.from("learning_paths").delete().eq("id", pathId);
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
