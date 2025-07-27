import { Hero } from '@/components/Hero/Hero';
import { ChatInterface } from '@/components/ChatInterface/ChatInterface';
import { SMECards } from '@/components/SMECards/SMECards';
import { Dashboard } from '@/components/Dashboard/Dashboard';

export function Home() {
  return (
    <div className="pb-12">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ChatInterface />
        <SMECards />
        <Dashboard />
      </div>
    </div>
  );
}