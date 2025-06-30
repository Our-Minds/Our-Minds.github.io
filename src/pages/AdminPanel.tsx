
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

// Import our component modules
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import DashboardTab from '@/components/admin/dashboard/DashboardTab';
import UserManagementTab from '@/components/admin/users/UserManagementTab';
import ContentManagementTab from '@/components/admin/content/ContentManagementTab';
import ConsultantManagementTab from '@/components/admin/consultants/ConsultantManagementTab';
import AboutManagementTab from '@/components/admin/about/AboutManagementTab';
import PlatformSettingsTab from '@/components/admin/settings/PlatformSettingsTab';

const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (activeTab !== defaultTab) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, [activeTab, setSearchParams, defaultTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <AdminHeader />

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <AdminNavTabs activeTab={activeTab} />
            
            <TabsContent value="dashboard" className="space-y-4">
              <DashboardTab />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <UserManagementTab />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <ContentManagementTab />
            </TabsContent>
            
            <TabsContent value="consultants" className="space-y-4">
              <ConsultantManagementTab />
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <AboutManagementTab />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <PlatformSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
