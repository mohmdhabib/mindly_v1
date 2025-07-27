import { useState, useRef, useEffect } from 'react';
import { Search, Send, Sparkles, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ChatInterface() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Explain quantum physics in simple terms",
    "Help me solve calculus problems",
    "Teach me Spanish conversation",
    "Guide me through organic chemistry",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle query submission
      console.log('Submitting query:', query);
      setQuery('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition logic here
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ask Your AI Subject Matter Expert
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get instant answers, explanations, and guidance from specialized AI teachers
        </p>
      </div>

      {/* Main Search Interface */}
      <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your SME anything..."
              className="w-full pl-12 pr-32 py-4 text-lg bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-mindly-primary/50 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 placeholder:text-gray-400"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                className={`rounded-full w-10 h-10 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 ${
                  isListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''
                }`}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!query.trim()}
                className="rounded-full px-4 py-2 bg-gradient-to-r from-mindly-primary to-mindly-accent hover:from-mindly-primary/90 hover:to-mindly-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline" size="sm" className="rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Surprise Me
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Math Help
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Science Q&A
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Language Learning
          </Button>
        </div>
      </Card>

      {/* Suggestions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Questions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50"
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-mindly-primary/20 to-mindly-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-mindly-primary" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {suggestion}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}