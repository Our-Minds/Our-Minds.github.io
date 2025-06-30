
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { findOrCreateChatThread } from '@/utils/chatUtils';
import { UserPostsSection } from '@/components/profile/UserPostsSection';
import { PublicProfileHeader } from '@/components/profile/PublicProfileHeader';
import { ConsultantDetails } from '@/components/profile/ConsultantDetails';

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
        <PublicProfileHeader profile={profile} onStartChat={handleStartChat} />
        
        {isConsultant && profile.consultant && (
          <ConsultantDetails consultant={profile.consultant} />
        )}

        <div className="mb-6">
          <UserPostsSection userId={profile.id} userName={profile.name} />
        </div>
      </div>
    </Layout>
  );
}

export default PublicProfilePage;
