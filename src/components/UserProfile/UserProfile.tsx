import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserProfile = ({ user }) => {
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
        <div>
          <h3 className="font-semibold">Stats</h3>
          <p>Posts: {user.posts}</p>
          <p>Replies: {user.replies}</p>
          <p>Upvotes: {user.upvotes}</p>
        </div>
      </CardContent>
    </Card>
  );
};
