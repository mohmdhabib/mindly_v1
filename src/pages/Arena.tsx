import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Zap, Users, Clock, Star, Sword, Target, Medal, Crown, Siren as Fire, TrendingUp, Calendar, Play, Plus } from 'lucide-react';

export function Arena() {
  const [activeTab, setActiveTab] = useState('challenges');

  const activeChallenges = [
    {
      title: 'Math Marathon',
      description: 'Solve 50 algebra problems in 30 minutes',
      difficulty: 'Medium',
      participants: 234,
      timeLeft: '2 days',
      prize: '500 XP',
      category: 'Mathematics',
      progress: 0
    },
    {
      title: 'Science Sprint',
      description: 'Answer physics questions faster than others',
      difficulty: 'Hard',
      participants: 156,
      timeLeft: '5 hours',
      prize: '1000 XP',
      category: 'Physics',
      progress: 25
    },
    {
      title: 'Code Combat',
      description: 'Debug and optimize JavaScript functions',
      difficulty: 'Expert',
      participants: 89,
      timeLeft: '1 day',
      prize: '1500 XP',
      category: 'Programming',
      progress: 0
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 15420, avatar: 'AC', badge: 'crown' },
    { rank: 2, name: 'Sarah Kim', xp: 14890, avatar: 'SK', badge: 'medal' },
    { rank: 3, name: 'Mike Johnson', xp: 14250, avatar: 'MJ', badge: 'medal' },
    { rank: 4, name: 'Emma Davis', xp: 13800, avatar: 'ED', badge: null },
    { rank: 5, name: 'You', xp: 12450, avatar: 'YU', badge: null, isUser: true }
  ];

  const battleModes = [
    {
      title: '1v1 Quick Battle',
      description: 'Challenge another learner to a head-to-head quiz',
      icon: Sword,
      color: 'from-red-500 to-pink-600',
      action: 'Find Opponent'
    },
    {
      title: 'Team Challenge',
      description: 'Join a team and compete against other groups',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      action: 'Join Team'
    },
    {
      title: 'Quiz Duel',
      description: 'Fast-paced questions with real-time scoring',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      action: 'Start Duel'
    },
    {
      title: 'Study Marathon',
      description: 'Long-form learning session with rewards',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      action: 'Begin Marathon'
    }
  ];

  const userStats = {
    rank: 5,
    xp: 12450,
    level: 23,
    winRate: 78,
    streak: 7
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 dark:border-yellow-400/30 mb-6 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Competitive Learning Arena
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Learning Arena 🏆
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Challenge yourself and others. Compete, learn, and climb the leaderboards!
          </p>
        </div>

        {/* User Stats Bar */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    Rank #{userStats.rank}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Level {userStats.level}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{userStats.xp.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{userStats.winRate}%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Win Rate</div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <Fire className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-600">{userStats.streak}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Day Streak</div>
                </div>
              </div>
            </div>
            
            <Progress value={65} className="w-32 h-3" />
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full p-1 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
            {[
              { id: 'challenges', label: 'Active Challenges' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'battle', label: 'Battle Zone' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
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
        {activeTab === 'challenges' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Active Challenges */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Active Challenges
                </h2>
                <Button className="bg-gradient-to-r from-mindly-primary to-mindly-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
              
              <div className="space-y-6">
                {activeChallenges.map((challenge, index) => (
                  <Card key={index} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {challenge.title}
                          </h3>
                          <Badge 
                            variant={challenge.difficulty === 'Easy' ? 'secondary' : challenge.difficulty === 'Medium' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {challenge.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{challenge.participants} participants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{challenge.timeLeft} left</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{challenge.prize}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {challenge.category}
                      </Badge>
                    </div>
                    
                    {challenge.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="text-gray-600 dark:text-gray-300">{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} />
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full ${challenge.progress > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {challenge.progress > 0 ? 'Continue Challenge' : 'Join Challenge'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-mindly-primary" />
                  This Week
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Challenges Won</span>
                    <span className="font-semibold text-gray-900 dark:text-white">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">XP Earned</span>
                    <span className="font-semibold text-gray-900 dark:text-white">2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Rank Change</span>
                    <span className="font-semibold text-green-600">+3</span>
                  </div>
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-mindly-accent" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Weekly Tournament
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Starts in 2 days
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Math Championship
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Next Monday
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Global Leaderboard
              </h2>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                      user.isUser 
                        ? 'bg-gradient-to-r from-mindly-primary/10 to-mindly-accent/10 border border-mindly-primary/20' 
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank === 1 ? 'bg-yellow-500 text-white' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {user.rank}
                      </div>
                      {user.badge === 'crown' && <Crown className="w-5 h-5 text-yellow-500" />}
                      {user.badge === 'medal' && <Medal className="w-5 h-5 text-gray-400" />}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`font-semibold ${
                        user.isUser ? 'bg-mindly-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className={`font-semibold ${user.isUser ? 'text-mindly-primary' : 'text-gray-900 dark:text-white'}`}>
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.xp.toLocaleString()} XP
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Level {Math.floor(user.xp / 500)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'battle' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Choose Your Battle Mode
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {battleModes.map((mode, index) => (
                <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 overflow-hidden">
                  <div className={`h-4 bg-gradient-to-r ${mode.color}`}></div>
                  <div className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${mode.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {mode.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {mode.description}
                    </p>
                    <Button className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-lg transition-all duration-200`}>
                      {mode.action}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}