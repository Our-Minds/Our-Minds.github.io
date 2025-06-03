
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading, session } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Check if we have a valid session AND authentication status
  if (!isAuthenticated || !session) {
    console.log("Not authenticated or missing session, redirecting to login");
    // Redirect to login if not authenticated, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not admin, redirecting to home");
    // Redirect to home page if admin access is required but user is not an admin
    return <Navigate to="/home" replace />;
  }
  
  // If authenticated and passes role check, render the protected content
  return <>{children}</>;
};

export default AuthGuard;
