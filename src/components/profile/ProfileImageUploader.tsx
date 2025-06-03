
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileImageUploaderProps {
  currentImage?: string | null;
  onImageChange: (imageFile: File | string | null) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
}

export function ProfileImageUploader({
  currentImage,
  onImageChange,
  size = 'md',
}: ProfileImageUploaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const sizeClass = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
    
    // Handle upload with error handling
    try {
      setIsUploading(true);
      
      // Call the parent component's upload handler
      await onImageChange(file);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile image has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      toast({
        title: 'Upload failed',
        description: error.message || 'Could not upload your image. Please try again.',
        variant: 'destructive',
      });
      
      // Reset preview on error
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      setPreviewImage(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      await onImageChange(null);
      
      toast({
        title: 'Image removed',
        description: 'Your profile image has been removed.',
      });
    } catch (error: any) {
      toast({
        title: 'Error removing image',
        description: error.message || 'Could not remove your profile image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const displayedImage = previewImage || currentImage;
  const initials = user?.email?.[0].toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className={`${sizeClass[size]} border-2 border-gray-200`}>
          <AvatarImage src={displayedImage || ''} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            <Camera size={16} />
            <span className="sr-only">Upload image</span>
          </Button>
          
          {displayedImage && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-8 w-8 rounded-full shadow"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X size={16} />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
        </div>
      </div>
      
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <p className="mt-4 text-sm text-gray-500">
        {isUploading ? 'Uploading...' : 'Click the camera icon to update your profile image'}
      </p>
    </div>
  );
}

export default ProfileImageUploader;
