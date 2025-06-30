
import React from 'react';
import { Users, FileText, UserCheck, MessageCircleIcon, CalendarIcon } from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardStats } from '@/hooks/admin/types';

interface StatsOverviewProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export const StatsOverview = ({ stats, isLoading }: StatsOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        title="Total Users" 
        value={isLoading ? undefined : stats?.totalUsers} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend="+10% from last month"
      />
      <StatCard 
        title="Active Stories" 
        value={isLoading ? undefined : stats?.recentStories} 
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        trend="+20% from last month"
      />
      <StatCard 
        title="Pending Approvals" 
        value={isLoading ? undefined : stats?.pendingApprovals} 
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        trend={`${stats?.pendingApprovals ? stats.pendingApprovals : 0} consultants waiting`}
      />
      <StatCard 
        title="Chat Messages" 
        value={57} 
        icon={<MessageCircleIcon className="h-4 w-4 text-muted-foreground" />}
        trend="+15% from last month"
      />
      <StatCard 
        title="Sessions" 
        value={128} 
        icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
        trend="+8% from last month"
      />
    </div>
  );
};
