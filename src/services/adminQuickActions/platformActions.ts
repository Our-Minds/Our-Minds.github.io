
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Update platform fee percentage
 */
export const updatePlatformFee = async (newFeePercentage: number) => {
  const { toast } = useToast();
  
  if (newFeePercentage < 0 || newFeePercentage > 100) {
    throw new Error('Fee percentage must be between 0 and 100');
  }

  const { error } = await supabase
    .from('platform_settings')
    .update({ platform_fee_percentage: newFeePercentage })
    .eq('id', '1');

  if (error) {
    throw new Error(error.message);
  }

  toast({
    title: 'Platform Fee Updated',
    description: `The platform fee has been updated to ${newFeePercentage}%.`,
  });
};
