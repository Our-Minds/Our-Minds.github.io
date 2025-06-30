
import React from 'react';
import { useDashboardStats, useRecentActivities } from '@/hooks/admin/useAdminDashboard';
import { StatsOverview } from './StatsOverview';
import { RecentActivityCard } from './RecentActivityCard';
import { MonthlyOverviewChart } from './MonthlyOverviewChart';

export const DashboardTab = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useRecentActivities();

  return (
    <div className="space-y-4">
      {/* Stats Overview Section */}
      <StatsOverview stats={stats} isLoading={statsLoading} />
      
      {/* Recent Activity Section */}
      <RecentActivityCard 
        activities={activities} 
        isLoading={activitiesLoading} 
        error={activitiesError} 
      />

      {/* Monthly Overview Chart */}
      <MonthlyOverviewChart />
    </div>
  );
};

export default DashboardTab;
