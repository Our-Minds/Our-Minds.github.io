
import { supabase } from '@/integrations/supabase/client';
import { FileUploadResult } from '@/utils/fileUpload';

export async function sendMessageMutation(
  user: any,
  selectedChatId: string,
  content: string,
  attachment?: FileUploadResult
) {
  if (!user || !selectedChatId) throw new Error('No chat selected');

  const message = {
    thread_id: selectedChatId,
    sender_id: user.id,
    content,
    attachment_url: attachment?.url,
    attachment_type: attachment?.type,
    attachment_name: attachment?.name,
    attachment_size: attachment?.size,
  };

  const { error } = await supabase.from('chat_messages').insert([message]);
  if (error) throw error;

  const { error: threadError } = await supabase
    .from('chat_threads')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', selectedChatId);

  if (threadError) throw threadError;
}
