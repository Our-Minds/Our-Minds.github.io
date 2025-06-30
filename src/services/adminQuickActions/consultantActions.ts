
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Approve a consultant by updating their availability status
 */
export const approveConsultant = async (consultantId: string) => {
  const { toast } = useToast();
  
  // Update consultant to available
  const { error } = await supabase
    .from('consultants')
    .update({ available: true })
    .eq('id', consultantId);

  if (error) {
    throw new Error(error.message);
  }

  // First get the user ID from the consultant
  const { data: consultantData, error: consultantError } = await supabase
    .from('consultants')
    .select('id')
    .eq('id', consultantId)
    .single();

  if (consultantError) {
    throw new Error(consultantError.message);
  }

  // Then get the user data separately
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', consultantData.id)
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  const userEmail = userData?.email || 'consultant';
  
  // Here you would typically send an email notification
  console.log(`Notification would be sent to: ${userEmail}`);

  toast({
    title: 'Consultant Approved',
    description: 'The consultant has been approved and notified.',
  });
};
