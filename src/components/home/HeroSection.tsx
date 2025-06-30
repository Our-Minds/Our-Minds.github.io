
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative bg-[#025803] dark:bg-[#014502] text-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              YOUR MENTAL HEALTH<br />OUR PRIORITY
            </h1>
            <p className="text-lg md:text-xl text-green-100 dark:text-green-200">
              Connect with professionals, share your story, and find support in our community.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/consultation">
                    <Button size="lg" variant="secondary" className="bg-white text-[#025803] hover:bg-gray-100">
                      Find a Consultant
                    </Button>
                  </Link>
                  <Link to="/create-story">
                    <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 dark:hover:bg-white/20">
                      Share Your Story
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" variant="secondary" className="bg-white text-[#025803] hover:bg-gray-100">
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 dark:hover:bg-white/20">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600&h=400"
              alt="Mental Health Support"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#025803]/50 dark:from-[#014502]/60 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
