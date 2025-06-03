
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart4 } from 'lucide-react';

export const MonthlyOverviewChart = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Platform performance metrics for the past 30 days
            </CardDescription>
          </div>
          <BarChart4 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground">Chart visualization will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};
