import { Medal } from "lucide-react";

/**
 * LeaderboardItem component displays a single user in the leaderboard.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object to display.
 * @param {number} props.rank - The rank of the user in the leaderboard.
 * @returns {JSX.Element} The rendered LeaderboardItem component.
 */
interface User {
  name: string;
  points: number;
}

interface LeaderboardItemProps {
  user: User;
  rank: number;
}

export const LeaderboardItem = ({ user, rank }: LeaderboardItemProps) => (
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
