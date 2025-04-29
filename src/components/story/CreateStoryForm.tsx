import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { StoryImageUploader } from './StoryImageUploader';
import { StoryTagSelector, STORY_TAG_OPTIONS } from './StoryTagSelector';
import { StoryFormFields } from './StoryFormFields';

export function CreateStoryForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    snippet: '',
    content: '',
    tags: ['Mental Health'],
    tagType: 'mental' as 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression',
    coverImage: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, coverImage: URL.createObjectURL(file) }));
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagValue = e.target.value as 'mental' | 'control' | 'drugs' | 'life' | 'anxiety' | 'depression';
    const tagLabel = STORY_TAG_OPTIONS.find(opt => opt.value === tagValue)?.label || '';
    
    setFormData(prev => ({
      ...prev,
      tagType: tagValue,
      tags: [tagLabel, ...prev.tags.slice(1)], // Replace first tag, keep others
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('story_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a story",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Missing information",
        description: "Please provide a title and content for your story",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image first if selected
      let coverImageUrl = '/public/lovable-uploads/7646df82-fc16-4ccb-8469-742a8722685b.png'; // Default image
      
      if (selectedImage) {
        coverImageUrl = await uploadImage(selectedImage);
      }
      
      // Get current session to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        throw new Error("You must be logged in to create a story");
      }
      
      // Create story object
      const storyData = {
        title: formData.title,
        snippet: formData.snippet || formData.content.slice(0, 100) + '...',
        content: formData.content,
        cover_image: coverImageUrl,
        author_id: user.id,
        tags: formData.tags,
        tag_type: formData.tagType,
        is_featured: false,
        published_at: new Date().toISOString()
      };
      
      console.log("Creating story with data:", storyData);
      
      // Insert into database
      const { data: story, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select('id')
        .single();
      
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      toast({
        title: "Story published!",
        description: "Your story has been published successfully",
      });
      
      onClose();
      
      setTimeout(() => {
        navigate(`/story/${story.id}`);
      }, 500);
    } catch (error: any) {
      console.error('Error creating story:', error);
      toast({
        title: "Failed to create story",
        description: error?.message || "There was an error publishing your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StoryImageUploader 
        imagePreview={imagePreview}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />
      
      <StoryFormFields 
        title={formData.title}
        snippet={formData.snippet}
        content={formData.content}
        onInputChange={handleInputChange}
      />
      
      <StoryTagSelector 
        selectedTag={formData.tagType}
        onTagChange={handleTagChange}
      />
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Story"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default CreateStoryForm;
