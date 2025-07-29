import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Target,
  Award,
  TrendingUp,
  Bookmark,
  ChevronRight,
} from "lucide-react";

export function Pathways() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("featured");

  const featuredPaths = [
    {
      id: 1,
      title: "Complete Mathematics Mastery",
      description:
        "From basic arithmetic to advanced calculus, master all mathematical concepts",
      difficulty: "Beginner to Advanced",
      duration: "12 weeks",
      lessons: 48,
      students: 2340,
      rating: 4.9,
      progress: 0,
      category: "Mathematics",
      prerequisites: ["Basic arithmetic"],
      outcomes: [
        "Algebra mastery",
        "Calculus understanding",
        "Problem solving",
      ],
      image: "math-pathway",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      title: "Physics Fundamentals to Advanced",
      description:
        "Explore the laws of nature from classical mechanics to quantum physics",
      difficulty: "Intermediate",
      duration: "10 weeks",
      lessons: 35,
      students: 1890,
      rating: 4.8,
      progress: 25,
      category: "Physics",
      prerequisites: ["Basic mathematics", "Algebra"],
      outcomes: ["Classical mechanics", "Thermodynamics", "Quantum basics"],
      image: "physics-pathway",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: 3,
      title: "Full-Stack Web Development",
      description: "Build modern web applications from frontend to backend",
      difficulty: "Beginner to Advanced",
      duration: "16 weeks",
      lessons: 64,
      students: 3450,
      rating: 4.9,
      progress: 0,
      category: "Programming",
      prerequisites: ["Basic computer skills"],
      outcomes: ["React mastery", "Node.js backend", "Database design"],
      image: "coding-pathway",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const categories = [
    { id: "all", name: "All Subjects", count: 24 },
    { id: "mathematics", name: "Mathematics", count: 8 },
    { id: "science", name: "Science", count: 6 },
    { id: "programming", name: "Programming", count: 5 },
    { id: "languages", name: "Languages", count: 3 },
    { id: "arts", name: "Arts & Design", count: 2 },
  ];

  const myPaths = [
    {
      title: "Calculus Fundamentals",
      progress: 75,
      nextLesson: "Integration by Parts",
      timeSpent: "24 hours",
      category: "Mathematics",
    },
    {
      title: "React Development",
      progress: 45,
      nextLesson: "State Management",
      timeSpent: "18 hours",
      category: "Programming",
    },
    {
      title: "Spanish Conversation",
      progress: 60,
      nextLesson: "Past Tense Verbs",
      timeSpent: "12 hours",
      category: "Languages",
    },
  ];

  const pathsByCategory = {
    mathematics: [
      {
        title: "Algebra Mastery",
        difficulty: "Beginner",
        duration: "6 weeks",
        rating: 4.7,
        students: 1200,
      },
      {
        title: "Calculus Complete",
        difficulty: "Intermediate",
        duration: "8 weeks",
        rating: 4.8,
        students: 890,
      },
      {
        title: "Statistics & Probability",
        difficulty: "Intermediate",
        duration: "7 weeks",
        rating: 4.6,
        students: 650,
      },
    ],
    science: [
      {
        title: "Chemistry Basics",
        difficulty: "Beginner",
        duration: "5 weeks",
        rating: 4.5,
        students: 780,
      },
      {
        title: "Biology Fundamentals",
        difficulty: "Beginner",
        duration: "6 weeks",
        rating: 4.7,
        students: 920,
      },
      {
        title: "Advanced Physics",
        difficulty: "Advanced",
        duration: "12 weeks",
        rating: 4.9,
        students: 340,
      },
    ],
    programming: [
      {
        title: "Python for Beginners",
        difficulty: "Beginner",
        duration: "8 weeks",
        rating: 4.8,
        students: 2100,
      },
      {
        title: "JavaScript Mastery",
        difficulty: "Intermediate",
        duration: "10 weeks",
        rating: 4.7,
        students: 1560,
      },
      {
        title: "Data Structures & Algorithms",
        difficulty: "Advanced",
        duration: "14 weeks",
        rating: 4.9,
        students: 890,
      },
    ],
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mindly-primary/10 to-mindly-accent/10 border border-mindly-primary/20 mb-6">
            <Map className="w-5 h-5 text-mindly-primary mr-2" />
            <span className="text-sm font-medium text-mindly-primary dark:text-mindly-primary/90">
              Structured Learning Journeys
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-mindly-primary to-mindly-accent bg-clip-text text-transparent dark:from-white dark:via-mindly-primary dark:to-mindly-accent">
            Learning Pathways 🔍
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow curated learning paths designed by experts. Progress
            step-by-step from beginner to mastery.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            {[
              { id: "featured", label: "Featured Paths" },
              { id: "browse", label: "Browse All" },
              { id: "my-paths", label: "My Paths" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-full px-6 py-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-mindly-primary text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "featured" && (
          <div className="space-y-12">
            {/* Featured Pathways Carousel */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Learning Pathways
              </h2>
              <div className="grid gap-8 lg:grid-cols-3">
                {featuredPaths.map((path) => (
                  <Card
                    key={path.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 overflow-hidden"
                  >
                    <div
                      className={`h-32 bg-gradient-to-r ${path.color} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-gray-800"
                        >
                          {path.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {path.rating}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-mindly-primary transition-colors">
                        {path.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                        {path.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{path.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{path.lessons} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{path.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{path.outcomes.length} outcomes</span>
                        </div>
                      </div>

                      {path.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              Progress
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {path.progress}%
                            </span>
                          </div>
                          <Progress value={path.progress} />
                        </div>
                      )}

                      <div className="space-y-3 mb-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Prerequisites:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {path.prerequisites.map((prereq, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Learning Outcomes:
                          </h4>
                          <div className="space-y-1">
                            {path.outcomes.slice(0, 2).map((outcome, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{outcome}</span>
                              </div>
                            ))}
                            {path.outcomes.length > 2 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                +{path.outcomes.length - 2} more outcomes
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${path.color} hover:shadow-lg transition-all duration-200 group/btn`}
                      >
                        {path.progress > 0 ? (
                          <>
                            Continue Learning
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Pathway
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                  24
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-500">
                  Total Pathways
                </div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                  12K+
                </div>
                <div className="text-sm text-green-600 dark:text-green-500">
                  Active Learners
                </div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">
                  95%
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-500">
                  Completion Rate
                </div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                  4.8
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-500">
                  Avg Rating
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "browse" && (
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        activeFilter === category.id ? "default" : "ghost"
                      }
                      className={`w-full justify-between ${
                        activeFilter === category.id
                          ? "bg-mindly-primary text-white"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Difficulty Level
                </h3>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button
                      key={level}
                      variant="ghost"
                      className="w-full justify-start text-gray-700 dark:text-gray-300"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Pathways Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeFilter === "all"
                    ? "All Pathways"
                    : categories.find((c) => c.id === activeFilter)?.name}
                </h2>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search Pathways
                </Button>
              </div>

              {activeFilter !== "all" &&
                pathsByCategory[
                  activeFilter as keyof typeof pathsByCategory
                ] && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {pathsByCategory[
                      activeFilter as keyof typeof pathsByCategory
                    ].map((path, index) => (
                      <Card
                        key={index}
                        className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {path.title}
                          </h3>
                          <Badge
                            className={getDifficultyColor(path.difficulty)}
                          >
                            {path.difficulty}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{path.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{path.students}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{path.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bookmark className="w-4 h-4" />
                            <span>Save</span>
                          </div>
                        </div>

                        <Button className="w-full bg-mindly-primary hover:bg-mindly-primary/90">
                          Start Learning
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}

              {activeFilter === "all" && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-mindly-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Browse by Category
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a category from the sidebar to explore available
                    learning pathways.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-paths" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Learning Pathways
              </h2>
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>

            {myPaths.map((path, index) => (
              <Card
                key={index}
                className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {path.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {path.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-mindly-primary">
                      {path.progress}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Complete
                    </div>
                  </div>
                </div>

                <Progress value={path.progress} className="mb-4" />

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div>
                    <span className="font-medium">Next: </span>
                    {path.nextLesson}
                  </div>
                  <div>
                    <span className="font-medium">Time spent: </span>
                    {path.timeSpent}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button className="bg-mindly-primary hover:bg-mindly-primary/90">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              </Card>
            ))}

            {myPaths.length === 0 && (
              <div className="text-center py-12">
                <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Active Pathways
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Start your learning journey by enrolling in a pathway.
                </p>
                <Button
                  className="bg-mindly-primary hover:bg-mindly-primary/90"
                  onClick={() => setActiveTab("featured")}
                >
                  Explore Pathways
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
