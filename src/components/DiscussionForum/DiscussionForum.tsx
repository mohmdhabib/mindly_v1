import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

const PostCard = ({ post, onVote }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{post.title}</CardTitle>
      <p className="text-sm text-gray-500">Posted by @{post.author}</p>
    </CardHeader>
    <CardContent>
      <p>{post.content}</p>
      <div className="flex items-center gap-4 mt-4">
        <Button variant="ghost" size="sm" onClick={() => onVote(post.id, "up")}>
          <ThumbsUp size={16} className="mr-2" />
          {post.upvotes}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onVote(post.id, "down")}>
          <ThumbsDown size={16} className="mr-2" />
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare size={16} className="mr-2" />
          {post.replies.length} Replies
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const DiscussionForum = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How to improve my prompting skills?",
      author: "user123",
      content: "I'm looking for tips and tricks to improve my prompting skills. Any advice?",
      upvotes: 45,
      replies: [],
    },
    {
      id: 2,
      title: "Best way to learn about RAG?",
      author: "user456",
      content: "What are the best resources to learn about Retrieval-Augmented Generation?",
      upvotes: 32,
      replies: [],
    },
  ]);

  const handleVote = (postId, type) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: type === "up" ? post.upvotes + 1 : post.upvotes - 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">New Post</h2>
        <Textarea placeholder="What's on your mind?" className="mb-4" />
        <Button>Submit</Button>
      </div>

      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onVote={handleVote} />
        ))}
      </div>
    </div>
  );
};
