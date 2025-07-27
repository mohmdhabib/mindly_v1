import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className={`text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Welcome Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              AI-Powered Learning Experience
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
              WELCOME BACK
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-slate-900 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-white">
              MINDER
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with AI Subject Matter Experts and unlock your learning potential. 
            <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Discover. Learn. Excel.</span>
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 group hover:scale-105"
            >
              Start Learning Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg rounded-full border-2 border-blue-600/30 dark:border-blue-400/30 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-600/5 dark:hover:bg-blue-400/5 transition-all duration-300 hover:scale-105"
            >
              Explore SME Network
            </Button>
          </div>

          {/* Stats */}
          <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-slate-600 dark:text-slate-400">AI Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">10K+</div>
              <div className="text-slate-600 dark:text-slate-400">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">95%</div>
              <div className="text-slate-600 dark:text-slate-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}