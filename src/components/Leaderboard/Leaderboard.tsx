import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardItem } from "./components/LeaderboardItem";

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
