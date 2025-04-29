
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Auth context now handles the toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = async (userType: string) => {
    let email = '';
    let password = 'password123';

    switch (userType) {
      case 'user':
        email = 'user@example.com';
        break;
      case 'consultant':
        email = 'consultant@example.com';
        break;
      case 'admin':
        email = 'admin@example.com';
        break;
      default:
        return;
    }

    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <img src="/public/lovable-uploads/5d54d80c-c1d7-4113-b8c7-f8ea5bf4d297.png" alt="Our Minds Logo" className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold text-mental-green-800">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-mental-green-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full bg-mental-green-600 hover:bg-mental-green-700" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-500">Don't have an account? </span>
        <Link to="/signup" className="text-mental-green-600 hover:underline">
          Sign up
        </Link>
      </div>

      {/* For demo purposes - Quick Access */}
      <div className="border-t pt-4">
        <p className="text-center text-xs text-gray-500 mb-2">Quick access for demo:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAccess('user')}
          >
            User
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAccess('consultant')}
          >
            Consultant
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleQuickAccess('admin')}
          >
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
