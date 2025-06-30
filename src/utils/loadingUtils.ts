
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Handle loading states and errors when executing actions
 */
export const useLoadingHandler = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  /**
   * Execute a function with loading state management and error handling
   */
  const withLoading = async (key: string, fn: () => Promise<void>) => {
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      await fn();
    } catch (error) {
      console.error(`Error in action ${key}:`, error);
      toast({
        title: 'Error',
        description: `Failed to perform action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return { loading, withLoading };
};
