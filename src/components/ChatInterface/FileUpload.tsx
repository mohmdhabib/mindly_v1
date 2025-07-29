import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Paperclip className="w-4 h-4" />
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
