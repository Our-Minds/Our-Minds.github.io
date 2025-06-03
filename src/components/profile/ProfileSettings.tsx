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
import { migrateProfileImage } from '@/utils/migrateProfileImages';

interface ProfileSettingsProps {
  isConsultant?: boolean;
  isAdmin?: boolean;
}

export function ProfileSettings({ isConsultant = false, isAdmin = false }: ProfileSettingsProps) {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(profile?.profileImage || '');
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [tags, setTags] = useState<string[]>(profile?.specialization || ['Anxiety', 'Depression', 'Stress Management']);
  const [location, setLocation] = useState('Remote');
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setProfileImage(profile.profileImage || '');
      setBio(profile.bio || '');
      setTags(profile.specialization || ['Anxiety', 'Depression', 'Stress Management']);
      
      if (isConsultant) {
        fetchConsultantDetails();
      }
    }
  }, [profile, isConsultant]);

  const fetchConsultantDetails = async () => {
    if (!user) return;

    try {
      const { data: consultant, error } = await supabase
        .from('consultants')
        .select('location, languages, hourly_rate')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('No consultant record found, using defaults');
        return;
      }

      if (consultant) {
        setLocation(consultant.location || 'Remote');
        setLanguages(consultant.languages || ['English']);
        setHourlyRate(consultant.hourly_rate || 50);
      }
    } catch (error: any) {
      console.error('Error fetching consultant details:', error);
    }
  };

  // Add effect to migrate existing profile images if needed
  useEffect(() => {
    const migrateExistingImage = async () => {
      if (user && profile?.profileImage) {
        try {
          if (!profile.profileImage.includes(`/${user.id}/`)) {
            console.log('Attempting to migrate profile image');
            const migratedUrl = await migrateProfileImage(user.id, profile.profileImage);
            
            if (migratedUrl && migratedUrl !== profile.profileImage) {
              setProfileImage(migratedUrl);
              toast({
                title: 'Profile image updated',
                description: 'Your profile image has been migrated to a new format.'
              });
            }
          }
        } catch (error) {
          console.error('Error migrating profile image:', error);
        }
      }
    };
    
    migrateExistingImage();
  }, [user, profile?.profileImage, toast]);
  
  const uploadProfileImage = async (file: File | string | null): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    if (file === null) {
      setProfileImage('');
      return;
    }
    
    if (typeof file === 'string') {
      setProfileImage(file);
      return;
    }
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
      
      setProfileImage(urlData.publicUrl);
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      throw new Error(error.message || 'Failed to upload image');
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
        // Check if consultant record exists
        const { data: existingConsultant } = await supabase
          .from('consultants')
          .select('id')
          .eq('id', user.id)
          .single();

        if (existingConsultant) {
          // Update existing consultant
          const { error: consultantError } = await supabase
            .from('consultants')
            .update({ 
              specialization: tags,
              bio: bio,
              location: location,
              languages: languages,
              hourly_rate: hourlyRate
            })
            .eq('id', user.id);
          
          if (consultantError) throw consultantError;
        } else {
          // Create new consultant record
          const { error: consultantError } = await supabase
            .from('consultants')
            .insert({
              id: user.id,
              specialization: tags,
              bio: bio,
              location: location,
              languages: languages,
              hourly_rate: hourlyRate,
              paypal_email: ''
            });
          
          if (consultantError) throw consultantError;
        }
      }
      
      if (refreshProfile) {
        await refreshProfile();
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
            onImageChange={uploadProfileImage}
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
        <>
          <Card>
            <CardHeader>
              <CardTitle>Consultant Details</CardTitle>
              <CardDescription>
                Update your location, languages, and hourly rate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Remote, New York, London"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="languages">Languages (comma-separated)</Label>
                <Input 
                  id="languages" 
                  value={languages.join(', ')} 
                  onChange={(e) => setLanguages(e.target.value.split(',').map(lang => lang.trim()).filter(Boolean))}
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input 
                  id="hourly-rate" 
                  type="number"
                  value={hourlyRate} 
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  min="0"
                  step="5"
                />
              </div>
            </CardContent>
          </Card>

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
        </>
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
