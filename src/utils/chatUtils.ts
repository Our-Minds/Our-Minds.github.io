
import { supabase } from "@/integrations/supabase/client";

export interface ChatThread {
  id: string;
  user_id: string;
  consultant_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Finds an existing chat thread or creates a new one between two users
 * @param authorId The ID of the author/consultant
 * @param userId The ID of the current user
 * @returns The chat thread object
 */
export async function findOrCreateChatThread(authorId: string, userId: string): Promise<ChatThread> {
  console.log("Finding or creating chat thread between", {authorId, userId});
  
  if (!authorId || !userId) {
    throw new Error("Both authorId and userId are required");
  }
  
  try {
    // Check if a thread already exists between these users
    // Use specific OR conditions to find threads where either:
    // 1. Current user is user_id and author is consultant_id, or
    // 2. Current user is consultant_id and author is user_id
    const { data: existingThreads, error } = await supabase
      .from('chat_threads')
      .select('*')
      .or(`user_id.eq.${userId},consultant_id.eq.${userId}`)
      .or(`user_id.eq.${authorId},consultant_id.eq.${authorId}`)
      .limit(10); // Get all potential matches and filter them
      
    if (error) {
      console.error("Error checking for existing thread:", error);
      throw error;
    }

    // Find the exact thread where the two users are matched correctly
    const existingThread = existingThreads?.find(thread => 
      (thread.user_id === userId && thread.consultant_id === authorId) || 
      (thread.user_id === authorId && thread.consultant_id === userId)
    );

    // If thread exists, return it
    if (existingThread) {
      console.log("Existing thread found:", existingThread);
      return existingThread as ChatThread;
    }

    console.log("Creating new thread");
    
    // Determine who is the consultant and who is the user
    let consultantId: string;
    let regularUserId: string;
    
    try {
      // Query the users table to check their roles
      const { data: userRoles, error: userRolesError } = await supabase
        .from('users')
        .select('id, role')
        .in('id', [userId, authorId]);
      
      if (userRolesError) {
        console.error("Error checking user roles:", userRolesError);
        throw userRolesError;
      }
      
      // Default assignment
      consultantId = authorId;
      regularUserId = userId;
      
      if (userRoles && userRoles.length > 0) {
        const currentUserRole = userRoles.find(u => u.id === userId)?.role;
        const authorUserRole = userRoles.find(u => u.id === authorId)?.role;
        
        // If current user is a consultant and author is not, swap the roles
        if ((currentUserRole === 'consultant' || currentUserRole === 'admin' || currentUserRole === 'owner') && 
            (authorUserRole === 'user')) {
          consultantId = userId;
          regularUserId = authorId;
        }
      }
    } catch (err) {
      console.error("Error determining user roles:", err);
      // Fall back to default assignment if there's an error
    }
    
    // Create thread with determined roles
    const { data: newThread, error: createError } = await supabase
      .from('chat_threads')
      .insert({
        user_id: regularUserId,
        consultant_id: consultantId,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating chat thread:", createError);
      throw createError;
    }

    console.log("New thread created:", newThread);

    // Create initial system message in the thread
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: newThread.id,
        sender_id: userId,
        content: "Hi, I read your story and wanted to chat!"
      });
      
    if (messageError) {
      console.error("Error creating initial message:", messageError);
      // We don't throw here since the thread was created successfully
    }

    return newThread as ChatThread;
  } catch (error) {
    console.error("Error in findOrCreateChatThread:", error);
    throw error;
  }
}
