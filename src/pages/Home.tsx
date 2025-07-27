import { Hero } from '@/components/Hero/Hero';
import { SMECards } from '@/components/SMECards/SMECards';
import { useAuth } from '@/components/AuthWrapper';
import { Navigate } from 'react-router-dom';

export const Home = () => {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/launchpad" />;
  }

  return (
    <div>
      <Hero />
      <SMECards />
    </div>
  );
};