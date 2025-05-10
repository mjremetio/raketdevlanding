import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ 
  value, 
  onChange, 
  label = "Image URL" 
}: ImageUploadFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle direct URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onChange(url);
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (PNG, JPEG, GIF, etc.)');
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPEG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must be less than 5MB');
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // For simplicity, we'll use a Base64 encoding for the demo
    // In a production app, you'd typically upload to a server or cloud storage
    setIsLoading(true);
    setErrorMessage(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      onChange(result);
      setIsLoading(false);
      toast({
        title: "Image Uploaded",
        description: "Image has been successfully uploaded",
      });
    };
    
    reader.onerror = () => {
      setErrorMessage('Error reading file');
      setIsLoading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the image",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // Handle trigger for file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      <div className="flex gap-2">
        <Input
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="Enter image URL or upload a file"
          className={errorMessage ? 'border-red-500' : ''}
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {errorMessage && (
        <div className="flex items-center text-red-500 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          {errorMessage}
        </div>
      )}
      
      {imageUrl && (
        <div className="mt-2 border rounded-md overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="max-h-48 object-contain w-full"
            onError={() => {
              setErrorMessage('Error loading image. Please check the URL.');
            }}
          />
          {!imageUrl.startsWith('data:') && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              External URL
            </div>
          )}
        </div>
      )}
      
      {!imageUrl && (
        <div className="mt-2 border rounded-md p-8 flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p className="text-sm">No image selected</p>
        </div>
      )}
    </div>
  );
}