import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

const LeaderboardItem = ({ user, rank }) => (
  <div className="flex items-center justify-between border-b py-3">
    <div className="flex items-center gap-4">
      {rank === 1 && <Medal size={20} className="text-yellow-500" />}
      {rank === 2 && <Medal size={20} className="text-gray-400" />}
      {rank === 3 && <Medal size={20} className="text-orange-400" />}
      <span className="font-semibold">{user.name}</span>
    </div>
    <span>{user.points} points</span>
  </div>
);

export const Leaderboard = () => {
  const users = [
    { name: "@user789", points: 1250 },
    { name: "@user123", points: 1100 },
    { name: "@user456", points: 950 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        {users.map((user, index) => (
          <LeaderboardItem key={user.name} user={user} rank={index + 1} />
        ))}
      </CardContent>
    </Card>
  );
};
