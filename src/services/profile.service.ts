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
  learning_preferences?: Record<string, string | number | boolean>;
  created_at?: string;
  updated_at?: string;
}

// Utility to get ISO timestamp
const nowISO = () => new Date().toISOString();

export const ProfileService = {
  getProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getProfile:", err);
      return { data: null, error: err };
    }
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    try {
      const updatesWithTimestamp = {
        ...updates,
        updated_at: nowISO(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updatesWithTimestamp)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateProfile:", err);
      return { data: null, error: err };
    }
  },

  // Enhanced profile creation with better RLS handling
  createProfile: async (profile: Profile) => {
    try {
      // First verify we have a valid session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("No valid session for profile creation:", sessionError);
        return {
          data: null,
          error: {
            code: "NO_SESSION",
            message: "User must be authenticated to create profile",
          },
        };
      }

      // Verify the user ID matches the session
      if (session.user.id !== profile.id) {
        console.error("User ID mismatch in profile creation");
        return {
          data: null,
          error: {
            code: "USER_MISMATCH",
            message: "Profile ID must match authenticated user ID",
          },
        };
      }

      // Ensure the profile has the required timestamps
      const profileWithTimestamps = {
        ...profile,
        created_at: profile.created_at || nowISO(),
        updated_at: profile.updated_at || nowISO(),
      };

      console.log("Creating profile with session user ID:", session.user.id);
      console.log("Profile data:", profileWithTimestamps);

      const { data, error } = await supabase
        .from("profiles")
        .insert([profileWithTimestamps])
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);

        // Handle specific RLS errors
        if (error.code === "42501") {
          console.error(
            "RLS Policy Error: Check your RLS policies and ensure user is authenticated"
          );
          return {
            data: null,
            error: {
              ...error,
              message:
                "Permission denied: Unable to create profile. Please check authentication and RLS policies.",
            },
          };
        }

        return { data: null, error };
      }

      console.log("✅ Profile created successfully:", data);
      return { data, error: null };
    } catch (err) {
      console.error("Exception in createProfile:", err);
      return { data: null, error: err };
    }
  },

  updateLastActive: async (userId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const { data, error } = await supabase
        .from("profiles")
        .update({
          last_active_date: today,
          updated_at: nowISO(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating last active:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateLastActive:", err);
      return { data: null, error: err };
    }
  },

  updateStreak: async (userId: string, currentStreak: number) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          streak_count: currentStreak,
          updated_at: nowISO(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating streak:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateStreak:", err);
      return { data: null, error: err };
    }
  },

  updateXP: async (userId: string, xpToAdd: number) => {
    try {
      // First get current profile to calculate new values
      const { data: currentProfile, error: getError } =
        await ProfileService.getProfile(userId);

      if (getError || !currentProfile) {
        throw new Error("Could not fetch current profile for XP update");
      }

      const newTotalXP = (currentProfile.total_xp || 0) + xpToAdd;
      const newLevel = Math.floor(newTotalXP / 1000) + 1; // Simple leveling: 1000 XP per level

      const { data, error } = await supabase
        .from("profiles")
        .update({
          total_xp: newTotalXP,
          current_level: newLevel,
          updated_at: nowISO(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating XP:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateXP:", err);
      return { data: null, error: err };
    }
  },

  deleteProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting profile:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in deleteProfile:", err);
      return { data: null, error: err };
    }
  },

  // FIXED: Enhanced method with better session handling and RLS compliance
  getOrCreateProfile: async (
    userId: string,
    maxRetries: number = 3, // Reduced retries for better UX
    retryDelay: number = 1000
  ) => {
    try {
      // Verify session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("❌ No valid session available");
        return {
          data: null,
          error: {
            code: "NO_SESSION",
            message: "Authentication required",
          },
        };
      }

      if (session.user.id !== userId) {
        console.error("❌ User ID mismatch");
        return {
          data: null,
          error: {
            code: "USER_MISMATCH",
            message: "User ID does not match session",
          },
        };
      }

      // First attempt to get the profile
      console.log("🔍 Checking for existing profile...");
      const { data: existingProfile, error: getError } =
        await ProfileService.getProfile(userId);

      if (existingProfile) {
        console.log("✅ Found existing profile:", existingProfile);
        return { data: existingProfile, error: null };
      }

      if (getError) {
        console.error("❌ Error fetching profile:", getError);
      }

      // Profile doesn't exist, wait a bit for potential trigger creation
      console.log(
        "⏳ Profile not found, checking if trigger is creating it..."
      );

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries}`);

        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        const { data: profile, error } = await ProfileService.getProfile(
          userId
        );

        if (profile) {
          console.log("✅ Profile found after waiting:", profile);
          return { data: profile, error: null };
        }

        if (error) {
          console.error(`❌ Error on retry ${attempt}:`, error);
        }
      }

      // Still no profile, create manually as fallback
      console.log("📝 Creating profile manually...");
      return await ProfileService.createProfileWithAuth(userId, session);
    } catch (err) {
      console.error("💥 Exception in getOrCreateProfile:", err);
      return { data: null, error: err };
    }
  },

  // NEW: Create profile with authenticated session
  createProfileWithAuth: async (userId: string, session: any) => {
    try {
      const user = session.user;
      const username = user.email?.split("@")[0] || "User";

      const newProfile: Profile = {
        id: userId,
        username,
        full_name: user.user_metadata?.full_name || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        learning_level: "beginner",
        total_xp: 0,
        current_level: 1,
        streak_count: 0,
        streak_freeze_count: 3,
        last_active_date: new Date().toISOString().split("T")[0],
        learning_preferences: {},
        created_at: nowISO(),
        updated_at: nowISO(),
      };

      console.log("🔧 Creating profile with authenticated session");
      console.log("User from session:", { id: user.id, email: user.email });
      console.log("Profile to create:", newProfile);

      const { data, error } = await supabase
        .from("profiles")
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating authenticated profile:", error);

        // Better RLS error handling
        if (error.code === "42501") {
          console.error("🚫 RLS Policy violation. Possible causes:");
          console.error("1. RLS is enabled but no INSERT policy exists");
          console.error("2. INSERT policy doesn't allow this user");
          console.error("3. Session is invalid or expired");

          return {
            data: null,
            error: {
              ...error,
              message:
                "Profile creation blocked by security policy. Please contact support if this persists.",
              code: "RLS_VIOLATION",
            },
          };
        }

        return { data: null, error };
      }

      console.log("✅ Authenticated profile created successfully:", data);
      return { data, error: null };
    } catch (err) {
      console.error("💥 Exception in createProfileWithAuth:", err);
      return { data: null, error: err };
    }
  },

  // LEGACY: Keep for backward compatibility but with better error handling
  createProfileFallback: async (userId: string) => {
    try {
      console.log("⚠️ Using legacy createProfileFallback method");

      // Get fresh session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("❌ No session in fallback method");
        return {
          data: null,
          error: {
            code: "NO_SESSION",
            message: "Cannot create profile without authentication",
          },
        };
      }

      return await ProfileService.createProfileWithAuth(userId, session);
    } catch (err) {
      console.error("💥 Exception in createProfileFallback:", err);
      return { data: null, error: err };
    }
  },

  // NEW: Validate session and user permissions
  validateSession: async (userId: string) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return { valid: false, session: null, error: sessionError };
      }

      if (!session) {
        console.error("No active session");
        return {
          valid: false,
          session: null,
          error: { message: "No active session" },
        };
      }

      if (session.user.id !== userId) {
        console.error("User ID mismatch in session validation");
        return {
          valid: false,
          session: null,
          error: { message: "User ID mismatch" },
        };
      }

      return { valid: true, session, error: null };
    } catch (err) {
      console.error("Exception in validateSession:", err);
      return { valid: false, session: null, error: err };
    }
  },

  // Helper method to check if user has permission to create profile
  checkProfilePermissions: async (userId: string) => {
    try {
      const validation = await ProfileService.validateSession(userId);

      if (!validation.valid) {
        return { hasPermission: false, error: validation.error };
      }

      return { hasPermission: true, error: null, session: validation.session };
    } catch (err) {
      console.error("Exception checking profile permissions:", err);
      return { hasPermission: false, error: err };
    }
  },

  // Helper method to check if profile exists
  profileExists: async (userId: string): Promise<boolean> => {
    try {
      const { data } = await ProfileService.getProfile(userId);
      return data !== null;
    } catch {
      return false;
    }
  },

  // Batch update multiple profile fields
  batchUpdateProfile: async (userId: string, updates: Partial<Profile>) => {
    try {
      const updatesWithTimestamp = {
        ...updates,
        updated_at: nowISO(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(updatesWithTimestamp)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error batch updating profile:", error);
        return { data: null, error };
      }

      console.log("✅ Profile batch updated successfully:", data);
      return { data, error: null };
    } catch (err) {
      console.error("Exception in batchUpdateProfile:", err);
      return { data: null, error: err };
    }
  },

  // Get multiple profiles (useful for leaderboards, etc.)
  getMultipleProfiles: async (userIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (error) {
        console.error("Error fetching multiple profiles:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getMultipleProfiles:", err);
      return { data: null, error: err };
    }
  },

  // Get profiles by learning level (for community features)
  getProfilesByLearningLevel: async (learningLevel: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("learning_level", learningLevel)
        .order("total_xp", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching profiles by learning level:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getProfilesByLearningLevel:", err);
      return { data: null, error: err };
    }
  },

  // Get top profiles for leaderboard
  getTopProfiles: async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, total_xp, current_level, avatar_url")
        .order("total_xp", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching top profiles:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in getTopProfiles:", err);
      return { data: null, error: err };
    }
  },

  // Update learning preferences
  updateLearningPreferences: async (
    userId: string,
    preferences: Record<string, string | number | boolean>
  ) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          learning_preferences: preferences,
          updated_at: nowISO(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating learning preferences:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in updateLearningPreferences:", err);
      return { data: null, error: err };
    }
  },

  // Calculate and update streak
  calculateAndUpdateStreak: async (userId: string) => {
    try {
      const { data: profile, error: getError } =
        await ProfileService.getProfile(userId);

      if (getError || !profile) {
        throw new Error("Could not fetch profile for streak calculation");
      }

      const today = new Date().toISOString().split("T")[0];
      const lastActiveDate = profile.last_active_date;

      if (!lastActiveDate) {
        // First time active, start streak at 1
        return await ProfileService.updateStreak(userId, 1);
      }

      const lastActive = new Date(lastActiveDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastActive.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = profile.streak_count || 0;

      if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else if (diffDays > 1) {
        // Missed days, reset streak
        newStreak = 1;
      }
      // If diffDays === 0, same day, keep current streak

      // Update both streak and last active date
      const { data, error } = await supabase
        .from("profiles")
        .update({
          streak_count: newStreak,
          last_active_date: today,
          updated_at: nowISO(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error calculating and updating streak:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Exception in calculateAndUpdateStreak:", err);
      return { data: null, error: err };
    }
  },
};
