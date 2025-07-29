import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { AuthWrapper } from './components/AuthWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from '@/pages/Home';
import { Launchpad } from '@/pages/Launchpad';
import { Mindspace } from '@/pages/Mindspace';
<<<<<<< HEAD
import { Arena } from '@/pages/Arena';
import { StartChallenge } from '@/pages/StartChallenge';
=======
import Arena  from '@/pages/Arena';
>>>>>>> origin/yadav
import { Community } from '@/pages/Community';
import { Pathways } from '@/pages/Pathways';
import { MyCortex } from '@/pages/MyCortex';
import { Login } from './pages/Login';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mindly-theme">
      <AuthWrapper>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navigation />
            <main className="pt-16">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/launchpad" element={<Launchpad />} />
                  <Route path="/mindspace" element={<Mindspace />} />
                  <Route path="/arena" element={<Arena />} />
                  <Route path="/arena/challenge/:challengeId" element={<StartChallenge />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/pathways" element={<Pathways />} />
                  <Route path="/my-cortex" element={<MyCortex />} />
                </Route>
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthWrapper>
    </ThemeProvider>
  );
}

export default App;