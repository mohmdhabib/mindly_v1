import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  url: string;
}

interface DocumentListProps {
  onSelectDocument: (doc: Document) => void;
}

export function DocumentList({ onSelectDocument }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase.storage.from('documents').list('public');
      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(
          data.map(file => ({
            id: file.id || file.name,
            name: file.name,
            url: supabase.storage.from('documents').getPublicUrl(`public/${file.name}`).data.publicUrl,
          }))
        );
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (selectedDoc) {
      onSelectDocument(selectedDoc);
    }
  }, [selectedDoc, onSelectDocument]);

  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">My Documents</h3>
      <div className="space-y-2">
        {documents.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No documents found. Upload a file to get started.</div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDoc?.id === doc.id
                  ? 'bg-mindly-primary/20 dark:bg-mindly-primary/30'
                  : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white">{doc.name}</div>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline ml-2">View</a>
            </div>
          ))
        )}
      </div>
      {selectedDoc && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Selected Document</h4>
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="font-medium text-sm text-gray-900 dark:text-white">{selectedDoc.name}</div>
            <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline ml-2">View</a>
          </div>
        </div>
      )}
    </div>
  );
}
