
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/profile/ProfileSettings';
import { useAuth } from '@/context/AuthContext';
import FinancesTab from '@/components/profile/FinancesTab';
import AvailabilityTab from '@/components/profile/AvailabilityTab';
import SessionsTab from '@/components/profile/SessionsTab';
import StoriesTab from '@/components/profile/StoriesTab';

// No need for useEffect or useNavigate since we'll use AuthGuard

export function ProfilePage() {
  const { profile, isConsultant, isAdmin } = useAuth();
  
  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold mb-6">Loading profile...</h1>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {isConsultant && (
              <>
                <TabsTrigger value="finances">Finances</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </>
            )}
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <ProfileSettings isConsultant={isConsultant} isAdmin={isAdmin} />
          </TabsContent>
          
          {isConsultant && (
            <>
              <TabsContent value="finances">
                <FinancesTab />
              </TabsContent>

              <TabsContent value="availability">
                <AvailabilityTab />
              </TabsContent>
            </>
          )}
          
          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>
          
          <TabsContent value="stories">
            <StoriesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default ProfilePage;
