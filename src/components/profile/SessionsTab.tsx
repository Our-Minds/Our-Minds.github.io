
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SessionWithUser {
  id: string;
  user_id: string;
  consultant_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_payment_confirmation';
  notes: string | null;
  created_at: string;
  user: {
    name: string;
    profile_image: string | null;
  } | null;
}

export function SessionsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionWithUser[]>([]);
  
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);
  
  const fetchSessions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          users!sessions_user_id_fkey(
            name,
            profile_image
          )
        `)
        .eq('consultant_id', user.id)
        .order('start_time', { ascending: false });
      
      if (error) throw error;

      // Transform the data to match our interface
      const transformedSessions: SessionWithUser[] = data ? data.map((session: any) => ({
        id: session.id,
        user_id: session.user_id,
        consultant_id: session.consultant_id,
        start_time: session.start_time,
        end_time: session.end_time,
        status: session.status as 'scheduled' | 'completed' | 'cancelled' | 'pending_payment_confirmation',
        notes: session.notes,
        created_at: session.created_at,
        user: session.users ? {
          name: session.users.name || 'Unknown User',
          profile_image: session.users.profile_image || null
        } : null
      })) : [];
      
      setSessions(transformedSessions);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error fetching sessions",
        description: error.message || "Could not load your sessions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSessionStatus = async (sessionId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', sessionId)
        .eq('consultant_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, status: newStatus } : session
      ));
      
      toast({
        title: "Session updated",
        description: `The session has been marked as ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Error updating session",
        description: error.message || "Could not update the session status.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter sessions by status
  const upcomingSessions = sessions.filter(session => 
    (session.status === 'scheduled' || session.status === 'pending_payment_confirmation') && 
    isAfter(parseISO(session.start_time), new Date())
  );
  
  const pastSessions = sessions.filter(session => 
    session.status === 'completed' || 
    (session.status !== 'cancelled' && isBefore(parseISO(session.start_time), new Date()))
  );
  
  const cancelledSessions = sessions.filter(session => 
    session.status === 'cancelled'
  );
  
  const formatSessionDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  const formatSessionTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };
  
  const getSessionDuration = (start: string, end: string) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    return `${diffMinutes} min`;
  };
  
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
  
  const renderSessionTable = (sessionList: SessionWithUser[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessionList.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
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
                      {session.user?.name.charAt(0).toUpperCase() || 'U'}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Sessions</CardTitle>
              <CardDescription>
                Manage your upcoming and past client sessions.
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
