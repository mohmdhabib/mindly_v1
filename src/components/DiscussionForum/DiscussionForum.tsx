import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "./components/PostCard";

export const DiscussionForum = () => {
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "How to improve my prompting skills?",
      author: "user123",
      content: "I'm looking for tips and tricks to improve my prompting skills. Any advice?",
      upvotes: 45,
      replies: [],
    },
    {
      id: "2",
      title: "Best way to learn about RAG?",
      author: "user456",
      content: "What are the best resources to learn about Retrieval-Augmented Generation?",
      upvotes: 32,
      replies: [],
    },
  ]);

  const handleVote = (postId: string, type: "up" | "down") => {
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
