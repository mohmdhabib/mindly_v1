import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  Trophy,
  BookOpen,
  Clock,
  Target,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Download,
  Bookmark,
  MessageCircle,
  Bell,
  Shield,
  Palette,
  Volume2,
  Globe,
  Edit,
  Camera,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";
import { ProfileService } from "@/services/profile.service";
import { LearningService } from "@/services/learning.service";

export function MyCortex() {
  const { session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  // State for user profile data
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    level: 0,
    xp: 0,
    nextLevelXP: 0,
    streak: 0,
    joinDate: "",
    completionRate: 0,
    avatar: "",
  });

  // Loading state for profile data
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session) return;

      try {
        setIsLoading(true);
        const { data, error } = await ProfileService.getProfile(
          session.user.id
        );

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          // Map the Supabase data to our UI format
          setUserProfile({
            name: data.full_name || data.username || "User",
            email: session.user.email || "",
            level: data.level || 1,
            xp: data.xp || 0,
            nextLevelXP: data.next_level_xp || 1000,
            streak: data.streak || 0,
            joinDate:
              new Date(data.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }) || "New User",
            completionRate: data.completion_rate || 0,
            avatar: getInitials(data.full_name || data.username || "User"),
          });
        }
      } catch (err) {
        console.error("Error in profile fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Show loading spinner while data is being fetched
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mindly-primary"></div>
      </div>
    );
  }

  // For now, we'll keep these as hardcoded data
  // In a real implementation, these would also be fetched from the backend
  const learningStats = {
    totalHours: 142,
    coursesCompleted: 8,
    currentCourses: 3,
    averageScore: 92,
    weeklyGoal: 10,
    weeklyProgress: 7,
  };

  const achievements = [
    {
      title: "First Steps",
      description: "Completed your first lesson",
      icon: Star,
      earned: true,
      date: "2024-03-15",
    },
    {
      title: "Week Warrior",
      description: "7-day learning streak",
      icon: Trophy,
      earned: true,
      date: "2024-11-20",
    },
    {
      title: "Math Master",
      description: "Completed 5 math courses",
      icon: Target,
      earned: true,
      date: "2024-10-12",
    },
    {
      title: "Speed Learner",
      description: "Completed a course in under 2 weeks",
      icon: Clock,
      earned: false,
      progress: 75,
    },
    {
      title: "Community Helper",
      description: "Helped 10 fellow learners",
      icon: User,
      earned: false,
      progress: 40,
    },
  ];

  const recentActivity = [
    {
      type: "lesson",
      title: "Completed: Advanced Calculus",
      time: "2 hours ago",
      subject: "Mathematics",
    },
    {
      type: "achievement",
      title: "Earned: Week Warrior badge",
      time: "1 day ago",
      subject: "Achievement",
    },
    {
      type: "discussion",
      title: "Replied to: Integration help",
      time: "2 days ago",
      subject: "Community",
    },
    {
      type: "course",
      title: "Started: React Fundamentals",
      time: "3 days ago",
      subject: "Programming",
    },
  ];

  const savedContent = [
    {
      title: "Quadratic Formula Explained",
      type: "Conversation",
      subject: "Mathematics",
      date: "2024-11-18",
    },
    {
      title: "React Hooks Best Practices",
      type: "Resource",
      subject: "Programming",
      date: "2024-11-17",
    },
    {
      title: "Physics Lab Notes",
      type: "Notes",
      subject: "Physics",
      date: "2024-11-15",
    },
    {
      title: "Spanish Vocabulary List",
      type: "Study Set",
      subject: "Languages",
      date: "2024-11-14",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 2.1 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 0.8 },
    { day: "Sun", hours: 2.3 },
  ];

  const subjectProgress = [
    { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
    { subject: "Programming", progress: 72, color: "bg-green-500" },
    { subject: "Physics", progress: 68, color: "bg-purple-500" },
    { subject: "Languages", progress: 45, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mindly-primary/10 to-mindly-accent/10 border border-mindly-primary/20 mb-6">
            <User className="w-5 h-5 text-mindly-primary mr-2" />
            <span className="text-sm font-medium text-mindly-primary dark:text-mindly-primary/90">
              Personal Learning Dashboard
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-mindly-primary to-mindly-accent bg-clip-text text-transparent dark:from-white dark:via-mindly-primary dark:to-mindly-accent">
            My Cortex
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personalized learning hub. Track progress, manage preferences,
            and celebrate achievements.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "library", label: "My Library", icon: BookOpen },
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-mindly-primary text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gradient-to-br from-mindly-primary/5 to-mindly-accent/5 border-mindly-primary/20">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white text-2xl font-bold">
                        {userProfile.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userProfile.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {userProfile.email}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-mindly-primary">
                        {userProfile.level}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Level
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-mindly-accent">
                        {userProfile.streak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Day Streak
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Level Progress
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {userProfile.xp} / {userProfile.nextLevelXP} XP
                      </span>
                    </div>
                    <Progress
                      value={(userProfile.xp / userProfile.nextLevelXP) * 100}
                    />
                  </div>

                  <Button className="w-full bg-mindly-primary hover:bg-mindly-primary/90">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </Card>
            </div>

            {/* Stats and Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Learning Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {learningStats.totalHours}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">
                    Total Hours
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                  <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {learningStats.coursesCompleted}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-500">
                    Completed
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                  <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {learningStats.currentCourses}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-500">
                    In Progress
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                  <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {learningStats.averageScore}%
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-500">
                    Avg Score
                  </div>
                </Card>
              </div>

              {/* Weekly Activity Chart */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-mindly-primary" />
                  Weekly Activity
                </h3>
                <div className="flex items-end justify-between h-32 mb-4">
                  {weeklyActivity.map((day, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div
                        className="bg-mindly-primary rounded-t-lg w-8 transition-all duration-300 hover:bg-mindly-primary/80"
                        style={{ height: `${(day.hours / 4) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Weekly Goal: {learningStats.weeklyProgress}/
                    {learningStats.weeklyGoal} hours
                  </div>
                  <Progress
                    value={
                      (learningStats.weeklyProgress /
                        learningStats.weeklyGoal) *
                      100
                    }
                    className="mt-2"
                  />
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-mindly-accent" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.type === "lesson"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : activity.type === "achievement"
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : activity.type === "discussion"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-purple-100 dark:bg-purple-900/30"
                        }`}
                      >
                        {activity.type === "lesson" && (
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        )}
                        {activity.type === "achievement" && (
                          <Trophy className="w-4 h-4 text-yellow-600" />
                        )}
                        {activity.type === "discussion" && (
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        )}
                        {activity.type === "course" && (
                          <Target className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {activity.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.subject} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-8">
            {/* Subject Progress */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <PieChart className="w-6 h-6 mr-2 text-mindly-primary" />
                Subject Progress
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {subjectProgress.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {subject.subject}
                      </h3>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {subject.progress}%
                      </span>
                    </div>
                    <Progress value={subject.progress} className="h-3" />
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {subject.progress >= 80
                        ? "Excellent progress!"
                        : subject.progress >= 60
                        ? "Good progress"
                        : "Keep going!"}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Goals */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-mindly-accent" />
                Learning Goals
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Complete Calculus Course
                    </h3>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={75} className="mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Due: December 31, 2024 • 75% complete
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Master React Development
                    </h3>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={45} className="mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Due: January 15, 2025 • 45% complete
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Learning Library
              </h2>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedContent.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {item.subject}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Saved on {item.date}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Open
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Your Achievements
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`p-6 transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-lg"
                      : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm opacity-75"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        achievement.earned
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <achievement.icon
                        className={`w-8 h-8 ${
                          achievement.earned ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        achievement.earned
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        achievement.earned
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {achievement.description}
                    </p>

                    {achievement.earned ? (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <Progress value={achievement.progress || 0} />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {achievement.progress}% complete
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Settings */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={userProfile.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={userProfile.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Receive {key} notifications about your learning progress
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Preferences */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Learning Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Learning Style
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>Visual</option>
                    <option>Auditory</option>
                    <option>Kinesthetic</option>
                    <option>Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daily Learning Goal (hours)
                  </label>
                  <input
                    type="number"
                    defaultValue="2"
                    min="0.5"
                    max="8"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Security
              </h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
