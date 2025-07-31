
import type { Difficulty, Subject, QuizQuestion } from '@/lib/quiz';
import { useEffect, useState } from 'react';

// Example fallback question bank (can be imported from quiz.ts if you want to share)
const fallbackBank: QuizQuestion[] = [
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: '4',
    difficulty: 'easy',
    subject: 'Mathematics',
  },
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Rome'],
    answer: 'Paris',
    difficulty: 'easy',
    subject: 'Geography',
  },
  {
    question: 'Who wrote Hamlet?',
    options: ['Shakespeare', 'Dickens', 'Austen', 'Hemingway'],
    answer: 'Shakespeare',
    difficulty: 'medium',
    subject: 'History',
  },
  {
    question: 'What is the boiling point of water?',
    options: ['90°C', '100°C', '110°C', '120°C'],
    answer: '100°C',
    difficulty: 'easy',
    subject: 'Science',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
    answer: 'Mars',
    difficulty: 'easy',
    subject: 'Science',
  },
  {
    question: 'What is the largest ocean?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    answer: 'Pacific',
    difficulty: 'medium',
    subject: 'Geography',
  },
  {
    question: 'What does HTML stand for?',
    options: ['Hyper Trainer Marking Language', 'Hyper Text Markup Language', 'Hyper Text Marketing Language', 'Hyper Text Markup Leveler'],
    answer: 'Hyper Text Markup Language',
    difficulty: 'easy',
    subject: 'Programming',
  },
  // ...add more as needed
];

function getRandomQuestions(subject: Subject, difficulty: Difficulty, count: number): QuizQuestion[] {
  // Filter by subject/difficulty, fallback to any if not enough
  let filtered = fallbackBank.filter(q => q.subject === subject && q.difficulty === difficulty);
  if (filtered.length < count) {
    filtered = filtered.concat(fallbackBank.filter(q => q.difficulty === difficulty && !filtered.includes(q)));
  }
  if (filtered.length < count) {
    filtered = filtered.concat(fallbackBank.filter(q => !filtered.includes(q)));
  }
  // Shuffle
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  return filtered.slice(0, count);
}

/**
 * React hook to provide quiz questions with instant randoms, then live API replacement.
 * @param subject Subject of the quiz
 * @param difficulty Difficulty level
 * @param count Number of questions
 * @returns [questions, loading]
 */
export function useQuizQuestions(subject: Subject, difficulty: Difficulty, count: number): [QuizQuestion[], boolean] {
  // 1. Start with random fallback questions
  const initialQuestions: QuizQuestion[] = getRandomQuestions(subject, difficulty, count);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setQuestions(getRandomQuestions(subject, difficulty, count));
    setLoading(true);

    // Helper to replace randoms with real questions
    function fillQuestions(realQs: QuizQuestion[]) {
      setQuestions(prevQs => {
        let idx = 0;
        const updated = [...prevQs];
        for (let q of realQs) {
          // Only skip if this real question is already present
          if (updated.some(existing => !existing.question.startsWith('Placeholder question') && existing.question === q.question)) {
            continue;
          }
          // Find next non-real (i.e., fallback/random) question
          while (idx < updated.length && fallbackBank.some(fb => fb.question === updated[idx].question)) idx++;
          if (idx < updated.length) {
            updated[idx] = q;
            idx++;
          }
        }
        return updated;
      });
    }

    async function fetchQuestions() {
      // Map our subject/difficulty to Open Trivia DB API params
      const categoryMap: Record<Subject, number | undefined> = {
        Mathematics: 19,
        Science: 17,
        Programming: 18,
        History: 23,
        Geography: 22
      };
      const apiDifficulty = difficulty === 'very hard' ? 'hard' : difficulty;
      const category = categoryMap[subject];

      // 1. Fetch from API with subject category
      let apiQuestions: QuizQuestion[] = [];
      try {
        let apiUrl = `https://opentdb.com/api.php?amount=${count}`;
        if (category) apiUrl += `&category=${category}`;
        if (apiDifficulty) apiUrl += `&difficulty=${encodeURIComponent(apiDifficulty)}`;
        apiUrl += '&type=multiple';
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            apiQuestions = data.results.map((q: any) => {
              const decode = (str: string) => str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
              const options = [...q.incorrect_answers, q.correct_answer].map(decode);
              for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
              }
              return {
                question: decode(q.question),
                options,
                answer: decode(q.correct_answer),
                difficulty: (q.difficulty === 'hard' ? (difficulty === 'very hard' ? 'very hard' : 'hard') : q.difficulty) as Difficulty,
                subject,
              };
            });
            if (!cancelled) fillQuestions(apiQuestions);
          }
        }
      } catch (e) {
        // ignore API error
      }

      // 2. If not enough, fetch more from API with NO category (all subjects) until enough or max attempts
      let totalNeeded = count;
      let attempts = 0;
      const maxAttempts = 5;
      while (
        !cancelled &&
        questions.filter(q => fallbackBank.some(fb => fb.question === q.question)).length > 0 &&
        attempts < maxAttempts &&
        totalNeeded > 0
      ) {
        try {
          let batchSize = Math.min(20, totalNeeded);
          let apiUrl = `https://opentdb.com/api.php?amount=${batchSize}`;
          if (apiDifficulty) apiUrl += `&difficulty=${encodeURIComponent(apiDifficulty)}`;
          apiUrl += '&type=multiple';
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
              const decode = (str: string) => str.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
              const newQs = data.results.map((q: any) => {
                const options = [...q.incorrect_answers, q.correct_answer].map(decode);
                for (let i = options.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [options[i], options[j]] = [options[j], options[i]];
                }
                return {
                  question: decode(q.question),
                  options,
                  answer: decode(q.correct_answer),
                  difficulty: (q.difficulty === 'hard' ? (difficulty === 'very hard' ? 'very hard' : 'hard') : q.difficulty) as Difficulty,
                  subject: subject,
                };
              });
              if (!cancelled) fillQuestions(newQs);
            } else {
              break;
            }
          } else {
            break;
          }
        } catch (e) {
          break;
        }
        totalNeeded = questions.filter(q => fallbackBank.some(fb => fb.question === q.question)).length;
        attempts++;
      }
      if (!cancelled) setLoading(false);
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, difficulty, count]);

  return [questions, loading];
}
