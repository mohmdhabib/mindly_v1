import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
    console.log("🔧 AuthWrapper: Initializing...");
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("📊 AuthWrapper: Initial session:", {
          hasSession: !!session,
          userId: session?.user?.id,
        });
        setSession(session);
      } catch (error) {
        console.error("💥 AuthWrapper: Exception during initial session fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 AuthWrapper: Auth state changed:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
      });
      setSession(session);
      setLoading(false);
    });

    return () => {
      console.log("🧹 AuthWrapper: Cleaning up auth subscription.");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("🚪 AuthWrapper: Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ AuthWrapper: Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
