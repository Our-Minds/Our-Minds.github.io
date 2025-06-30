
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityFeed } from './ActivityFeed';
import { ActivityData } from '@/hooks/admin/types';

interface RecentActivityCardProps {
  activities: ActivityData[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const RecentActivityCard = ({ activities, isLoading, error }: RecentActivityCardProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Platform activities from the last few days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <p className="text-center py-4 text-muted-foreground">Failed to load recent activities</p>
        ) : (
          <ActivityFeed activities={activities || []} />
        )}
      </CardContent>
    </Card>
  );
};
