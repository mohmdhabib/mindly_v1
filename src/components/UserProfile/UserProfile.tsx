import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserStats } from "./components/UserStats";

interface User {
  avatar: string;
  name: string;
  email: string;
  posts: number;
  replies: number;
  upvotes: number;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const stats = {
    posts: user.posts,
    replies: user.replies,
    upvotes: user.upvotes,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserStats stats={stats} />
      </CardContent>
    </Card>
  );
};
