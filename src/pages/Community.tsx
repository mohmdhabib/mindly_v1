import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCommunityData } from '@/hooks/useCommunityData';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export function Community() {
  const {
    session,
    activeTab,
    posts,
    studyGroups,
    forumQuestions,
    comments,
    newPost,
    newGroup,
    newQuestion,
    newComment,
    activeCommentSection,
    loading,
    setSearchParams,
    setNewPost,
    setNewGroup,
    setNewQuestion,
    setNewComment,
    handleCreatePost,
    handleCreateGroup,
    handleJoinGroup,
    handleCreateQuestion,
    handleVote,
    handleLike,
    handleComment,
    toggleComments,
  } = useCommunityData();

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={() => setSearchParams({ tab: tab.id })}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'feed' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
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
                            onClick={() => handleLike(post.id)}
                            className='text-gray-500 hover:text-red-500'
                          >
                            <Heart className='w-4 h-4 mr-1' />
                            {post.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)}>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments_count}
                          </Button>
                        </div>
                        {activeCommentSection === post.id && (
                          <div className="mt-4">
                            <div className="space-y-4">
                              {comments.map(comment => (
                                <div key={comment.id} className="flex items-start space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>{comment.profiles?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-semibold">{comment.profiles?.username}</p>
                                    <p>{comment.comment_content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
                              <Button onClick={() => handleComment(post.id)}>Comment</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
            <div className="space-y-6">
              {/* Sidebar */}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Study Groups
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-mindly-primary hover:bg-mindly-primary/90" disabled={!session}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new study group</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create your group.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subject" className="text-right">
                        Subject
                      </Label>
                      <Input id="subject" value={newGroup.subject} onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateGroup}>Create Group</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <p>Loading study groups...</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {studyGroups.map((group) => (
                  <Card key={group.id} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {group.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {group.subject}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      {group.description}
                    </p>
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.group_memberships.length} members</span>
                      </div>
                    </div>
                    {group.group_memberships.some(m => m.user_id === session?.user.id) ? (
                      <Link to={`/group/${group.id}`} className="w-full">
                        <Button className="w-full bg-mindly-accent hover:bg-mindly-accent/90">
                          View Group
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full bg-mindly-primary hover:bg-mindly-primary/90"
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={!session}
                      >
                        Join Group
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Q&A Forum
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-mindly-primary hover:bg-mindly-primary/90" disabled={!session}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ask a question</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input value={newQuestion.subject} onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })} placeholder="Subject" />
                      <Textarea value={newQuestion.content} onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })} placeholder="What is your question?" />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateQuestion}>Ask</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <p>Loading questions...</p>
              ) : (
                forumQuestions.map((question) => (
                  <Card key={question.id} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center space-y-2">
                        <Button variant="ghost" size="sm" onClick={() => handleVote(question.id, question.votes, 'up')}>
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold">{question.votes}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleVote(question.id, question.votes, 'down')}>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{question.subject}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{question.content}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Asked by {question.profiles?.username || 'Anonymous'} • {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}