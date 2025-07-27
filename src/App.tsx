import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

// Pages
import { Home } from '@/pages/Home';
import { Launchpad } from '@/pages/Launchpad';
import { Mindspace } from '@/pages/Mindspace';
import { Arena } from '@/pages/Arena';
import { Community } from '@/pages/Community';
import { Pathways } from '@/pages/Pathways';
import { MyCortex } from '@/pages/MyCortex';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mindly-theme">
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/launchpad" element={<Launchpad />} />
              <Route path="/mindspace" element={<Mindspace />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/community" element={<Community />} />
              <Route path="/pathways" element={<Pathways />} />
              <Route path="/my-cortex" element={<MyCortex />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;