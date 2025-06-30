
import React from 'react';
import { Users, FileText, Calendar } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface ActivityData {
  id: string;
  type: 'user_joined' | 'story_published' | 'session_booked';
  text: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityData[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined':
        return <Users className="h-4 w-4" />;
      case 'story_published':
        return <FileText className="h-4 w-4" />;
      case 'session_booked':
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-center py-4 text-muted-foreground">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm">{activity.text}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
