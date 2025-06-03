
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
    <div className="w-full max-w-md space-y-6 p-6 bg-[#025803] rounded-lg shadow-md">
      <div className="text-center">
        <img src="/public/assets/OurMinds.png" alt="Our Minds Logo" className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-100">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-gray-100 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input className="w-full  text-black"
            id="email"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="text-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-white">
              Forgot password?
            </Link>
          </div>
          <Input className="w-full  text-black"
            id="password"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full bg-mental-green-400 hover:bg-mental-green-700" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-200">Don't have an account? </span>
        <Link to="/signup" className="text-mental-green-200 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
