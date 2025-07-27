import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Settings, 
  Clock, 
  ChevronDown,
  Brain,
  Calculator,
  Atom,
  Code,
  BookOpen,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  type: 'user' | 'sme';
  content: string;
  timestamp: Date;
  sme?: {
    name: string;
    subject: string;
    avatar: string;
  };
  codeBlock?: {
    language: string;
    code: string;
  };
}

export function Mindspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'sme',
      content: "Hello! I'm Dr. Equation, your Mathematics SME. I'm here to help you understand any math concept, from basic arithmetic to advanced calculus. What would you like to learn today?",
      timestamp: new Date(Date.now() - 300000),
      sme: {
        name: 'Dr. Equation',
        subject: 'Mathematics',
        avatar: 'DE'
      }
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSME, setSelectedSME] = useState({
    name: 'Dr. Equation',
    subject: 'Mathematics',
    avatar: 'DE',
    icon: Calculator
  });
  const [sessionTime, setSessionTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const smeOptions = [
    { name: 'Dr. Equation', subject: 'Mathematics', avatar: 'DE', icon: Calculator },
    { name: 'Prof. Atom', subject: 'Physics & Chemistry', avatar: 'PA', icon: Atom },
    { name: 'Code Master', subject: 'Programming', avatar: 'CM', icon: Code },
    { name: 'Prof. Wordsmith', subject: 'Literature', avatar: 'PW', icon: BookOpen }
  ];

  const suggestionChips = [
    "Explain quadratic equations",
    "Help with calculus derivatives",
    "Solve this math problem",
    "What is integration?"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate SME response
    setTimeout(() => {
      const smeResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'sme',
        content: generateSMEResponse(currentMessage),
        timestamp: new Date(),
        sme: selectedSME
      };
      setMessages(prev => [...prev, smeResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateSMEResponse = (userMessage: string): string => {
    if (userMessage.toLowerCase().includes('quadratic')) {
      return "A quadratic equation is a polynomial equation of degree 2, typically written as ax² + bx + c = 0. The solutions can be found using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. Would you like me to walk through a specific example?";
    }
    return `Great question! Let me help you understand that concept better. ${selectedSME.subject} is a fascinating field with many interconnected ideas. What specific aspect would you like to explore further?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-mindly-bg dark:bg-gray-900 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* SME Selector */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white font-semibold">
                    {selectedSME.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedSME.name}
                    </h2>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedSME.subject}
                  </p>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Mathematics</span>
                <span>•</span>
                <span>Algebra</span>
                <span>•</span>
                <span>Quadratic Equations</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Session Timer */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatTime(sessionTime)}</span>
              </div>

              {/* Settings */}
              <Button variant="ghost" size="sm" className="rounded-full">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'sme' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white text-xs font-semibold">
                        {message.sme?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {message.sme?.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-mindly-primary text-white ml-12'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-700/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.codeBlock && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between bg-gray-800 px-3 py-2">
                        <span className="text-xs text-gray-300">{message.codeBlock.language}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(message.codeBlock!.code)}
                          className="text-gray-300 hover:text-white h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <SyntaxHighlighter
                        language={message.codeBlock.language}
                        style={tomorrow}
                        customStyle={{ margin: 0, fontSize: '0.875rem' }}
                      >
                        {message.codeBlock.code}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>

                {message.type === 'sme' && (
                  <div className="flex items-center space-x-2 mt-2 ml-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right mr-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white text-xs font-semibold">
                    {selectedSME.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20 p-4">
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestionChips.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setCurrentMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your SME anything..."
              className="w-full pl-4 pr-32 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl focus:ring-2 focus:ring-mindly-primary/50 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 placeholder:text-gray-400 resize-none min-h-[48px] max-h-32"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                size="sm"
                className="rounded-full w-8 h-8 p-0 bg-mindly-primary hover:bg-mindly-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-l border-gray-200/20 dark:border-gray-700/20 p-4 hidden lg:block">
        <div className="space-y-6">
          {/* Conversation History */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {['Quadratic Equations', 'Calculus Basics', 'Linear Algebra'].map((topic, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{topic}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Learning Resources</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80">
                <div className="font-medium text-sm text-gray-900 dark:text-white">Formula Sheet</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Quadratic formulas</div>
              </div>
              <div className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80">
                <div className="font-medium text-sm text-gray-900 dark:text-white">Practice Problems</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">10 exercises</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-2" />
                Switch SME
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Study Materials
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}