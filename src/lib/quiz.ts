// lib/quiz.ts - Enhanced quiz types and API service

export type Subject = 'Mathematics' | 'Science' | 'Programming' | 'History' | 'Geography';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'very hard';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
  subject: Subject;
  explanation?: string;
}

export interface AIPersonality {
  name: string;
  description: string;
  accuracy: { easy: number; medium: number; hard: number; 'very hard': number };
  responseStyle: string;
}

export interface QuizDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface ScoreSystem {
  easy: number;
  medium: number;
  hard: number;
  'very hard': number;
}

// Scoring system similar to quiz.com
export const SCORE_SYSTEM: ScoreSystem = {
  easy: 10,
  medium: 20,
  hard: 30,
  'very hard': 40
};

export function getScore(difficulty: Difficulty): number {
  return SCORE_SYSTEM[difficulty];
}

// AI Personalities based on difficulty selection
export const AI_PERSONALITIES: Record<Difficulty, AIPersonality> = {
  easy: {
    name: "Elementary AI",
    description: "Learning alongside 6th graders",
    accuracy: { easy: 0.85, medium: 0.60, hard: 0.35, 'very hard': 0.20 },
    responseStyle: "I'm still learning this topic, let me think..."
  },
  medium: {
    name: "Scholar AI",
    description: "High school graduate level",
    accuracy: { easy: 0.95, medium: 0.80, hard: 0.65, 'very hard': 0.40 },
    responseStyle: "Based on what I studied, I believe..."
  },
  hard: {
    name: "Expert AI",
    description: "College graduate level",
    accuracy: { easy: 0.98, medium: 0.90, hard: 0.80, 'very hard': 0.65 },
    responseStyle: "From my understanding of this concept..."
  },
  'very hard': {
    name: "Master AI",
    description: "Masters degree holder level",
    accuracy: { easy: 0.99, medium: 0.95, hard: 0.88, 'very hard': 0.75 },
    responseStyle: "Drawing from advanced knowledge..."
  }
};

// Question distribution for 15 questions
export const QUESTION_DISTRIBUTION: QuizDistribution = {
  easy: 6,
  medium: 5,
  hard: 4
};

