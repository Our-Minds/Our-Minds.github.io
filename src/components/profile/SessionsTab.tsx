
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSessionManagement } from '@/hooks/useSessionManagement';

export function SessionsTab() {
  const { isConsultant } = useAuth();
  const {
    isLoading,
    error,
    upcomingSessions,
    pastSessions,
    cancelledSessions,
    fetchSessions,
    updateSessionStatus,
    formatSessionDate,
    formatSessionTime,
    getSessionDuration
  } = useSessionManagement();
  
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'outline';
      case 'completed':
        return 'default';
      case 'pending_payment_confirmation':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_payment_confirmation':
        return 'Pending Payment';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  const renderSessionTable = (sessionList: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{isConsultant ? 'Client' : 'Consultant'}</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          {isConsultant && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessionList.length === 0 && (
          <TableRow>
            <TableCell colSpan={isConsultant ? 6 : 5} className="text-center py-4">
              No sessions found
            </TableCell>
          </TableRow>
        )}
        {sessionList.map(session => (
          <TableRow key={session.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden">
                  {session.user?.profile_image ? (
                    <img 
                      src={session.user.profile_image} 
                      alt={session.user?.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-mental-green-100 text-mental-green-800">
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="font-medium">{session.user?.name || 'Unknown User'}</span>
              </div>
            </TableCell>
            <TableCell>{formatSessionDate(session.start_time)}</TableCell>
            <TableCell>{formatSessionTime(session.start_time)}</TableCell>
            <TableCell>{getSessionDuration(session.start_time, session.end_time)}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(session.status)}>
                {getStatusDisplay(session.status)}
              </Badge>
            </TableCell>
            {isConsultant && (
              <TableCell>
                <div className="flex space-x-2">
                  {(session.status === 'scheduled' || session.status === 'pending_payment_confirmation') && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateSessionStatus(session.id, 'completed')}
                      >
                        Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => updateSessionStatus(session.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-red-600 font-medium">Error loading sessions</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button 
                onClick={fetchSessions} 
                variant="outline" 
                size="sm" 
                className="mt-4"
              >
                <Clock className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Sessions</CardTitle>
              <CardDescription>
                {isConsultant ? 
                  "Manage your upcoming and past client sessions." :
                  "View your upcoming and past consultation sessions."
                }
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={fetchSessions}
              disabled={isLoading}
            >
              <Clock className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Upcoming
                {upcomingSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                Past
                {pastSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pastSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                {cancelledSessions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cancelledSessions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <p>Loading upcoming sessions...</p>
                </div>
              ) : (
                renderSessionTable(upcomingSessions)
              )}
            </TabsContent>
            
            <TabsContent value="past" className="pt-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <p>Loading past sessions...</p>
                </div>
              ) : (
                renderSessionTable(pastSessions)
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="pt-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <p>Loading cancelled sessions...</p>
                </div>
              ) : (
                renderSessionTable(cancelledSessions)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default SessionsTab;
