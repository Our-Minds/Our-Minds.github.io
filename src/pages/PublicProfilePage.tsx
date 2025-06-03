
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, Globe, DollarSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { findOrCreateChatThread } from '@/utils/chatUtils';

interface ConsultantData {
  bio: string;
  specialization: string[];
  location: string;
  languages: string[];
  hourly_rate: number;
  rating: number;
  review_count: number;
  available: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  profile_image: string;
  role: string;
  consultant?: ConsultantData;
}

export function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async (): Promise<ProfileData> => {
      if (!userId) throw new Error('User ID is required');

      // First get the user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, profile_image, role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // If user is a consultant, get their consultant data
      if (userData.role === 'consultant' || userData.role === 'admin' || userData.role === 'owner') {
        const { data: consultantData, error: consultantError } = await supabase
          .from('consultants')
          .select('bio, specialization, location, languages, hourly_rate, rating, review_count, available')
          .eq('id', userId)
          .single();

        if (consultantError && consultantError.code !== 'PGRST116') {
          console.error('Error fetching consultant data:', consultantError);
        }

        return {
          ...userData,
          consultant: consultantData || undefined
        };
      }

      return userData;
    },
    enabled: !!userId,
  });

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to chat with this user",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!userId || !user) return;

    if (user.id === userId) {
      toast({
        title: "Cannot chat with yourself",
        description: "You cannot start a chat with yourself",
        variant: "destructive"
      });
      return;
    }

    try {
      const thread = await findOrCreateChatThread(userId, user.id);
      navigate(`/chat/${thread.id}`);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: "Failed to start chat",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isConsultant = profile.role === 'consultant' || profile.role === 'admin' || profile.role === 'owner';

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={profile.profile_image || '/placeholder.svg'}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                
                {isConsultant && profile.consultant && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Badge variant={profile.consultant.available ? "default" : "secondary"}>
                        {profile.consultant.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Badge variant="outline">{profile.role}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                      {profile.consultant.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{profile.consultant.location}</span>
                        </div>
                      )}
                      
                      {profile.consultant.hourly_rate && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span>${profile.consultant.hourly_rate}/hour</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button onClick={handleStartChat} className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        {isConsultant && profile.consultant?.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.consultant.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Specializations */}
        {isConsultant && profile.consultant?.specialization && profile.consultant.specialization.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.consultant.specialization.map((spec: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Languages */}
        {isConsultant && profile.consultant?.languages && profile.consultant.languages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <span>{profile.consultant.languages.join(', ')}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default PublicProfilePage;