class QuizAPIService {
  private readonly baseUrl = 'https://opentdb.com/api.php';
  private readonly fallbackQuestions: QuizQuestion[] = [
    // Mathematics
    {
      question: 'What is 15 × 8?',
      options: ['110', '120', '130', '140'],
      answer: '120',
      difficulty: 'easy',
      subject: 'Mathematics',
      explanation: '15 × 8 = 120'
    },
    {
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²'],
      answer: '2x',
      difficulty: 'hard',
      subject: 'Mathematics',
      explanation: 'The derivative of x² is 2x using the power rule'
    },
    // Science
    {
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      answer: 'Au',
      difficulty: 'medium',
      subject: 'Science',
      explanation: 'Au comes from the Latin word "aurum" meaning gold'
    },
    {
      question: 'What is the speed of light in vacuum?',
      options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '301,000,000 m/s'],
      answer: '299,792,458 m/s',
      difficulty: 'hard',
      subject: 'Science',
      explanation: 'The speed of light in vacuum is exactly 299,792,458 meters per second'
    },
    // Programming
    {
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
      answer: 'Hyper Text Markup Language',
      difficulty: 'easy',
      subject: 'Programming',
      explanation: 'HTML stands for HyperText Markup Language'
    },
    {
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      answer: 'O(log n)',
      difficulty: 'hard',
      subject: 'Programming',
      explanation: 'Binary search has O(log n) time complexity as it halves the search space each iteration'
    },
    // History
    {
      question: 'In which year did World War II end?',
      options: ['1944', '1945', '1946', '1947'],
      answer: '1945',
      difficulty: 'easy',
      subject: 'History',
      explanation: 'World War II ended in 1945 with Japan\'s surrender'
    },
    {
      question: 'Who was the first Holy Roman Emperor?',
      options: ['Charlemagne', 'Otto I', 'Frederick Barbarossa', 'Henry IV'],
      answer: 'Charlemagne',
      difficulty: 'hard',
      subject: 'History',
      explanation: 'Charlemagne was crowned as the first Holy Roman Emperor in 800 AD'
    },
    // Geography
    {
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      answer: 'Canberra',
      difficulty: 'medium',
      subject: 'Geography',
      explanation: 'Canberra is the capital city of Australia'
    },
    {
      question: 'Which country has the most time zones?',
      options: ['Russia', 'USA', 'China', 'France'],
      answer: 'France',
      difficulty: 'hard',
      subject: 'Geography',
      explanation: 'France has 12 time zones due to its overseas territories'
    }
  ];

  private categoryMap: Record<Subject, number> = {
    Mathematics: 19,
    Science: 17,
    Programming: 18,
    History: 23,
    Geography: 22
  };

  private decodeHtmlEntities(str: string): string {
    const entityMap: Record<string, string> = {
      '&quot;': '"',
      '&#039;': "'",
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&apos;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
    
    return str.replace(/&[#\w]+;/g, (entity) => entityMap[entity] || entity);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public async fetchQuestionsFromAPI(
    subject: Subject,
    difficulty: Difficulty,
    amount: number
  ): Promise<QuizQuestion[]> {
    // Convert 'very hard' to 'hard' for API compatibility
    const apiDifficulty = difficulty === 'very hard' ? 'hard' : difficulty;
    try {
      const category = this.categoryMap[subject];
      let url = `${this.baseUrl}?amount=${amount}&type=multiple&difficulty=${apiDifficulty}`;
      
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code !== 0 || !data.results) {
        throw new Error('API request failed');
      }

      return data.results.map((item: any): QuizQuestion => {
        const options = this.shuffleArray([
          ...item.incorrect_answers.map((ans: string) => this.decodeHtmlEntities(ans)),
          this.decodeHtmlEntities(item.correct_answer)
        ]);

        return {
          question: this.decodeHtmlEntities(item.question),
          options,
          answer: this.decodeHtmlEntities(item.correct_answer),
          difficulty: difficulty as Difficulty,
          subject,
          explanation: `The correct answer is ${this.decodeHtmlEntities(item.correct_answer)}`
        };
      });
    } catch (error) {
      console.warn(`Failed to fetch ${difficulty} questions for ${subject}:`, error);
      return [];
    }
  }

  public getFallbackQuestions(
    subject: Subject,
    difficulty: Difficulty,
    amount: number
  ): QuizQuestion[] {
    let filtered = this.fallbackQuestions.filter(
      q => q.subject === subject && q.difficulty === difficulty
    );

    // If not enough questions for the specific subject/difficulty, get from other subjects
    if (filtered.length < amount) {
      const otherQuestions = this.fallbackQuestions.filter(
        q => q.difficulty === difficulty && !filtered.some(f => f.question === q.question)
      );
      filtered = [...filtered, ...otherQuestions];
    }

    // If still not enough, get any remaining questions
    if (filtered.length < amount) {
      const remainingQuestions = this.fallbackQuestions.filter(
        q => !filtered.some(f => f.question === q.question)
      );
      filtered = [...filtered, ...remainingQuestions];
    }

    return this.shuffleArray(filtered).slice(0, amount);
  }

  async getQuizQuestions(subject: Subject): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];
    
    // Fetch questions for each difficulty level
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      const needed = QUESTION_DISTRIBUTION[difficulty];
      let fetchedQuestions: QuizQuestion[] = [];

      // Try to fetch from API first
      try {
        fetchedQuestions = await this.fetchQuestionsFromAPI(subject, difficulty, needed * 2); // Fetch extra for variety
        fetchedQuestions = fetchedQuestions.slice(0, needed);
      } catch (error) {
        console.warn(`API fetch failed for ${difficulty} ${subject} questions`);
      }

      // Fill remaining with fallback questions
      if (fetchedQuestions.length < needed) {
        const fallbackNeeded = needed - fetchedQuestions.length;
        const fallbackQuestions = this.getFallbackQuestions(subject, difficulty, fallbackNeeded);
        fetchedQuestions = [...fetchedQuestions, ...fallbackQuestions];
      }

      questions.push(...fetchedQuestions.slice(0, needed));
    }

    // Shuffle the final question set
    return this.shuffleArray(questions);
  }

  generateAIResponse(question: QuizQuestion, aiDifficulty: Difficulty): {
    answer: string;
    explanation: string;
    isCorrect: boolean;
  } {
    const personality = AI_PERSONALITIES[aiDifficulty];
    const accuracy = personality.accuracy[question.difficulty];
    const isCorrect = Math.random() < accuracy;
    
    let selectedAnswer: string;
    if (isCorrect) {
      selectedAnswer = question.answer;
    } else {
      // Select a wrong answer
      const wrongAnswers = question.options.filter(opt => opt !== question.answer);
      selectedAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }

    const explanation = `${personality.responseStyle} ${isCorrect ? 'I got it right!' : 'I think I made an error here.'}`;

    return {
      answer: selectedAnswer,
      explanation,
      isCorrect
    };
  }
}

// Export singleton instance
export const quizAPI = new QuizAPIService();

// Legacy function for backward compatibility
export async function getQuestions(
  subject: Subject,
  difficulty: Difficulty,
  count: number
): Promise<QuizQuestion[]> {
  // This function is now a wrapper around the QuizAPIService methods
  // to maintain backward compatibility while centralizing the logic.

  try {
    const questions = await quizAPI.fetchQuestionsFromAPI(subject, difficulty, count);
    
    if (questions.length < count) {
      console.warn(`API returned only ${questions.length} of ${count} requested questions. Filling with fallback questions.`);
      const fallbackNeeded = count - questions.length;
      const fallbackQuestions = quizAPI.getFallbackQuestions(subject, difficulty, fallbackNeeded);
      return [...questions, ...fallbackQuestions];
    }
    
    return questions;
  } catch (error) {
    console.error(`API fetch failed for ${subject} (${difficulty}). Using fallback questions.`, error);
    return quizAPI.getFallbackQuestions(subject, difficulty, count);
  }
}

export async function aiAnswerAdvanced(
  question: QuizQuestion,
  options: { difficulty: Difficulty }
): Promise<{ answer: string; explanation: string }> {
  const response = quizAPI.generateAIResponse(question, options.difficulty);
  return {
    answer: response.answer,
    explanation: response.explanation
  };
}