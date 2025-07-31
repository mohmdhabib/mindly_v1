import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CommunityService, Post, StudyGroup, Comment } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';

export function useCommunityData() {
  const { session } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'feed';

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

  return {
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
  };
}
