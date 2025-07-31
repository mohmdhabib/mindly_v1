import { useState, useEffect } from 'react';
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
import { CommunityService, Post, StudyGroup, Comment } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { formatDistanceToNow } from 'date-fns';

export function Community() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [forumQuestions, setForumQuestions] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '', subject: '' });
  const [newQuestion, setNewQuestion] = useState({ content: '', subject: '' });
  const [newComment, setNewComment] = useState('');
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'feed') {
      const { data, error } = await CommunityService.getPosts();
      if (data) setPosts(data);
      if (error) console.error("Error fetching posts:", error);
    } else if (activeTab === 'groups') {
      const { data, error } = await CommunityService.getStudyGroups();
      if (data) setStudyGroups(data as StudyGroup[]);
      if (error) console.error("Error fetching study groups:", error);
    } else if (activeTab === 'forum') {
        const { data, error } = await CommunityService.getForumQuestions();
        if (data) setForumQuestions(data);
        if (error) console.error("Error fetching forum questions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session) return;
    const { error } = await CommunityService.createPost({ user_id: session.user.id, content: newPost });
    if (!error) {
      setNewPost('');
      fetchData();
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.subject.trim() || !session) return;
    const { error } = await CommunityService.createStudyGroup({ ...newGroup, creator_id: session.user.id });
    if (!error) {
      setNewGroup({ name: '', description: '', subject: '' });
      fetchData();
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!session) return;
    const { error } = await CommunityService.joinStudyGroup({ group_id: groupId, user_id: session.user.id });
    if (!error) fetchData();
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.content.trim() || !session) return;
    const { error } = await CommunityService.createForumQuestion({ ...newQuestion, user_id: session.user.id });
    if (!error) {
        setNewQuestion({ content: '', subject: '' });
        fetchData();
    }
  };

  const handleVote = async (postId: string, currentVotes: number, direction: 'up' | 'down') => {
    const { error } = await CommunityService.voteOnForumQuestion(postId, currentVotes, direction);
    if (!error) fetchData();
  };

  const handleLike = async (postId: string) => {
    if (!session) return;
    // This is a simplified version. A real app would check if the user has already liked the post.
    const { error } = await CommunityService.likePost(postId, session.user.id);
    if (!error) fetchData();
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim() || !session) return;
    const { error } = await CommunityService.createComment({ postId, userId: session.user.id, content: newComment });
    if (!error) {
      setNewComment('');
      const { data } = await CommunityService.getCommentsForPost(postId);
      if (data) setComments(data);
    }
  };

  const toggleComments = async (postId: string) => {
    if (activeCommentSection === postId) {
      setActiveCommentSection(null);
    } else {
      const { data } = await CommunityService.getCommentsForPost(postId);
      if (data) setComments(data);
      setActiveCommentSection(postId);
    }
  };

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Tabs */}

        {activeTab === 'feed' && (
          <div className="lg:col-span-2 space-y-6">
              {/* ... create post ... */}
              {loading ? (
                <p>Loading posts...</p>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    {/* ... post header ... */}
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
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
                  </Card>
                ))
              )}
            </div>
        )}

        {/* Other tabs */}
      </div>
    </div>
  );
}