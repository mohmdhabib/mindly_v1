import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CommunityService, Post } from '@/services/community.service';
import { useAuth } from '@/components/AuthWrapper';
import { formatDistanceToNow } from 'date-fns';

export function GroupSpace() {
  const { groupId } = useParams<{ groupId: string }>();
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    if (!groupId) return;
    setLoading(true);
    const { data, error } = await CommunityService.getPostsForGroup(groupId);
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
  }, [groupId]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session || !groupId) return;
    const { error } = await CommunityService.createPostInGroup({
      userId: session.user.id,
      groupId: groupId,
      content: newPost,
    });
    if (!error) {
      setNewPost('');
      fetchPosts();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Group Feed</h1>
      <Card className="p-4 mb-6">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarFallback>{session?.user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Post to the group..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={!session}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleCreatePost} disabled={!newPost.trim() || !session}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{post.profiles?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{post.profiles?.username || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p>{post.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
