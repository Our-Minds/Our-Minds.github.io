
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart4,
  Users, 
  FileText, 
  UserCheck, 
  Settings,
  Info
} from 'lucide-react';

interface AdminNavTabsProps {
  activeTab: string;
}

export const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  return (
    <TabsList className="grid grid-cols-6 w-full">
      <TabsTrigger value="dashboard" className="flex items-center gap-2">
        <BarChart4 className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      <TabsTrigger value="content" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Content</span>
      </TabsTrigger>
      <TabsTrigger value="consultants" className="flex items-center gap-2">
        <UserCheck className="h-4 w-4" />
        <span className="hidden sm:inline">Consultants</span>
      </TabsTrigger>
      <TabsTrigger value="about" className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span className="hidden sm:inline">About</span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminNavTabs;
