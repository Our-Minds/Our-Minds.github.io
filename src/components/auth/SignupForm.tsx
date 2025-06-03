
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/context/AuthContext';
import { Camera, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // For image upload
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setProfileImage('');
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Create a temporary ID for users that don't have an ID yet during signup
      // This will be replaced after signup with their actual user ID
      const tempUserId = `temp_${Math.random().toString(36).substring(2, 15)}`;
      const filePath = `${tempUserId}/${fileName}`;
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
      });
      return;
    }
    
    if (role === 'consultant' && !selectedFile && !profileImage) {
      toast({
        variant: 'destructive',
        title: 'Profile image required',
        description: 'Please upload a profile image to continue.',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
  
    let imageUrl = '';
    if (selectedFile) {
      imageUrl = await uploadProfileImage(selectedFile);
     } else {
    
      const firstInitial = name?.charAt(0).toUpperCase() || 'U'; // 'U' for unknown

    
      imageUrl = `https://ui-avatars.com/api/?name=${firstInitial}&background=random&color=fff`;
    }

      
      const userData = {
        name,
        email,
        role,
        profileImage: imageUrl,
        ...(role === 'consultant' ? {
          specialization: specialization.length > 0 ? specialization : ['General Mental Health'],
          languages: languages.length > 0 ? languages : ['English'],
          location: location || 'Remote',
          paypalEmail: paypalEmail || email,
        } : {})
      };
      
      await signup(userData, password);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      // Auth context now handles the toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6 p-6 bg-[#025803] rounded-lg shadow-md">
      <div className="text-center">
        <img src="/assets/OurMinds.png" alt="Our Minds Logo" className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-gray-200">
          Join our mental health community today
        </p>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="user" 
            onClick={() => setRole('user')}
            className="data-[state=active]:bg-mental-green-100 data-[state=active]:text-black"
          >
            Regular User
          </TabsTrigger>
          <TabsTrigger 
            value="consultant" 
            onClick={() => setRole('consultant')}
            className="data-[state=active]:bg-mental-green-100 data-[state=active]:text-black"
          >
            Consultant
          </TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="text-gray-100 space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input className="w-full  text-black"
              id="name"
              type="text"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="text-gray-100 space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input className="w-full  text-black"
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-gray-100 space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input className="w-full  text-black"
                id="password"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            
            <div className="text-gray-100 space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input className="w-full  text-black"
                id="confirmPassword"
                type="password"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <TabsContent value="consultant" className="space-y-4">
            <div className="text-gray-100 space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={previewImage || ''} />
                    <AvatarFallback className="text-3xl">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                    >
                      <Camera size={16} />
                      <span className="sr-only">Upload image</span>
                    </Button>
                    
                    {previewImage && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full shadow"
                        onClick={handleRemoveImage}
                      >
                        <X size={16} />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                <input
                  id="profile-image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                
                <p className="mt-4 text-xs text-gray-200">
                  Click the camera icon to upload your profile image
                </p>
              </div>
            </div>

            <div className="text-gray-100 space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select 
                onValueChange={(value) => setSpecialization([value])}
                defaultValue="General Mental Health"
              > 
                <SelectTrigger>
                  <SelectValue placeholder="Select a specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Mental Health">General Mental Health</SelectItem>
                  <SelectItem value="Anxiety">Anxiety</SelectItem>
                  <SelectItem value="Depression">Depression</SelectItem>
                  <SelectItem value="Trauma">Trauma</SelectItem>
                  <SelectItem value="Addiction">Addiction</SelectItem>
                  <SelectItem value="PTSD">PTSD</SelectItem>
                  <SelectItem value="Family Therapy">Family Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-gray-100 space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Select 
                onValueChange={(value) => setLanguages([value])}
                defaultValue="English"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Mandarin">Mandarin</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-gray-100 space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input className="w-full  text-black"
                id="location"
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="text-gray-100 space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email (for payments)</Label>
              <Input className="w-full  text-black"
                id="paypalEmail"
                type="email"
                placeholder=""
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
              <p className="text-xs text-gray-200">
                You can update this later in your profile settings.
              </p>
            </div>
          </TabsContent>

          <Button type="submit" className="w-full bg-mental-green-400 hover:bg-mental-green-500" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Tabs>

      <div className="text-center text-sm">
        <span className="text-gray-200">Already have an account? </span>
        <Link to="/login" className="text-mental-green-300 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
