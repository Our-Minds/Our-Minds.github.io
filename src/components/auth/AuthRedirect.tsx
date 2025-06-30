
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If authenticated, don't redirect to login
    if (isAuthenticated) {
      // Check if we have a "from" location in state and redirect there
      const from = (location.state as { from?: Location })?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } else {
      // Only redirect to login if not authenticated
      navigate('/login', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [navigate, isAuthenticated, location]);
  
  return null;
}

export default AuthRedirect;
