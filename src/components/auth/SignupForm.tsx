import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConsultantFields from './signup/ConsultantFields';
import { ConsultantFormData } from './signup/types';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'consultant'
  });

  const [consultantData, setConsultantData] = useState<ConsultantFormData>({
    bio: '',
    location: 'Remote',
    hourlyRate: '',
    paypalEmail: '',
    specializations: [],
    languages: ['English']
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    if (formData.role === 'consultant') {
      if (!consultantData.bio.trim()) {
        toast({
          title: "Validation Error",
          description: "Bio is required for consultants",
          variant: "destructive"
        });
        return false;
      }

      if (!consultantData.paypalEmail.trim()) {
        toast({
          title: "Validation Error",
          description: "PayPal email is required for consultants",
          variant: "destructive"
        });
        return false;
      }

      if (!consultantData.hourlyRate || parseFloat(consultantData.hourlyRate) <= 0) {
        toast({
          title: "Validation Error",
          description: "Valid hourly rate is required for consultants",
          variant: "destructive"
        });
        return false;
      }

      if (consultantData.specializations.length === 0) {
        toast({
          title: "Validation Error",
          description: "At least one specialization is required for consultants",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    console.log('Starting signup process...');
    console.log('Form data:', { ...formData, password: '[REDACTED]' });
    console.log('Consultant data:', consultantData);

    try {
      const userData = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        specialization: formData.role === 'consultant' ? consultantData.specializations : undefined,
        languages: formData.role === 'consultant' ? consultantData.languages : undefined,
        location: formData.role === 'consultant' ? consultantData.location : undefined,
        paypalEmail: formData.role === 'consultant' ? consultantData.paypalEmail : undefined,
        bio: formData.role === 'consultant' ? consultantData.bio : undefined
      };

      await signup(userData, formData.password);

      if (formData.role === 'consultant') {
        toast({
          title: "Application Submitted!",
          description: "Your consultant application has been submitted for review. You'll be notified once it's approved.",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully.",
        });
      }

      navigate('/');
      
    } catch (error: any) {
      console.error('Signup process failed:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-white dark:bg-mental-green-950 border-gray-200 dark:border-mental-green-800 text-gray-900 dark:text-white">
        <CardHeader className="space-y-1">
          <img src="/assets/OurMinds.png" alt="Our Minds Logo" className="mx-auto h-12 w-12" />
          <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Create an Account</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            Join our mental health support community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-200">Account Type</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'user' | 'consultant') => setFormData(prev => ({ ...prev, role: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#212121] border-gray-300 dark:border-gray-600">
                  <SelectItem value="user" className="text-gray-900 dark:text-gray-100">User</SelectItem>
                  <SelectItem value="consultant" className="text-gray-900 dark:text-gray-100">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                minLength={6}
              />
            </div>
            {formData.role === 'consultant' && (
              <ConsultantFields
                consultantData={consultantData}
                setConsultantData={setConsultantData}
                isLoading={isLoading}
              />
            )}
            <Button 
              type="submit" 
              className="w-full bg-mental-green-600 hover:bg-mental-green-700 dark:bg-mental-green-600 dark:hover:bg-mental-green-500 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {formData.role === 'consultant' ? 'Submitting Application...' : 'Creating Account...'}
                </>
              ) : (
                formData.role === 'consultant' ? 'Submit Application' : 'Create Account'
              )}
            </Button>

            <div className="text-center text-sm pt-2">
              <span className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
              </span>
              <Link 
                to="/login" 
                className="text-mental-green-600 dark:text-mental-green-400 hover:underline font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
