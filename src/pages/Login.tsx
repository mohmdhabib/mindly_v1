import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthWrapper";
import {
  Brain,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left Side - Content/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-800 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white dark:bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white dark:bg-white rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-white dark:bg-white rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-white dark:bg-white rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-10 w-20 h-20 border-2 border-white/20 dark:border-white/20 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-1/4 left-10 w-16 h-16 border-2 border-white/20 dark:border-white/20 rotate-12 animate-bounce"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white dark:text-white">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
              <Brain className="w-8 h-8 text-white dark:text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white dark:text-white">
              Mindly
            </h1>
          </div>

          {/* Main Heading */}
          <div className="mb-8">
            <h2 className="text-5xl font-bold leading-tight mb-4 text-white dark:text-white">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h2>
            <p className="text-xl text-blue-100 dark:text-slate-300 leading-relaxed max-w-md">
              Unlock your potential with AI-powered learning experiences
              designed to accelerate your growth.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <BookOpen className="w-6 h-6 text-yellow-300 mb-2" />
              <h3 className="font-semibold text-sm mb-1">Smart Learning</h3>
              <p className="text-xs text-blue-100">
                Personalized content that adapts to your pace
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Target className="w-6 h-6 text-green-300 mb-2" />
              <h3 className="font-semibold text-sm mb-1">Goal Tracking</h3>
              <p className="text-xs text-blue-100">
                Set and achieve your learning objectives
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Users className="w-6 h-6 text-purple-300 mb-2" />
              <h3 className="font-semibold text-sm mb-1">Community</h3>
              <p className="text-xs text-blue-100">
                Connect with like-minded learners
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-pink-300 mb-2" />
              <h3 className="font-semibold text-sm mb-1">Progress Analytics</h3>
              <p className="text-xs text-blue-100">
                Track your improvement with insights
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-white/20">
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-300 dark:text-amber-400 fill-current"
                />
              ))}
            </div>
            <p className="text-sm italic mb-3 text-white dark:text-white">
              "Mindly revolutionized how I approach learning. The AI-powered
              insights helped me identify my weak spots and improve faster than
              ever."
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-white dark:text-white">
                  SK
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white dark:text-white">
                  Sarah Kim
                </p>
                <p className="text-xs text-blue-200 dark:text-slate-400">
                  Product Designer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-gray-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
        {/* Animated Background Elements for Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile Logo - Only shown on smaller screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Mindly
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Transform your learning journey
            </p>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Sign in to continue your learning journey
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <div className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  AI-Powered
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Secure
                </span>
              </div>
              <div className="flex items-center space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <Zap className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Fast Learning
                </span>
              </div>
            </div>
          </div>

          {/* Auth Component Container */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/20 p-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/8 to-slate-500/8 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/8 to-blue-500/8 rounded-full translate-y-12 -translate-x-12"></div>

            {/* Auth Form */}
            <div className="relative">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                // You might need to customize this further depending on how you're using Auth UI
              />
              {/* Additional CTA */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400">
                  <span>Ready to start learning?</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
