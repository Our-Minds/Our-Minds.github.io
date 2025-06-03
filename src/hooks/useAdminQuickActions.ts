
import { useState } from 'react';
import { QuickAction } from '@/components/admin/QuickActionsPanel';
import { useLoadingHandler } from '@/utils/loadingUtils';
import { approveConsultant } from '@/services/adminQuickActions/consultantActions';
import { featureStory } from '@/services/adminQuickActions/storyActions';
import { updatePlatformFee } from '@/services/adminQuickActions/platformActions';
import { 
  fetchPendingConsultants, 
  fetchRecentStories, 
  fetchCurrentPlatformFee 
} from '@/services/adminQuickActions/fetchQuickActionData';

export const useAdminQuickActions = () => {
  const { loading, withLoading } = useLoadingHandler();

  // Wrap action handlers with loading state management
  const handleApproveConsultant = async (consultantId: string) => {
    await withLoading(`approve-${consultantId}`, async () => {
      await approveConsultant(consultantId);
    });
  };

  const handleFeatureStory = async (storyId: string, featured: boolean) => {
    await withLoading(`feature-${storyId}`, async () => {
      await featureStory(storyId, featured);
    });
  };

  const handleUpdatePlatformFee = async (newFeePercentage: number) => {
    await withLoading('update-fee', async () => {
      await updatePlatformFee(newFeePercentage);
    });
  };

  // Get all available quick actions
  const getQuickActions = async (): Promise<QuickAction[]> => {
    try {
      const [pendingConsultants, recentStories] = await Promise.all([
        fetchPendingConsultants(handleApproveConsultant),
        fetchRecentStories(handleFeatureStory),
      ]);

      // Get current platform fee for the update fee action
      const currentFee = await fetchCurrentPlatformFee();
      
      // Add platform fee update action
      const promptForFee = (): Promise<number> => {
        return new Promise((resolve) => {
          const feeStr = prompt('Enter new fee percentage (0-100):', currentFee.toString());
          if (feeStr === null) resolve(currentFee);
          const fee = parseFloat(feeStr || '0');
          if (isNaN(fee)) resolve(currentFee);
          resolve(fee);
        });
      };

      const platformFeeAction: QuickAction = {
        id: 'update-fee',
        title: 'Update Platform Fee',
        description: `Current fee: ${currentFee}%`,
        execute: async () => {
          const newFee = await promptForFee();
          return handleUpdatePlatformFee(newFee);
        },
        variant: 'default'
      };

      return [...pendingConsultants, ...recentStories, platformFeeAction];
    } catch (error) {
      console.error('Error getting quick actions:', error);
      return [];
    }
  };

  return {
    loading,
    getQuickActions,
    approveConsultant: handleApproveConsultant,
    featureStory: handleFeatureStory,
    updatePlatformFee: handleUpdatePlatformFee
  };
};
