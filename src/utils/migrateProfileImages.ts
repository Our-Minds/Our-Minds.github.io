import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to migrate existing profile images to the correct folder structure
 * This can be called from the admin panel or automatically when a user signs in
 * @param userId The user ID
 * @param currentImageUrl The current image URL
 */
export async function migrateProfileImage(userId: string, currentImageUrl: string): Promise<string | null> {
  if (!currentImageUrl) return null;
  
  try {
    // Extract the filename from the URL
    const urlParts = currentImageUrl.split('/');
    const oldFileName = urlParts[urlParts.length - 1];
    
    // Check if the image is already in the correct format (contains user ID)
    if (currentImageUrl.includes(`/${userId}/`)) {
      return currentImageUrl;
    }
    
    // Download the old image
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('profile_images')
      .download(oldFileName);
      
    if (downloadError) {
      console.error('Error downloading old profile image:', downloadError);
      return currentImageUrl; // Return existing URL if download fails
    }
    
    // Upload to new location
    const newFilePath = `${userId}/${oldFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(newFilePath, fileData, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading to new path:', uploadError);
      return currentImageUrl; // Return existing URL if upload fails
    }
    
    // Get the new public URL
    const { data: urlData } = supabase.storage
      .from('profile_images')
      .getPublicUrl(newFilePath);
      
    // Update the user profile with the new image URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image: urlData.publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      console.error('Error updating user profile:', updateError);
    }
    
    // Delete the old file (optional, can be commented out if you want to keep old files)
    // const { error: deleteError } = await supabase.storage
    //   .from('profile_images')
    //   .remove([oldFileName]);
      
    // if (deleteError) {
    //   console.error('Error deleting old file:', deleteError);
    // }
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Profile image migration failed:', error);
    return currentImageUrl; // Return existing URL if migration fails
  }
}
