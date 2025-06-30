
// This file is now a re-export file for backward compatibility
// Import all the hooks from the new directory
import {
  useUsers,
  usePromoteUser,
  useRemoveUser,
  useStoriesModeration,
  useToggleStoryFeature,
  usePendingConsultants,
  useApproveConsultant,
  useRejectConsultant,
  useDashboardStats,
  useRecentActivities,
  useAdminSettings,
  useSaveSettings
} from './admin';

// Re-export all the hooks
export {
  useUsers,
  usePromoteUser,
  useRemoveUser,
  useStoriesModeration,
  useToggleStoryFeature,
  usePendingConsultants,
  useApproveConsultant,
  useRejectConsultant,
  useDashboardStats,
  useRecentActivities,
  useAdminSettings,
  useSaveSettings
};
