import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Target, 
  Clock, 
  Star, 
  Play, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';

export function Launchpad() {
  const [activeTab, setActiveTab] = useState('quick-start');

  const quickStartOptions = [
    {
      title: 'Math Mastery',
      description: 'Start with fundamental algebra and work your way up to calculus',
      duration: '4 weeks',
      difficulty: 'Beginner',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      progress: 0
    },
    {
      title: 'Science Explorer',
      description: 'Discover physics, chemistry, and biology concepts',
      duration: '6 weeks',
      difficulty: 'Intermediate',
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      progress: 25
    },
    {
      title: 'Code Academy',
      description: 'Learn programming from scratch with hands-on projects',
      duration: '8 weeks',
      difficulty: 'Beginner',
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      progress: 0
    }
  ];

  const recentActivity = [
    { subject: 'Mathematics', lesson: 'Quadratic Equations', time: '2 hours ago', progress: 85 },
    { subject: 'Physics', lesson: 'Newton\'s Laws', time: '1 day ago', progress: 92 },
    { subject: 'Programming', lesson: 'React Components', time: '2 days ago', progress: 78 }
  ];

  const upcomingDeadlines = [
    { title: 'Math Quiz: Derivatives', date: 'Tomorrow', priority: 'high' },
    { title: 'Physics Lab Report', date: 'In 3 days', priority: 'medium' },
    { title: 'Code Review Session', date: 'Next week', priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/30 mb-6 backdrop-blur-sm">
            <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Launch Your Learning Journey
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
            Welcome to Launchpad 🚀
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your personalized learning command center. Start new courses, track progress, and achieve your goals.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full p-1 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
            {[
              { id: 'quick-start', label: 'Quick Start' },
              { id: 'progress', label: 'My Progress' },
              { id: 'goals', label: 'Goals' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'quick-start' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Quick Start Options */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Start Learning Today
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {quickStartOptions.map((option, index) => (
                  <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 overflow-hidden">
                    <div className={`h-4 bg-gradient-to-r ${option.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center`}>
                          <option.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {option.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        {option.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {option.duration}
                        </div>
                        {option.progress > 0 && (
                          <span>{option.progress}% complete</span>
                        )}
                      </div>
                      {option.progress > 0 && (
                        <Progress value={option.progress} className="mb-4" />
                      )}
                      <Button className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-200`}>
                        {option.progress > 0 ? 'Continue Learning' : 'Start Course'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-mindly-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-mindly-primary to-mindly-accent rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {activity.lesson}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.subject} • {activity.time}
                        </p>
                        <Progress value={activity.progress} className="mt-1 h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-mindly-accent" />
                  Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {deadline.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {deadline.date}
                        </p>
                      </div>
                      <Badge 
                        variant={deadline.priority === 'high' ? 'destructive' : deadline.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {deadline.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-mindly-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Progress Tracking Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed progress analytics and learning insights will be available here.
            </p>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-mindly-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Goal Setting Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Set and track your learning goals with personalized milestones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}