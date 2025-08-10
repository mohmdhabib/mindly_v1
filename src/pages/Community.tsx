import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share, 
  Plus, 
  Search,
  BookOpen,
  HelpCircle,
  Calendar,
  UserPlus,
  TrendingUp,
  Star,
  ChevronUp,
  ChevronDown,
  Eye,
  Clock
} from 'lucide-react';

export function Community() {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  const feedPosts = [
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'SC',
      time: '2 hours ago',
      content: 'Just mastered calculus derivatives! The key insight was understanding it as the rate of change. Here\'s a quick tip that helped me...',
      subject: 'Mathematics',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false
    },
    {
      id: 2,
      author: 'Dr. Equation',
      avatar: 'DE',
      time: '4 hours ago',
      content: 'Weekly Math Tip: When solving quadratic equations, remember that the discriminant (b² - 4ac) tells you about the nature of roots. Positive = 2 real roots, Zero = 1 real root, Negative = complex roots.',
      subject: 'Mathematics',
      likes: 156,
      comments: 23,
      shares: 45,
      isLiked: true,
      isSME: true
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: 'MJ',
      time: '6 hours ago',
      content: 'Looking for study partners for the upcoming Physics tournament! Anyone interested in forming a team? We can meet virtually every Tuesday.',
      subject: 'Physics',
      likes: 12,
      comments: 15,
      shares: 2,
      isLiked: false
    }
  ];

  const studyGroups = [
    {
      name: 'Calculus Masters',
      subject: 'Mathematics',
      members: 234,
      activity: 'Very Active',
      description: 'Advanced calculus discussions and problem solving',
      recentActivity: 'New problem set posted 2h ago',
      avatars: ['CM', 'SJ', 'AL', 'MK']
    },
    {
      name: 'Physics Explorers',
      subject: 'Physics',
      members: 189,
      activity: 'Active',
      description: 'From quantum mechanics to classical physics',
      recentActivity: 'Lab results discussion 4h ago',
      avatars: ['PE', 'RD', 'LM', 'TH']
    },
    {
      name: 'Code Warriors',
      subject: 'Programming',
      members: 456,
      activity: 'Very Active',
      description: 'Coding challenges and project collaborations',
      recentActivity: 'New JavaScript challenge 1h ago',
      avatars: ['CW', 'JS', 'PY', 'RB']
    }
  ];

  const forumQuestions = [
    {
      title: 'How to approach integration by parts?',
      author: 'Emma Davis',
      category: 'Mathematics',
      votes: 15,
      answers: 7,
      views: 234,
      time: '3 hours ago',
      hasAcceptedAnswer: true
    },
    {
      title: 'Best practices for React component optimization?',
      author: 'Alex Kim',
      category: 'Programming',
      votes: 23,
      answers: 12,
      views: 456,
      time: '5 hours ago',
      hasAcceptedAnswer: false
    },
    {
      title: 'Understanding quantum entanglement',
      author: 'David Wilson',
      category: 'Physics',
      votes: 8,
      answers: 3,
      views: 123,
      time: '1 day ago',
      hasAcceptedAnswer: false
    }
  ];

  const upcomingEvents = [
    {
      title: 'Virtual Math Symposium',
      date: 'Dec 15, 2024',
      time: '2:00 PM EST',
      attendees: 234,
      type: 'Webinar'
    },
    {
      title: 'Code Review Session',
      date: 'Dec 18, 2024',
      time: '7:00 PM EST',
      attendees: 45,
      type: 'Workshop'
    },
    {
      title: 'Physics Lab Showcase',
      date: 'Dec 20, 2024',
      time: '3:00 PM EST',
      attendees: 89,
      type: 'Presentation'
    }
  ];

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mindly-primary/10 to-mindly-accent/10 border border-mindly-primary/20 mb-6">
            <Users className="w-5 h-5 text-mindly-primary mr-2" />
            <span className="text-sm font-medium text-mindly-primary dark:text-mindly-primary/90">
              Social Learning Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-mindly-primary to-mindly-accent bg-clip-text text-transparent dark:from-white dark:via-mindly-primary dark:to-mindly-accent">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with fellow learners, share knowledge, and grow together in our vibrant learning community.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            {[
              { id: 'feed', label: 'Feed', icon: TrendingUp },
              { id: 'groups', label: 'Study Groups', icon: Users },
              { id: 'forum', label: 'Q&A Forum', icon: HelpCircle },
              { id: 'events', label: 'Events', icon: Calendar }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-mindly-primary text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'feed' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-mindly-primary text-white font-semibold">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your learning journey, tips, or questions..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-mindly-primary/50"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add Subject Tag
                        </Button>
                      </div>
                      <Button 
                        disabled={!newPost.trim()}
                        className="bg-mindly-primary hover:bg-mindly-primary/90"
                      >
                        Share Post
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feed Posts */}
              {feedPosts.map((post) => (
                <Card key={post.id} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`font-semibold ${
                        post.isSME ? 'bg-gradient-to-br from-mindly-primary to-mindly-accent text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {post.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {post.author}
                        </h3>
                        {post.isSME && (
                          <Badge variant="secondary" className="text-xs bg-mindly-primary/10 text-mindly-primary">
                            SME
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.time}
                        </span>
                      </div>
                      <Badge variant="outline" className="mb-3 text-xs">
                        {post.subject}
                      </Badge>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`hover:text-red-500 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-red-500' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                          <Share className="w-4 h-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-mindly-primary" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {['#CalculusHelp', '#PhysicsLab', '#CodingTips', '#StudyGroup'].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <span className="text-mindly-primary font-medium">{topic}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(Math.random() * 100) + 20} posts
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggested Connections */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-mindly-accent" />
                  Suggested Connections
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Lisa Wang', subject: 'Mathematics', mutual: 5 },
                    { name: 'John Smith', subject: 'Physics', mutual: 3 },
                    { name: 'Anna Lee', subject: 'Programming', mutual: 8 }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.subject} • {user.mutual} mutual connections
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Study Groups
              </h2>
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search Groups
                </Button>
                <Button className="bg-mindly-primary hover:bg-mindly-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {studyGroups.map((group, index) => (
                <Card key={index} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {group.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {group.subject}
                      </Badge>
                    </div>
                    <Badge 
                      variant={group.activity === 'Very Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {group.activity}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {group.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex -space-x-2">
                      {group.avatars.slice(0, 3).map((avatar, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-white dark:border-gray-800">
                          <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                            {avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.avatars.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            +{group.avatars.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {group.recentActivity}
                    </span>
                  </div>
                  
                  <Button className="w-full bg-mindly-primary hover:bg-mindly-primary/90">
                    Join Group
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Q&A Forum
                </h2>
                <Button className="bg-mindly-primary hover:bg-mindly-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
              </div>

              {forumQuestions.map((question, index) => (
                <Card key={index} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <Button variant="ghost" size="sm" className="p-1">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {question.votes}
                      </span>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-mindly-primary cursor-pointer">
                          {question.title}
                        </h3>
                        {question.hasAcceptedAnswer && (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Solved
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <span>by {question.author}</span>
                        <span>{question.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{question.answers} answers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{question.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['calculus', 'physics', 'programming', 'algebra', 'chemistry', 'javascript'].map((tag, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-mindly-primary hover:text-white transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Dr. Equation', points: 2450, badge: 'gold' },
                    { name: 'Prof. Atom', points: 1890, badge: 'silver' },
                    { name: 'Code Master', points: 1650, badge: 'bronze' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white text-xs font-semibold">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {contributor.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {contributor.points} points
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        contributor.badge === 'gold' ? 'bg-yellow-500' :
                        contributor.badge === 'silver' ? 'bg-gray-400' :
                        'bg-amber-600'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <Button className="bg-mindly-primary hover:bg-mindly-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-mindly-primary hover:bg-mindly-primary/90">
                    Register Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}