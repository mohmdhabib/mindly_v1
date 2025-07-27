import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  Zap,
  ArrowRight,
  Flame,
  Calendar,
  Star
} from 'lucide-react';

export function Dashboard() {
  const recentSessions = [
    { subject: 'Mathematics', topic: 'Calculus Integration', duration: '45 min', progress: 85 },
    { subject: 'Physics', topic: 'Quantum Mechanics', duration: '32 min', progress: 72 },
    { subject: 'Programming', topic: 'React Hooks', duration: '28 min', progress: 94 },
  ];

  const achievements = [
    { title: 'Quick Learner', description: 'Completed 5 lessons this week', icon: Zap, color: 'text-yellow-500' },
    { title: 'Math Master', description: 'Solved 50 calculus problems', icon: Target, color: 'text-blue-500' },
    { title: 'Consistent Student', description: '7-day learning streak', icon: Flame, color: 'text-orange-500' },
  ];

  const upcomingGoals = [
    { title: 'Complete Quantum Physics Module', deadline: '3 days', progress: 65 },
    { title: 'Master React Components', deadline: '1 week', progress: 40 },
    { title: 'Spanish Conversation Practice', deadline: '5 days', progress: 80 },
  ];

  return (
    <section className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Learning Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your progress, celebrate achievements, and stay on top of your learning goals
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Stats & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">42</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">Hours Learned</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">23</div>
                  <div className="text-xs text-green-600 dark:text-green-500">Lessons Done</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">7</div>
                  <div className="text-xs text-purple-600 dark:text-purple-500">Day Streak</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">12</div>
                  <div className="text-xs text-orange-600 dark:text-orange-500">Achievements</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Learning Sessions */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Sessions</h3>
              <Button variant="ghost" size="sm" className="text-mindly-primary hover:text-mindly-primary/80">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-mindly-primary to-mindly-accent rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{session.topic}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {session.subject}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Progress value={session.progress} className="w-20" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {session.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Goals & Achievements */}
        <div className="space-y-6">
          {/* Learning Goals */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Goals</h3>
              <Target className="w-5 h-5 text-mindly-primary" />
            </div>
            <div className="space-y-4">
              {upcomingGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {goal.title}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {goal.progress}% complete
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4 rounded-lg">
              Set New Goal
            </Button>
          </Card>

          {/* Recent Achievements */}
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
              <Award className="w-5 h-5 text-mindly-accent" />
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center`}>
                    <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {achievement.description}
                    </p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4 rounded-lg">
              View All Achievements
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}