
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface StoryImageUploaderProps {
  imagePreview: string;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

export function StoryImageUploader({ imagePreview, onImageSelect, onImageRemove }: StoryImageUploaderProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="coverImage">Cover Image</Label>
      <div className="flex items-center gap-4">
        {imagePreview ? (
          <div className="relative w-32 h-32">
            <img 
              src={imagePreview} 
              alt="Story cover" 
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={onImageRemove}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <Input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="coverImage"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Upload Image</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
