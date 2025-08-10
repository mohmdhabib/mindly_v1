/**
 * UserStats component displays the user's stats.
 *
 * @param {object} props - The component props.
 * @param {object} props.stats - The user's stats object.
 * @returns {JSX.Element} The rendered UserStats component.
 */
interface Stats {
  posts: number;
  replies: number;
  upvotes: number;
}

interface UserStatsProps {
  stats: Stats;
}

export const UserStats = ({ stats }: UserStatsProps) => (
  <div>
    <h3 className="font-semibold">Stats</h3>
    <p>Posts: {stats.posts}</p>
    <p>Replies: {stats.replies}</p>
    <p>Upvotes: {stats.upvotes}</p>
  </div>
);
