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
    <div className="w-full max-w-md space-y-6 p-6 bg-white dark:bg-mental-green-950 rounded-lg shadow-md border border-gray-200 dark:border-mental-green-800">
      <div className="text-center">
        <img src="/assets/OurMinds.png" alt="Our Minds Logo" className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
            <Link to="/forgot-password" className="text-xs text-mental-green-600 dark:text-mental-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-mental-green-600 hover:bg-mental-green-700 dark:bg-mental-green-600 dark:hover:bg-mental-green-500 text-white" 
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-300">Don't have an account? </span>
        <Link to="/signup" className="text-mental-green-600 dark:text-mental-green-400 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
