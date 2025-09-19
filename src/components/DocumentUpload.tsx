import { useState, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
}

interface DocumentUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export const DocumentUpload = ({ onFilesChange, maxFiles = 3 }: DocumentUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback((fileList: FileList) => {
    if (files.length + fileList.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Simulate upload process
    newFiles.forEach(file => {
      setTimeout(() => {
        setFiles(prev => {
          const updated = prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploaded' as const } : f
          );
          onFilesChange(updated);
          return updated;
        });
      }, 1000 + Math.random() * 2000);
    });

    onFilesChange(updatedFiles);
  }, [files, maxFiles, onFilesChange]);

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`transition-all duration-200 ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-dashed'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, Word documents, and text files (max {maxFiles} files)
          </p>
          <Button
            variant="upload"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Choose Files
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Uploaded Files ({files.length}/{maxFiles})</h4>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    )}
                    {file.status === 'uploaded' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};