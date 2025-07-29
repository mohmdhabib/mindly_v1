import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthService } from "@/services/auth.service";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthWrapper = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔧 AuthWrapper: useEffect triggered");

    // Initial session check
    const getInitialSession = async () => {
      console.log("🔍 AuthWrapper: Getting initial session...");

      try {
        // Try direct Supabase call first
        const {
          data: { session: directSession },
          error,
        } = await supabase.auth.getSession();

        console.log("📊 AuthWrapper: Direct session check:", {
          session: directSession,
          error,
          hasUser: !!directSession?.user,
          userId: directSession?.user?.id,
          userEmail: directSession?.user?.email,
        });

        if (error) {
          console.error("❌ AuthWrapper: Error getting direct session:", error);
        }

        // Also try through AuthService
        const authServiceResult = await AuthService.getCurrentSession();
        console.log("📊 AuthWrapper: AuthService result:", {
          data: authServiceResult.data,
          error: authServiceResult.error,
          sessionMatch:
            authServiceResult.data.session?.user?.id ===
            directSession?.user?.id,
        });

        // Use the session (prefer direct call)
        const sessionToUse = directSession || authServiceResult.data.session;

        console.log("✅ AuthWrapper: Setting session:", {
          sessionExists: !!sessionToUse,
          userId: sessionToUse?.user?.id,
        });

        setSession(sessionToUse);
      } catch (error) {
        console.error("💥 AuthWrapper: Exception in getInitialSession:", error);
      } finally {
        console.log("🏁 AuthWrapper: Initial session check complete");
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log("👂 AuthWrapper: Setting up auth state listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 AuthWrapper: Auth state change:", {
        event,
        session: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
      });

      setSession(session);
      setLoading(false);
    });

    return () => {
      console.log("🧹 AuthWrapper: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("🚪 AuthWrapper: Signing out...");
    try {
      await AuthService.signOut();
      console.log("✅ AuthWrapper: Sign out successful");
    } catch (error) {
      console.error("❌ AuthWrapper: Error signing out:", error);
    }
  };

  // Debug current state
  useEffect(() => {
    console.log("📊 AuthWrapper: State update:", {
      loading,
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });
  }, [session, loading]);

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  // Debug hook usage
  useEffect(() => {
    console.log("🎣 useAuth: Hook called with:", {
      loading: context.loading,
      hasSession: !!context.session,
      userId: context.session?.user?.id,
    });
  }, [context.session, context.loading]);

  return context;
};

// Alternative simplified version without AuthService dependency
export const SimpleAuthWrapper = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔧 SimpleAuthWrapper: Initializing...");

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("📊 SimpleAuthWrapper: Initial session:", {
          hasSession: !!session,
          userId: session?.user?.id,
          error,
        });

        if (error) {
          console.error("❌ SimpleAuthWrapper: Session error:", error);
        }

        setSession(session);
      } catch (error) {
        console.error("💥 SimpleAuthWrapper: Exception:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 SimpleAuthWrapper: Auth change:", {
        event,
        hasSession: !!session,
      });

      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("🚪 SimpleAuthWrapper: Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ SimpleAuthWrapper: Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
