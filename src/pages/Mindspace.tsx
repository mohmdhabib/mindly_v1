import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Mic,
  Settings,
  Clock,
  ChevronDown,
  Brain,
  BookOpen,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { DocumentUploader } from '@/components/DocumentUploader/DocumentUploader';
import { DocumentList } from '@/components/DocumentList/DocumentList';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { generateResponse } from '@/lib/ai';
import { smes, SMEKey } from '@/lib/sme';
import { getConversations, getConversation, createConversation, updateConversation } from '@/lib/services';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

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
  source?: {
    name: string;
    url: string;
  };
}

const initialMessage: Message = {
    id: '1',
    type: 'sme',
    content: "learn any topic in depth with Mindly Academy's expert SMEs.",
    timestamp: new Date(Date.now() - 300000),
    sme: {
      name: 'MINDLY',
      subject: 'Mindly Academy',
      avatar: 'MY'
    }
  };

  

export function Mindspace() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSMEKey, setSelectedSMEKey] = useState<SMEKey>('math');
  const [sessionTime, setSessionTime] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestionChips = smes[selectedSMEKey].suggestions;

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    fetchConversations();
    return () => clearInterval(timer);
  }, []);

  const fetchConversations = async () => {
    const data = await getConversations();
    setConversations(data);
  };

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

  const handleSendMessage = async () => {
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

    const sme = smes[selectedSMEKey];

    const history = messages.map(msg => ({
      role: msg.type,
      content: msg.content,
    }));

    let context = '';
    let results: any[] = [];
    if (selectedDocument) {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        model: 'embedding-001',
      });
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents',
      });
      results = await vectorStore.similaritySearch(currentMessage, 1, {
        documentId: selectedDocument,
      });
      context = results.map((res) => res.pageContent).join('\n');
    }

    const response = await generateResponse(
      currentMessage,
      history,
      sme.prompt,
      context
    );

    const smeResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'sme',
      content: response as string,
      timestamp: new Date(),
      sme: {
        name: sme.name,
        subject: sme.systemContext,
        avatar: sme.name.substring(0, 2).toUpperCase(),
      },
      source:
        selectedDocument && results.length > 0
          ? {
              name: results[0].metadata.name as string,
              url: results[0].metadata.url as string,
            }
          : undefined,
    };
    setMessages(prev => [...prev, smeResponse]);
    setIsTyping(false);

    // Store conversation
    const updatedMessages = [...messages, userMessage, smeResponse];
    if (currentConversationId) {
      await updateConversation(currentConversationId, updatedMessages);
    } else {
      const data = await createConversation(selectedSMEKey, currentMessage.substring(0, 20), updatedMessages);
      if (data) {
        setCurrentConversationId(data.id);
      }
    }
    fetchConversations();
  };

  const handleSelectConversation = async (conversationId: string) => {
    const data = await getConversation(conversationId);
    if (data) {
      const loadedMessages = data.messages as unknown as Message[];
      if (Array.isArray(loadedMessages)) {
        const messagesWithDates = loadedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } else {
        setMessages([]);
      }
      setSelectedSMEKey(data.sme_type as SMEKey);
      setCurrentConversationId(conversationId);
    }
  };

  const handleNewChat = () => {
    setMessages([initialMessage]);
    setCurrentConversationId(null);
    setCurrentMessage('');
  }

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
    <div className="min-h-screen flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 p-4 pt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* SME Selector */}
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-mindly-primary to-mindly-accent text-white font-semibold">
                          {smes[selectedSMEKey].name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {smes[selectedSMEKey].name}
                          </h2>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {smes[selectedSMEKey].systemContext.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.keys(smes).map((key) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => setSelectedSMEKey(key as SMEKey)}
                      >
                        {smes[key as SMEKey].name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                  
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

                  {message.source && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Source: <a href={message.source.url} target="_blank" rel="noopener noreferrer" className="underline">{message.source.name}</a>
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
                    {smes[selectedSMEKey].name.substring(0, 2).toUpperCase()}
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
            {smes[selectedSMEKey].suggestions.map((suggestion, index) => (
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
              <DocumentUploader />
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
        <div className="sticky top-0 max-h-screen overflow-y-auto">
          {/* Recent Conversations */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recent Conversations</h3>
              <Button variant="ghost" size="sm" onClick={handleNewChat}>New Chat</Button>
            </div>
            <div className="space-y-2">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === convo.id
                      ? 'bg-mindly-primary/20 dark:bg-mindly-primary/30'
                      : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleSelectConversation(convo.id)}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-white">{convo.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(convo.updated_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <DocumentList onSelectDocument={(doc) => setSelectedDocument(doc.id)} />
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