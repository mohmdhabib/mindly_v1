import { useState, useEffect } from 'react';
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
import { CommunityService, Post } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { formatDistanceToNow } from 'date-fns';

export function Community() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data, error } = await CommunityService.getPosts();
    if (data) {
      setPosts(data);
    }
    if (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session) return;

    const { error } = await CommunityService.createPost({
      user_id: session.user.id,
      content: newPost,
    });

    if (error) {
      console.error("Error creating post:", error);
    } else {
      setNewPost('');
      fetchPosts(); // Refetch posts to show the new one
    }
  };

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
  ];

  const upcomingEvents = [
    {
      title: 'Virtual Math Symposium',
      date: 'Dec 15, 2024',
      time: '2:00 PM EST',
      attendees: 234,
      type: 'Webinar'
    },
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
                      {session?.user?.email?.[0].toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder={session ? "Share your learning journey, tips, or questions..." : "Please log in to create a post."}
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] border-0 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-mindly-primary/50"
                      disabled={!session}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add Subject Tag
                        </Button>
                      </div>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim() || !session}
                        className="bg-mindly-primary hover:bg-mindly-primary/90"
                      >
                        Share Post
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feed Posts */}
              {loading ? (
                <p>Loading posts...</p>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                          {post.profiles?.username?.[0].toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.profiles?.username || 'Anonymous'}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {post.subject && (
                          <Badge variant="outline" className="mb-3 text-xs">
                            {post.subject}
                          </Badge>
                        )}
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className='text-gray-500 hover:text-red-500'
                          >
                            <Heart className='w-4 h-4 mr-1' />
                            {post.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                            <Share className="w-4 h-4 mr-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
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
      </div>
    </div>
  );
}