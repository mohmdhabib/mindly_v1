import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DocumentUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`public/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    setIsUploading(false);

    if (error) {
      toast({
        title: 'Error uploading file',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'File uploaded successfully',
        description: data.path,
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Paperclip className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
          <DialogDescription>
            Select a file to upload. The file will be processed and you can then
            ask questions about its content.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <input type="file" onChange={handleFileChange} />
          {isUploading && (
            <div className="mt-4">
              <p>Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
