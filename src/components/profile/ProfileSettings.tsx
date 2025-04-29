import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ProfileImageUploader from './ProfileImageUploader';
import TagsManager from './TagsManager';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSettingsProps {
  isConsultant?: boolean;
  isAdmin?: boolean;
}

export function ProfileSettings({ isConsultant = false, isAdmin = false }: ProfileSettingsProps) {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(profile?.profileImage || '');
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [tags, setTags] = useState<string[]>(profile?.specialization || ['Anxiety', 'Depression', 'Stress Management']);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setProfileImage(profile.profileImage || '');
      setBio(profile.bio || '');
      setTags(profile.specialization || ['Anxiety', 'Depression', 'Stress Management']);
    }
  }, [profile]);
  
  const uploadProfileImage = async (file: File | string): Promise<string> => {
    if (typeof file === 'string') {
      return file;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  };
  
  const handleSave = async () => {
    if (!user || !profile) {
      toast({
        title: 'Not authenticated',
        description: 'You need to be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          name: name,
          profile_image: profileImage
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      if (isConsultant) {
        const { error: consultantError } = await supabase
          .from('consultants')
          .update({ 
            specialization: tags,
            bio: bio
          })
          .eq('id', user.id);
        
        if (consultantError) throw consultantError;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'There was an error saving your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!profile) {
    return <div className="flex items-center justify-center p-8">Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture. This will be visible to other users.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ProfileImageUploader
            currentImage={profileImage}
            onImageChange={async (file) => {
              try {
                const url = await uploadProfileImage(file);
                setProfileImage(url);
              } catch (error) {
                console.error('Failed to upload image:', error);
                toast({
                  title: 'Image upload failed',
                  description: 'Could not upload image. Please try again.',
                  variant: 'destructive',
                });
              }
            }}
            size="lg"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email || ''} type="email" disabled />
          </div>
          
          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value="Administrator" disabled />
            </div>
          )}
        </CardContent>
      </Card>
      
      {isConsultant && (
        <Card>
          <CardHeader>
            <CardTitle>Consultant Specializations</CardTitle>
            <CardDescription>
              Add up to 6 specialization tags. The first 3 tags will be displayed on your public profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TagsManager 
              tags={tags} 
              onChange={setTags} 
              maxTags={6} 
            />
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
          <CardDescription>
            Tell others a little about yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

export default ProfileSettings;
