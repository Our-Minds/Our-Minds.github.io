
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/profile/ProfileSettings';
import { useAuth } from '@/context/AuthContext';
import FinancesTab from '@/components/profile/FinancesTab';

export function ProfilePage() {
  const { profile, isConsultant, isAdmin } = useAuth();
  
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
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Manage Your Availability</h2>
                  <p className="text-gray-600">
                    Configure when you're available for sessions.
                  </p>
                  {/* Availability management UI would go here */}
                </div>
              </TabsContent>
            </>
          )}
          
          <TabsContent value="sessions">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Sessions</h2>
              <p className="text-gray-600">
                View your upcoming and past sessions.
              </p>
              {/* Session history would go here */}
            </div>
          </TabsContent>
          
          <TabsContent value="stories">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Stories</h2>
              <p className="text-gray-600">
                Manage stories you've shared on the platform.
              </p>
              {/* Stories management would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default ProfilePage;
