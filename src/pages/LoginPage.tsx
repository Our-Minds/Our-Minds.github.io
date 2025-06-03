
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If already authenticated, redirect to intended destination or home
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Already authenticated, redirecting");
      const from = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, loading]);
  
  // Don't render anything while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mental-green-50 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-mental-green-50 p-4">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
