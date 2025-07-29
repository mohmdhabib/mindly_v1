import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  url: string;
}

export function DocumentList({ onSelectDocument }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase.from('documents').select('*');
      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data);
      }
    };

    fetchDocuments();
  }, []);

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocument(documentId);
    onSelectDocument(documentId);
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">My Documents</h3>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedDocument === doc.id
                ? 'bg-mindly-primary/20 dark:bg-mindly-primary/30'
                : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'
            }`}
            onClick={() => handleSelectDocument(doc.id)}
          >
            <div className="font-medium text-sm text-gray-900 dark:text-white">{doc.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
