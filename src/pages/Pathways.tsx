import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthWrapper";
import { LearningService, LearningPath } from "@/services/learning.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  X,
  Check,
  PlusCircle,
} from "lucide-react";

interface Topic {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Module {
  id: number;
  title: string;
  description: string;
  topics: Topic[];
  resources: string[];
  duration: string;
  progress: number;
}

interface Resource {
  title: string;
  url: string;
}

interface BlogContent {
  title: string;
  content: string;
  resources: Resource[];
}

interface TopicContent {
  [key: number]: BlogContent;
}

interface ModuleContent {
  [key: number]: TopicContent;
}

interface BlogData {
  [key: number]: ModuleContent;
}

interface ModuleData {
  [key: number]: Module[];
}

export function Pathways() {
  const { session } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedPathway, setSelectedPathway] = useState<number | null>(null);
  const [showModules, setShowModules] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{
    moduleId: number;
    topicId: number;
  } | null>(null);
  const [showBlog, setShowBlog] = useState(false);
  const [pathways, setPathways] = useState<LearningPath[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPathway, setNewPathway] = useState<LearningPath>({
    title: "",
    description: "",
    subject: "",
    difficulty_level: "beginner",
    estimated_hours: 0,
    prerequisites: [],
    lessons: [],
    is_featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPathways = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await LearningService.getLearningPaths();
        if (error) throw error;
        if (data) setPathways(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch pathways");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathways();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPathway((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPathway((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setNewPathway((prev) => ({
        ...prev,
        prerequisites: [
          ...(prev.prerequisites || []),
          prerequisiteInput.trim(),
        ],
      }));
      setPrerequisiteInput("");
    }
  };

  const handleRemovePrerequisite = (index: number) => {
    setNewPathway((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter((_, i) => i !== index),
    }));
  };

  const handleCreatePathway = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a pathway");
      }

      const pathwayData: LearningPath = {
        ...newPathway,
        created_by: session.user.id,
      };

      console.log("Submitting pathway data:", pathwayData);

      const { data, error } = await LearningService.createLearningPath(
        pathwayData
      );
      if (error) {
        console.error("Error creating pathway:", error);
        throw error;
      }

      console.log("Created pathway:", data);
      setPathways((prev) => [...prev, data]);
      setSuccessMessage("Learning pathway created successfully!");

      // Reset form
      setNewPathway({
        title: "",
        description: "",
        subject: "",
        difficulty_level: "beginner",
        estimated_hours: 0,
        prerequisites: [],
        lessons: [],
        is_featured: false,
      });

      // Close form after a delay
      setTimeout(() => {
        setShowCreateForm(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("Error in handleCreatePathway:", err);
      setError(err.message || "Failed to create pathway");
    } finally {
      setIsLoading(false);
    }
  };

  const blogData: BlogData = {
    1: {
      // Mathematics
      1: {
        // Foundation Mathematics
        1: {
          title: "Understanding Number Systems",
          content: `
Number systems form the foundation of mathematics and are essential for both basic arithmetic and advanced calculations. This comprehensive guide will help you understand different number systems, their properties, and real-world applications.

1. Natural Numbers (ℕ):
   • Definition: The counting numbers (1, 2, 3, ...)
   • Properties:
     - Closure under addition and multiplication
     - Have a least element (1)
     - Every natural number has a unique successor
   • Applications:
     - Counting objects and quantities
     - Basic arithmetic operations
     - Sequential ordering and ranking
     - Programming array indices

2. Whole Numbers (W):
   • Definition: Natural numbers including zero (0, 1, 2, ...)
   • Key Concepts:
     - Role of zero in mathematics
     - Place value system
     - Binary number system applications
   • Common Uses:
     - Starting point for counting
     - Computer memory addressing
     - Quantity representation

3. Integers (ℤ):
   • Definition: Positive and negative whole numbers (...-2, -1, 0, 1, 2...)
   • Properties:
     - Closure under addition, subtraction, and multiplication
     - Additive and multiplicative inverses
     - Ordered structure
   • Real-world Applications:
     - Temperature measurements
     - Financial transactions (profits/losses)
     - Elevation relative to sea level
     - Vector directions

4. Rational Numbers (ℚ):
   • Definition: Numbers expressed as p/q where q ≠ 0
   • Key Characteristics:
     - Can be expressed as terminating or repeating decimals
     - Dense property (between any two rationals lies another rational)
     - Closed under basic arithmetic operations
   • Practical Uses:
     - Proportions and ratios
     - Probability calculations
     - Engineering measurements
     - Financial calculations

5. Irrational Numbers:
   • Definition: Numbers that cannot be expressed as simple fractions
   • Famous Examples:
     - π (pi) ≈ 3.14159...
     - e (Euler's number) ≈ 2.71828...
     - √2 ≈ 1.41421...
   • Applications:
     - Geometry (circle calculations)
     - Complex mathematical modeling
     - Natural phenomena description

6. Real Numbers (ℝ):
   • Definition: Union of rational and irrational numbers
   • Properties:
     - Completeness property
     - Continuous number line
     - Decimal representation
   • Significance:
     - Scientific measurements
     - Mathematical analysis
     - Physical quantities
     - Economic modeling

Advanced Topics:
• Complex Numbers
• Transcendental Numbers
• Special Number Systems (Binary, Octal, Hexadecimal)
• Number Theory Concepts

Problem-Solving Strategies:
1. Identify the appropriate number system
2. Understand properties and limitations
3. Apply relevant operations
4. Verify solutions within context

Real Numbers (ℝ):
- Include all rational and irrational numbers
- Represent any point on a number line
- Essential for advanced mathematics and scientific calculations

Understanding these number systems is crucial for:
1. Problem-solving in mathematics
2. Scientific calculations
3. Computer programming
4. Real-world applications in finance and engineering
`,
          resources: [
            {
              title: "Khan Academy - Number Systems Course",
              url: "https://www.khanacademy.org/math/arithmetic",
            },
            {
              title: "MIT OpenCourseWare - Number Systems",
              url: "https://ocw.mit.edu/courses/mathematics/",
            },
            {
              title: "Interactive Number Line Tool",
              url: "https://www.geogebra.org/m/qbx5mpk9",
            },
            {
              title: "Video: Number Systems Explained",
              url: "https://www.youtube.com/watch?v=rYg45ZJ2Aak",
            },
            {
              title: "Number Theory Practice Problems",
              url: "https://artofproblemsolving.com/wiki/index.php/Number_theory",
            },
            {
              title: "Real Numbers Interactive Visualization",
              url: "https://www.desmos.com/calculator",
            },
            {
              title: "Research Paper: History of Number Systems",
              url: "https://www.maa.org/press/periodicals/convergence/mathematical-treasure-number-systems",
            },
            {
              title: "Number Systems in Computer Science",
              url: "https://www.geeksforgeeks.org/number-system-and-base-conversions/",
            },
            {
              title: "Interactive Exercises - IXL Math",
              url: "https://www.ixl.com/math/number-systems",
            },
          ],
        },
        2: {
          title: "Basic Arithmetic Operations",
          content: `
Mastering basic arithmetic operations is crucial for all mathematical endeavors. These fundamental operations form the building blocks of more complex mathematical concepts.

Addition and Subtraction:
- Understanding place value
- Mental math strategies
- Properties of addition and subtraction
- Real-world applications

Multiplication and Division:
- Multiplication as repeated addition
- Division as fair sharing
- Properties of multiplication
- Long division techniques

Order of Operations (PEMDAS):
- Parentheses
- Exponents
- Multiplication and Division (left to right)
- Addition and Subtraction (left to right)

Common Mistakes to Avoid:
- Forgetting order of operations
- Place value errors
- Basic fact memorization
- Division by zero

Practice and applications help build a strong foundation for advanced mathematics.
`,
          resources: [
            {
              title: "Khan Academy - Arithmetic Operations",
              url: "https://www.khanacademy.org/math/arithmetic-home/arithmetic",
            },
            {
              title: "IXL Math - Practice Problems",
              url: "https://www.ixl.com/math/arithmetic",
            },
            {
              title: "Math Games for Basic Operations",
              url: "https://www.mathplayground.com/",
            },
          ],
        },
        3: {
          title: "Fractions and Decimals",
          content: `
Fractions and decimals are different ways of representing parts of a whole. Understanding their relationship and operations is essential for advanced mathematics.

Understanding Fractions:
- Parts of a whole
- Proper and improper fractions
- Mixed numbers
- Equivalent fractions

Converting Between Fractions and Decimals:
- Division method
- Common fraction to decimal conversions
- Terminating vs repeating decimals
- Percentage conversions

Operations with Fractions:
- Addition and subtraction with like denominators
- Finding common denominators
- Multiplication of fractions
- Division of fractions

Real-world Applications:
- Cooking and recipes
- Construction and measurements
- Financial calculations
- Scientific notation
`,
          resources: [
            {
              title: "Khan Academy - Fractions",
              url: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic",
            },
            {
              title: "Visual Fractions Learning",
              url: "https://www.visualfractions.com/",
            },
            {
              title: "Fraction/Decimal Games",
              url: "https://www.mathgames.com/fractions",
            },
          ],
        },
        4: {
          title: "Percentages",
          content: `
Percentages are a fundamental way of expressing parts per hundred. They are essential in daily life, from shopping discounts to financial planning.

Basic Concepts:
- What is a percentage
- Converting between fractions, decimals, and percentages
- Finding percentages of quantities
- Percentage increase and decrease

Applications:
- Discounts and sales tax
- Interest rates and loans
- Growth and decay
- Statistical analysis

Common Percentage Problems:
- Finding the original price
- Calculating percentage change
- Compound percentages
- Mark-ups and mark-downs

Tips for Mental Calculation:
- Working with common percentages (10%, 25%, 50%)
- Breaking down complex percentages
- Estimating reasonable answers
`,
          resources: [
            {
              title: "Khan Academy - Percentages",
              url: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-ratios-rates/pre-algebra-percent-problems/v/finding-percentages-example",
            },
            {
              title: "Percentage Calculator",
              url: "https://percentagecalculator.net/",
            },
            {
              title: "Real World Percentage Problems",
              url: "https://www.mathsisfun.com/percentage.html",
            },
          ],
        },
      },
      2: {
        // Algebra Fundamentals
        1: {
          title: "Variables and Constants",
          content: `
Variables and constants are the building blocks of algebra, allowing us to represent unknown values and solve complex problems.

Understanding Variables:
- What is a variable?
- When to use variables
- Naming conventions
- Domain and range

Constants vs Variables:
- Definition of constants
- Mathematical constants (π, e)
- Using constants in equations
- The role of coefficients

Expressions with Variables:
- Terms and like terms
- Simplifying expressions
- Substituting values
- Evaluating expressions

Practical Applications:
- Formulas in science
- Programming variables
- Real-world modeling
- Problem-solving strategies
`,
          resources: [
            {
              title: "Khan Academy - Variables",
              url: "https://www.khanacademy.org/math/algebra/introduction-to-algebra",
            },
            {
              title: "Algebra Basics",
              url: "https://www.purplemath.com/modules/variable.htm",
            },
            {
              title: "Interactive Algebra",
              url: "https://www.geogebra.org/algebra",
            },
          ],
        },
        2: {
          title: "Linear Equations",
          content: `
Linear equations are fundamental to algebra and form the basis for solving many real-world problems.

Basic Concepts:
- What makes an equation linear
- Standard form (ax + b = c)
- Solving step by step
- Checking solutions

Methods of Solving:
- Addition/subtraction property
- Multiplication/division property
- Combining like terms
- Cross multiplication

Word Problems:
- Translating words to equations
- Age problems
- Motion problems
- Mixture problems

Applications:
- Cost calculations
- Time and distance
- Revenue and profit
- Scientific formulas
`,
          resources: [
            {
              title: "Khan Academy - Linear Equations",
              url: "https://www.khanacademy.org/math/algebra/one-variable-linear-equations",
            },
            {
              title: "Linear Equation Solver",
              url: "https://www.mathway.com/Algebra",
            },
            {
              title: "Practice Problems",
              url: "https://www.algebra.com/algebra/homework/linear",
            },
          ],
        },
        3: {
          title: "Quadratic Equations",
          content: `
Quadratic equations represent relationships where one variable is squared, leading to curved relationships and multiple solutions.

Understanding Quadratics:
- Standard form (ax² + bx + c = 0)
- Graphing parabolas
- Finding vertex and axis of symmetry
- Real and complex solutions

Solving Methods:
- Factoring
- Completing the square
- Quadratic formula
- Graphical solutions

Applications:
- Projectile motion
- Area problems
- Revenue optimization
- Population growth

Common Mistakes:
- Sign errors
- Factoring errors
- Formula application
- Solution verification
`,
          resources: [
            {
              title: "Khan Academy - Quadratic Equations",
              url: "https://www.khanacademy.org/math/algebra/quadratic-equations",
            },
            {
              title: "Interactive Quadratic Explorer",
              url: "https://www.desmos.com/calculator/cahqdxeshd",
            },
            {
              title: "Practice and Examples",
              url: "https://www.mathsisfun.com/algebra/quadratic-equation.html",
            },
          ],
        },
      },
    },
    2: {
      // Physics
      1: {
        // Classical Mechanics
        1: {
          title: "Newton's Laws of Motion",
          content: `
Newton's Laws form the foundation of classical mechanics and explain how objects move under various forces.

First Law (Inertia):
- Objects maintain their state of motion
- Role of external forces
- Equilibrium conditions
- Real-world examples

Second Law (F = ma):
- Force and acceleration relationship
- Mass vs weight
- Multiple forces
- Problem-solving strategies

Third Law (Action-Reaction):
- Paired forces
- Conservation of momentum
- Common misconceptions
- Practical applications

Applications:
- Vehicle safety
- Sports physics
- Space travel
- Engineering design
`,
          resources: [
            {
              title: "Khan Academy - Newton's Laws",
              url: "https://www.khanacademy.org/science/physics/forces-newtons-laws",
            },
            {
              title: "Physics Classroom",
              url: "https://www.physicsclassroom.com/Physics-Tutorial/Newton-s-Laws",
            },
            {
              title: "Interactive Simulations",
              url: "https://phet.colorado.edu/en/simulations/category/physics/motion",
            },
          ],
        },
        2: {
          title: "Work and Energy",
          content: `
Understanding work and energy helps us analyze and predict how systems change and interact.

Types of Energy:
- Kinetic energy
- Potential energy
- Conservation of energy
- Energy transformations

Work:
- Definition and calculation
- Work-energy theorem
- Power
- Efficiency

Conservation Laws:
- Energy conservation
- Work-energy relationship
- Power calculations
- System analysis

Applications:
- Renewable energy
- Machine efficiency
- Sports science
- Energy storage
`,
          resources: [
            {
              title: "Khan Academy - Work and Energy",
              url: "https://www.khanacademy.org/science/physics/work-and-energy",
            },
            {
              title: "Energy Simulations",
              url: "https://phet.colorado.edu/en/simulations/energy-forms-and-changes",
            },
            { title: "Practice Problems", url: "https://physics.info/work/" },
          ],
        },
      },
    },
    3: {
      // Programming
      1: {
        // Frontend Development
        1: {
          title: "React Fundamentals",
          content: `
React is a popular JavaScript library for building user interfaces with reusable components.

Core Concepts:
- Components and Props
- State and Lifecycle
- Event Handling
- Conditional Rendering

Hooks:
- useState
- useEffect
- Custom Hooks
- Rules of Hooks

Component Patterns:
- Functional Components
- Class Components
- Higher-Order Components
- Render Props

Best Practices:
- Component Organization
- State Management
- Performance Optimization
- Error Handling
`,
          resources: [
            {
              title: "React Official Docs",
              url: "https://reactjs.org/docs/getting-started.html",
            },
            { title: "React Tutorial", url: "https://beta.reactjs.org/learn" },
            { title: "React Patterns", url: "https://www.patterns.dev/react" },
          ],
        },
        2: {
          title: "State Management",
          content: `
State management is crucial for handling data flow in modern web applications.

Core Concepts:
- Local vs Global State
- State Management Patterns
- Data Flow
- Immutability

Popular Solutions:
- Redux
- Context API
- MobX
- Zustand

Best Practices:
- State Structure
- Action Patterns
- Middleware Usage
- Performance Considerations

Common Patterns:
- Flux Architecture
- Command Pattern
- Observer Pattern
- Repository Pattern
`,
          resources: [
            { title: "Redux Documentation", url: "https://redux.js.org/" },
            {
              title: "State Management Guide",
              url: "https://www.taniarascia.com/redux-react-guide/",
            },
            {
              title: "React State Management",
              url: "https://www.patterns.dev/posts/react-state-management/",
            },
          ],
        },
      },
    },
  };

  const moduleData: ModuleData = {
    1: [
      {
        id: 1,
        title: "Foundation Mathematics",
        description: "Master the fundamental concepts of mathematics",
        topics: [
          {
            id: 1,
            title: "Number Systems",
            duration: "2 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Basic Arithmetic",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Fractions and Decimals",
            duration: "2.5 hours",
            completed: false,
          },
          {
            id: 4,
            title: "Percentages",
            duration: "2 hours",
            completed: false,
          },
        ],
        resources: [
          "Practice worksheets",
          "Video lectures",
          "Interactive problems",
        ],
        duration: "10 hours",
        progress: 0,
      },
      {
        id: 2,
        title: "Algebra Fundamentals",
        description: "Learn algebraic expressions and equations",
        topics: [
          {
            id: 1,
            title: "Variables and Constants",
            duration: "2 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Linear Equations",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Quadratic Equations",
            duration: "4 hours",
            completed: false,
          },
        ],
        resources: ["Formula sheet", "Practice problems", "Video tutorials"],
        duration: "12 hours",
        progress: 0,
      },
      {
        id: 3,
        title: "Geometry Basics",
        description: "Understand geometric shapes and properties",
        topics: [
          { id: 1, title: "2D Shapes", duration: "3 hours", completed: false },
          { id: 2, title: "3D Shapes", duration: "3 hours", completed: false },
          {
            id: 3,
            title: "Angles and Lines",
            duration: "2 hours",
            completed: false,
          },
        ],
        resources: [
          "Interactive diagrams",
          "Video lessons",
          "Practice exercises",
        ],
        duration: "8 hours",
        progress: 0,
      },
    ],
    2: [
      {
        id: 1,
        title: "Classical Mechanics",
        description: "Understanding motion, forces, and energy",
        topics: [
          {
            id: 1,
            title: "Newton's Laws",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Work and Energy",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Momentum and Collisions",
            duration: "2.5 hours",
            completed: false,
          },
          {
            id: 4,
            title: "Rotational Motion",
            duration: "3 hours",
            completed: false,
          },
        ],
        resources: [
          "Physics simulator",
          "Problem sets",
          "Video demonstrations",
        ],
        duration: "12 hours",
        progress: 0,
      },
      {
        id: 2,
        title: "Thermodynamics",
        description: "Study of heat, energy, and thermal processes",
        topics: [
          {
            id: 1,
            title: "Temperature and Heat",
            duration: "2 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Laws of Thermodynamics",
            duration: "4 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Heat Engines",
            duration: "3 hours",
            completed: false,
          },
        ],
        resources: [
          "Interactive simulations",
          "Lab exercises",
          "Practice problems",
        ],
        duration: "9 hours",
        progress: 0,
      },
      {
        id: 3,
        title: "Quantum Physics Basics",
        description: "Introduction to quantum mechanics concepts",
        topics: [
          {
            id: 1,
            title: "Wave-Particle Duality",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Quantum States",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Schrödinger Equation",
            duration: "4 hours",
            completed: false,
          },
        ],
        resources: [
          "Quantum visualizations",
          "Mathematical tools",
          "Research papers",
        ],
        duration: "10 hours",
        progress: 0,
      },
    ],
    3: [
      {
        id: 1,
        title: "Frontend Development",
        description: "Building modern user interfaces with React",
        topics: [
          {
            id: 1,
            title: "React Fundamentals",
            duration: "4 hours",
            completed: false,
          },
          {
            id: 2,
            title: "State Management",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Component Patterns",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 4,
            title: "Routing & Navigation",
            duration: "2 hours",
            completed: false,
          },
        ],
        resources: ["Code sandbox", "Documentation", "Practice projects"],
        duration: "12 hours",
        progress: 0,
      },
      {
        id: 2,
        title: "Backend Development",
        description: "Creating robust server applications with Node.js",
        topics: [
          {
            id: 1,
            title: "Node.js Basics",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Express Framework",
            duration: "4 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Database Integration",
            duration: "4 hours",
            completed: false,
          },
          {
            id: 4,
            title: "API Development",
            duration: "3 hours",
            completed: false,
          },
        ],
        resources: ["API documentation", "Backend templates", "Testing tools"],
        duration: "14 hours",
        progress: 0,
      },
      {
        id: 3,
        title: "Database Design",
        description: "Mastering database architecture and optimization",
        topics: [
          {
            id: 1,
            title: "SQL Fundamentals",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 2,
            title: "Schema Design",
            duration: "4 hours",
            completed: false,
          },
          {
            id: 3,
            title: "Indexing & Performance",
            duration: "3 hours",
            completed: false,
          },
          {
            id: 4,
            title: "Data Migration",
            duration: "2 hours",
            completed: false,
          },
        ],
        resources: ["Database diagrams", "SQL exercises", "Performance tools"],
        duration: "12 hours",
        progress: 0,
      },
    ],
  };

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
        <div className="flex justify-between items-center mb-8">
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

        {showModules && selectedPathway && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen py-8">
              <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        featuredPaths.find((p) => p.id === selectedPathway)
                          ?.title
                      }
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Your structured learning journey
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowModules(false);
                      setSelectedPathway(null);
                    }}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6 space-y-8">
                  {moduleData[selectedPathway]?.map((module, index) => (
                    <div
                      key={module.id}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="w-8 h-8 rounded-full bg-mindly-primary text-white flex items-center justify-center text-sm mr-3">
                              {index + 1}
                            </span>
                            {module.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {module.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{module.duration}</Badge>
                      </div>

                      <div className="space-y-4">
                        {module.topics.map((topic) => (
                          <div
                            key={topic.id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${
                                  topic.completed
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {topic.completed && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {topic.title}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Duration: {topic.duration}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTopic({
                                  moduleId: module.id,
                                  topicId: topic.id,
                                });
                                if (selectedPathway) {
                                  setSelectedTopic({
                                    moduleId: module.id,
                                    topicId: topic.id,
                                  });
                                  setShowBlog(true);
                                }
                              }}
                            >
                              Start
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {selectedTopic?.moduleId === module.id && showBlog && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <h4 className="text-lg font-semibold mb-4">
                            {
                              blogData[selectedPathway]?.[module.id]?.[
                                selectedTopic.topicId
                              ]?.title
                            }
                          </h4>
                          <div className="prose dark:prose-invert max-w-none">
                            {
                              blogData[selectedPathway]?.[module.id]?.[
                                selectedTopic.topicId
                              ]?.content
                            }
                          </div>
                          <div className="mt-6">
                            <h5 className="font-semibold mb-2">
                              Additional Resources:
                            </h5>
                            <ul className="space-y-2">
                              {blogData[selectedPathway]?.[module.id]?.[
                                selectedTopic.topicId
                              ]?.resources.map((resource, idx) => (
                                <li key={idx}>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {resource.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {module.resources.map((resource, i) => (
                            <Badge key={i} variant="outline">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
                        onClick={() => {
                          setSelectedPathway(path.id);
                          setShowModules(true);
                        }}
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

            {/* Create Pathway Button */}
            {session && (
              <div className="mt-8">
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-mindly-primary hover:bg-mindly-primary/90"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {showCreateForm ? "Cancel" : "Create New Pathway"}
                </Button>
              </div>
            )}

            {/* Create Pathway Form */}
            {showCreateForm && (
              <Card className="p-6 mt-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Create New Learning Pathway
                </h3>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                    {successMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newPathway.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Complete JavaScript Mastery"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={newPathway.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Programming"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="difficulty_level">Difficulty Level</Label>
                      <select
                        id="difficulty_level"
                        name="difficulty_level"
                        value={newPathway.difficulty_level}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="estimated_hours">Estimated Hours</Label>
                      <Input
                        id="estimated_hours"
                        name="estimated_hours"
                        type="number"
                        value={newPathway.estimated_hours?.toString() || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 40"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newPathway.description || ""}
                        onChange={handleInputChange}
                        placeholder="Describe what learners will achieve"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label>Prerequisites</Label>
                      <div className="flex space-x-2 mb-2">
                        <Input
                          value={prerequisiteInput}
                          onChange={(e) => setPrerequisiteInput(e.target.value)}
                          placeholder="e.g. Basic HTML knowledge"
                        />
                        <Button
                          type="button"
                          onClick={handleAddPrerequisite}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {newPathway.prerequisites?.map((prereq, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{prereq}</span>
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => handleRemovePrerequisite(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={newPathway.is_featured || false}
                        onChange={(e) =>
                          setNewPathway((prev) => ({
                            ...prev,
                            is_featured: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-mindly-primary focus:ring-mindly-primary"
                      />
                      <Label htmlFor="is_featured">Feature this pathway</Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePathway}
                    disabled={
                      isLoading || !newPathway.title || !newPathway.subject
                    }
                    className="bg-mindly-primary hover:bg-mindly-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Creating...
                      </>
                    ) : (
                      "Create Pathway"
                    )}
                  </Button>
                </div>
              </Card>
            )}
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
