import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthWrapper";
import { Brain, Sparkles, Shield, Zap } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      navigate("/launchpad");
    }
    // Brief loading state for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mindly
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <Brain className="w-9 h-9 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to Mindly
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Sign in to unlock your learning potential
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <div className="flex items-center space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-slate-700/20">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                AI-Powered
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-slate-700/20">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Secure
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 dark:border-slate-700/20">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Fast
              </span>
            </div>
          </div>
        </div>

        {/* Auth Component Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/20 p-8 hover:shadow-3xl transition-all duration-500">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-pink-400/10 to-blue-400/10 rounded-full blur-xl"></div>

          {/* Auth Form */}
          <div className="relative">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    padding: "12px 16px",
                    transition: "all 0.2s ease",
                  },
                  input: {
                    borderRadius: "12px",
                    fontSize: "14px",
                    padding: "12px 16px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s ease",
                  },
                  container: {
                    gap: "16px",
                  },
                  divider: {
                    margin: "24px 0",
                  },
                },
                variables: {
                  default: {
                    colors: {
                      brand: "#3b82f6",
                      brandAccent: "#2563eb",
                      brandButtonText: "white",
                      defaultButtonBackground: "#f8fafc",
                      defaultButtonBackgroundHover: "#f1f5f9",
                      defaultButtonBorder: "#e2e8f0",
                      defaultButtonText: "#334155",
                      dividerBackground: "#e2e8f0",
                      inputBackground: "#ffffff",
                      inputBorder: "#e2e8f0",
                      inputBorderHover: "#cbd5e1",
                      inputBorderFocus: "#3b82f6",
                      inputText: "#1e293b",
                      inputPlaceholder: "#64748b",
                    },
                    space: {
                      buttonPadding: "12px 16px",
                      inputPadding: "12px 16px",
                    },
                    borderWidths: {
                      buttonBorderWidth: "1px",
                      inputBorderWidth: "1px",
                    },
                    radii: {
                      borderRadiusButton: "12px",
                      buttonBorderRadius: "12px",
                      inputBorderRadius: "12px",
                    },
                  },
                },
              }}
              providers={["google", "github"]}
              redirectTo={window.location.origin + "/launchpad"}
              theme="default"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
