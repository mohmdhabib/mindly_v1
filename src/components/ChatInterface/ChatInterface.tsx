import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Mic, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSME } from '@/hooks/useSME';
import ReactMarkdown from 'react-markdown';
import { smes } from '@/lib/sme';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';


type SmeType = keyof typeof smes;

interface ChatInterfaceProps {
  selectedDocumentId: string | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedDocumentId }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [smeType, setSmeType] = useState<SmeType>('math');
  const { isLoading, messages, sendMessage } = useSME(smeType);
  const [chatDocMessages, setChatDocMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [chatDocLoading, setChatDocLoading] = useState(false);
  const [documentChunks, setDocumentChunks] = useState<string[]>([]); // Store document chunks
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Switch to english SME when document is selected and fetch chunks
  useEffect(() => {
    console.log('useEffect triggered - selectedDocumentId:', selectedDocumentId);
    if (selectedDocumentId) {
      console.log('Document selected, switching to english SME and fetching chunks...');
      setSmeType('english'); // Use 'english' instead of 'chatdoc' to avoid DB constraint
      fetchDocumentChunks(selectedDocumentId);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedDocumentId]);

  // Fetch document chunks when document is selected
  const fetchDocumentChunks = async (documentId: string) => {
    console.log('fetchDocumentChunks called with documentId:', documentId);
    try {
      console.log('Fetching chunks from Supabase for document:', documentId);
      const { data: chunks, error } = await supabase
        .from('document_chunks')
        .select('chunk_text')
        .eq('document_id', documentId);

      console.log('Supabase response - data:', chunks, 'error:', error);

      if (error) {
        console.error('Error fetching chunks:', error);
        setDocumentChunks([]);
        toast({
          title: "Error",
          description: "Failed to load document chunks",
          variant: "destructive",
        });
        return;
      }

      if (chunks && chunks.length > 0) {
        const chunkTexts = chunks.map(chunk => chunk.chunk_text);
        setDocumentChunks(chunkTexts);
        console.log('=== DOCUMENT CHUNKS LOADED ===');
        console.log(`Loaded ${chunkTexts.length} chunks for document ${documentId}`);
        console.log('Document chunks list (useState):', chunkTexts);
        console.log('First chunk preview:', chunkTexts[0]?.substring(0, 200) + '...');
        console.log('documentChunks state updated:', chunkTexts);
        console.log('================================');
        
        // Show success toast
        toast({
          title: "Document Loaded",
          description: `Successfully loaded ${chunkTexts.length} chunks. You can now chat with the document!`,
        });
      } else {
        setDocumentChunks([]);
        console.log('No chunks found for document');
        toast({
          title: "No Content",
          description: "No content chunks found for this document",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error fetching document chunks:', err);
      setDocumentChunks([]);
      toast({
        title: "Error",
        description: "Failed to fetch document data",
        variant: "destructive",
      });
    }
  };

  // Handles both SME and chatdoc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (smeType === 'english' && selectedDocumentId) {
      // Document chat with chunks + prompt
      setChatDocLoading(true);
      setChatDocMessages(prev => [...prev, { text: query, isUser: true }]);
      
      try {
        if (documentChunks.length === 0) {
          setChatDocMessages(prev => [...prev, { 
            text: 'No document chunks available. Please select a document first.', 
            isUser: false 
          }]);
          setChatDocLoading(false);
          setQuery('');
          return;
        }

        // Combine chunks and prompt as input
        const chunksText = documentChunks.join('\n\n---\n\n');
        const combinedInput = `Document Content:\n${chunksText}\n\nUser Question: ${query}`;
        
        console.log('Document chunks being sent:', documentChunks.length);
        console.log('Combined input preview:', combinedInput.substring(0, 500) + '...');
        
        // Send to Gemini with chunks + prompt
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDDfRq52oNbHjkWjQG31qiPxT7kJT57v_w', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful assistant. Answer the user's question based on the following document content. Be concise and accurate.

${combinedInput}

Answer:`
              }]
            }]
          })
        });

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer received from Gemini.';
        
        setChatDocMessages(prev => [...prev, { text: answer, isUser: false }]);
        
      } catch (err) {
        console.error('Document chat error:', err);
        setChatDocMessages(prev => [...prev, { 
          text: `Error: ${err instanceof Error ? err.message : 'Failed to process document chat'}`, 
          isUser: false 
        }]);
      }
      
      setChatDocLoading(false);
      setQuery('');
    } else {
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
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <Button onClick={() => setSmeType('math')} variant={smeType === 'math' ? 'default' : 'outline'}>
          Dr. Equation
        </Button>
        <Button onClick={() => setSmeType('physics')} variant={smeType === 'physics' ? 'default' : 'outline'}>
          Prof. Atom
        </Button>
        <Button onClick={() => setSmeType('history')} variant={smeType === 'history' ? 'default' : 'outline'}>
          Ms. Chronicle
        </Button>
        <Button onClick={() => setSmeType('arts')} variant={smeType === 'arts' ? 'default' : 'outline'}>
          Maestro Canvas
        </Button>
        <Button onClick={() => setSmeType('programming')} variant={smeType === 'programming' ? 'default' : 'outline'}>
          Code Master
        </Button>
        <Button onClick={() => setSmeType('literature')} variant={smeType === 'literature' ? 'default' : 'outline'}>
          Prof. Wordsmith
        </Button>
        <Button onClick={() => setSmeType('languages')} variant={smeType === 'languages' ? 'default' : 'outline'}>
          Polyglot Pro
        </Button>
        <Button onClick={() => setSmeType('music')} variant={smeType === 'music' ? 'default' : 'outline'}>
          Harmony Sage
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-4">
        {smeType === 'english'
          ? chatDocMessages.map((message, index) => (
              <Card key={index} className={`p-4 ${message.isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Card>
            ))
          : messages.map((message, index) => (
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
                disabled={!query.trim() || (smeType === 'english' ? chatDocLoading : isLoading)}
                className="rounded-full px-4 py-2 bg-gradient-to-r from-mindly-primary to-mindly-accent hover:from-mindly-primary/90 hover:to-mindly-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {(smeType === 'english' ? chatDocLoading : isLoading)
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
};