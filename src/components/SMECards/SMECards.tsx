import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Atom, 
  Globe, 
  Palette, 
  Code, 
  BookOpen, 
  Languages,
  Music,
  Star,
  Users,
  ArrowRight,
  Zap
} from 'lucide-react';

interface SME {
  id: string;
  name: string;
  subject: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  rating: number;
  studentsHelped: number;
  expertise: string[];
  color: string;
  gradient: string;
}

const smeData: SME[] = [
  {
    id: 'math',
    name: 'Dr. Equation',
    subject: 'Mathematics',
    description: 'From basic arithmetic to advanced calculus, I make math concepts crystal clear and engaging.',
    icon: Calculator,
    rating: 4.9,
    studentsHelped: 2847,
    expertise: ['Calculus', 'Algebra', 'Statistics', 'Geometry'],
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'science',
    name: 'Prof. Atom',
    subject: 'Physics & Chemistry',
    description: 'Explore the fundamental laws of nature and chemical reactions with practical examples.',
    icon: Atom,
    rating: 4.8,
    studentsHelped: 1923,
    expertise: ['Quantum Physics', 'Organic Chemistry', 'Thermodynamics'],
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'history',
    name: 'Ms. Chronicle',
    subject: 'History & Social Studies',
    description: 'Journey through time and understand how past events shape our present world.',
    icon: Globe,
    rating: 4.7,
    studentsHelped: 1654,
    expertise: ['World History', 'Political Science', 'Geography'],
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'arts',
    name: 'Maestro Canvas',
    subject: 'Arts & Design',
    description: 'Unleash your creativity with guidance in visual arts, design principles, and artistic techniques.',
    icon: Palette,
    rating: 4.8,
    studentsHelped: 1234,
    expertise: ['Digital Art', 'Color Theory', 'Design Principles'],
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'programming',
    name: 'Code Master',
    subject: 'Programming & Tech',
    description: 'Master programming languages and software development with hands-on guidance.',
    icon: Code,
    rating: 4.9,
    studentsHelped: 3421,
    expertise: ['Python', 'JavaScript', 'Data Structures', 'AI/ML'],
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'literature',
    name: 'Prof. Wordsmith',
    subject: 'Literature & Writing',
    description: 'Enhance your writing skills and explore the rich world of literature and language.',
    icon: BookOpen,
    rating: 4.7,
    studentsHelped: 1876,
    expertise: ['Creative Writing', 'Literary Analysis', 'Grammar'],
    color: 'text-teal-600',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'languages',
    name: 'Polyglot Pro',
    subject: 'World Languages',
    description: 'Learn new languages with immersive conversation practice and cultural insights.',
    icon: Languages,
    rating: 4.8,
    studentsHelped: 2156,
    expertise: ['Spanish', 'French', 'Mandarin', 'Conversation'],
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'music',
    name: 'Harmony Sage',
    subject: 'Music Theory',
    description: 'Understand music theory, composition, and develop your musical skills and ear.',
    icon: Music,
    rating: 4.6,
    studentsHelped: 987,
    expertise: ['Music Theory', 'Composition', 'Instrument Learning'],
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600'
  }
];

export function SMECards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Your AI Subject Matter Experts
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose from our specialized AI teachers, each expert in their field and ready to guide your learning journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {smeData.map((sme) => (
          <Card
            key={sme.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 overflow-hidden ${
              hoveredCard === sme.id ? 'ring-2 ring-mindly-primary/50' : ''
            }`}
            onMouseEnter={() => setHoveredCard(sme.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Header with gradient */}
            <div className={`h-20 bg-gradient-to-r ${sme.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
            </div>

            <div className="p-6 relative">
              {/* Avatar */}
              <div className={`w-16 h-16 bg-gradient-to-r ${sme.gradient} rounded-2xl flex items-center justify-center -mt-12 mb-4 shadow-lg`}>
                <sme.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-mindly-primary transition-colors">
                    {sme.name}
                  </h3>
                  <p className={`font-semibold ${sme.color}`}>
                    {sme.subject}
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {sme.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{sme.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{sme.studentsHelped.toLocaleString()}</span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1">
                  {sme.expertise.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {sme.expertise.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      +{sme.expertise.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full mt-4 rounded-xl bg-gradient-to-r ${sme.gradient} hover:shadow-lg transition-all duration-200 group/btn`}
                >
                  <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View All SMEs */}
      <div className="text-center mt-12">
        <Button
          variant="outline"
          size="lg"
          className="px-8 py-4 rounded-full border-2 border-mindly-primary/30 hover:border-mindly-primary hover:bg-mindly-primary/5 transition-all duration-300"
        >
          View All Subject Matter Experts
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}