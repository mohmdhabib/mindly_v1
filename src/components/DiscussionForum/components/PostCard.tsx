import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

/**
 * PostCard component displays a single discussion post.
 *
 * @param {object} props - The component props.
 * @param {object} props.post - The post object to display.
 * @param {function} props.onVote - The function to call when a user votes on the post.
 * @returns {JSX.Element} The rendered PostCard component.
 */
interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  upvotes: number;
  replies: any[];
}

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
}

export const PostCard = ({ post, onVote }: PostCardProps) => (
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
