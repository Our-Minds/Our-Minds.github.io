
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminQuickActions } from '@/hooks/useAdminQuickActions';
import { Plus, Check, Settings, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  execute: () => Promise<void>;
  variant?: 'default' | 'destructive' | 'success';
}

export function QuickActionsPanel() {
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getQuickActions, loading } = useAdminQuickActions();
  
  useEffect(() => {
    const loadActions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const availableActions = await getQuickActions();
        setActions(availableActions || []);
      } catch (err) {
        console.error("Error loading quick actions:", err);
        setError("Failed to load quick actions");
        toast({
          title: "Error",
          description: "Failed to load quick actions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActions();
    
    // Refresh actions every 30 seconds
    const interval = setInterval(loadActions, 30000);
    
    return () => clearInterval(interval);
  }, [getQuickActions]);
  
  // Get appropriate icon for action
  const getActionIcon = (actionId: string) => {
    if (actionId.includes('approve')) return <Check className="mr-2 h-4 w-4" />;
    if (actionId.includes('feature')) return <Plus className="mr-2 h-4 w-4" />;
    if (actionId.includes('user')) return <Users className="mr-2 h-4 w-4" />;
    return <Settings className="mr-2 h-4 w-4" />;
  };

  const executeAction = async (action: QuickAction) => {
    try {
      await action.execute();
      // Show success toast
      toast({
        title: "Action Completed",
        description: `Successfully executed: ${action.title}`,
        variant: "success",
      });
      
      // Refresh actions after execution
      const updatedActions = await getQuickActions();
      setActions(updatedActions || []);
    } catch (err) {
      console.error(`Error executing action ${action.id}:`, err);
      toast({
        title: "Action Failed",
        description: "The action couldn't be completed. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[52px] w-full" />
            <Skeleton className="h-[52px] w-full" />
            <Skeleton className="h-[52px] w-full" />
          </div>
        ) : error ? (
          <div className="text-center p-4 text-gray-500 space-y-2">
            <p>{error}</p>
            <Button variant="outline" onClick={() => {
              setIsLoading(true);
              getQuickActions()
                .then(actions => {
                  setActions(actions || []);
                  setError(null);
                })
                .catch(err => {
                  console.error("Error retrying quick actions:", err);
                  setError("Failed to load quick actions again");
                })
                .finally(() => setIsLoading(false));
            }}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {actions && actions.length > 0 ? (
              actions.map(action => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={loading[action.id]}
                  onClick={() => executeAction(action)}
                >
                  {getActionIcon(action.id)}
                  <div className="flex flex-col items-start text-left">
                    <span>{action.title}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                <p>No quick actions available at this time</p>
                <p className="text-xs">Check back later or manage tasks directly in their respective tabs</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
