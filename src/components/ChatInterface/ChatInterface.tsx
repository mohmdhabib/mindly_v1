import { useState, useRef, useEffect } from 'react';
import { Search, Send, Mic, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSME } from '@/hooks/useSME';
import ReactMarkdown from 'react-markdown';
import { smes } from '@/lib/sme';

export function ChatInterface() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [smeType, setSmeType] = useState<keyof typeof smes>('math');
  const { isLoading, messages, sendMessage } = useSME(smeType);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      sendMessage(query);
      setQuery('');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition logic here
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

      {/* SME Selector */}
      <div className="flex justify-center gap-2 mb-4">
        <Button onClick={() => setSmeType('math')} variant={smeType === 'math' ? 'default' : 'outline'}>
          Math
        </Button>
        <Button onClick={() => setSmeType('science')} variant={smeType === 'science' ? 'default' : 'outline'}>
          Science
        </Button>
        <Button onClick={() => setSmeType('history')} variant={smeType === 'history' ? 'default' : 'outline'}>
          History
        </Button>
        <Button onClick={() => setSmeType('english')} variant={smeType === 'english' ? 'default' : 'outline'}>
          English
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <Card key={index} className={`p-4 ${message.isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </Card>
        ))}
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
                disabled={!query.trim() || isLoading}
                className="rounded-full px-4 py-2 bg-gradient-to-r from-mindly-primary to-mindly-accent hover:from-mindly-primary/90 hover:to-mindly-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
}