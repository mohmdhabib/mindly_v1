import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Rocket,
  Search,
  Users,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthWrapper";

/**
 * Navigation component for the application.
 *
 * @returns {JSX.Element} The rendered Navigation component.
 */
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth(); // Import the signOut function from auth context
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Launchpad", icon: Rocket, emoji: "🚀", path: "/launchpad" },
    { name: "Mindspace", icon: Brain, emoji: "🧠", path: "/mindspace" },
    { name: "ARENA", icon: Users, path: "/arena" },
    { name: "Community", icon: Users, path: "/community" },
    { name: "Pathways", icon: Search, emoji: "🔍", path: "/pathways" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      // Use the signOut function from auth context
      await signOut();

      // Close mobile menu if open
      setIsMenuOpen(false);

      // Navigate to login page
      navigate("/login");

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // const notifications = [
  //   {
  //     id: 1,
  //     message: "New reply on your post 'How to improve my prompting skills?'",
  //     timestamp: "2 minutes ago",
  //   },
  //   {
  //     id: 2,
  //     message: "@user456 mentioned you in a comment.",
  //     timestamp: "1 hour ago",
  //   },
  // ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mindly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <Button
                  variant="ghost"
                  className={`px-4 py-2 rounded-full hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-white/95 dark:bg-slate-800/95 text-blue-600 shadow-lg border border-blue-200/50 dark:border-blue-800/50"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {item.emoji && <span className="ml-1">{item.emoji}</span>}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 p-0 hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-lg transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </Button>

            <Link to="/my-cortex">
              <Button
                variant="ghost"
                className={`hidden md:flex items-center px-4 py-2 rounded-full hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-lg transition-all duration-300 ${
                  isActive("/my-cortex")
                    ? "bg-white/95 dark:bg-slate-800/95 text-blue-600 shadow-lg border border-blue-200/50 dark:border-blue-800/50"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                My Cortex
              </Button>
            </Link>

            {/* Logout Button - Desktop */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="hidden md:flex items-center px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-lg transition-all duration-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden rounded-full w-10 h-10 p-0 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-2xl animate-slide-up">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-slate-100 dark:bg-slate-800 text-blue-600 border border-blue-200/50 dark:border-blue-800/50"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                    {item.emoji && <span className="ml-2">{item.emoji}</span>}
                  </Button>
                </Link>
              ))}
              <Link to="/my-cortex">
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ${
                    isActive("/my-cortex")
                      ? "bg-slate-100 dark:bg-slate-800 text-blue-600 border border-blue-200/50 dark:border-blue-800/50"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  My Cortex
                </Button>
              </Link>

              {/* Logout Button - Mobile */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
