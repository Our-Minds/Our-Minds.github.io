
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateStoryDialog } from '@/components/story/CreateStoryDialog';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';
import { Share } from 'lucide-react';

export function Navbar() {
  const {
    profile,
    isAuthenticated,
    isAdmin,
    logout
  } = useAuth();
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-[#025803] border-b border-[#025803]/20 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 max-w-full">
        
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/assets/OurMinds.png" 
                alt="Our Minds Logo" 
                className="h-8 w-8 rounded-md object-cover group-hover:opacity-90 transition-all duration-200" 
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block group-hover:text-white/90 transition-colors">
              OUR MINDS
            </span>
          </Link>
        </div>
        
        {/* Center Section - Navigation Links */}
        <div className="flex items-center justify-center flex-1">
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
        
        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Share Story Button - Enhanced Design */}
              <div className="hidden sm:block">
                <CreateStoryDialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group relative overflow-hidden bg-white/95 text-[#025803] border-2 border-white/20 hover:bg-white hover:border-white hover:shadow-lg hover:shadow-white/20 transition-all duration-300 h-10 px-5 font-semibold text-sm backdrop-blur-sm hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <Share size={16} className="transition-transform duration-300 group-hover:rotate-12" />
                      <span className="relative z-10">Share</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </CreateStoryDialog>
              </div>
              
              {/* Mobile Share Story - Enhanced Design */}
              <div className="sm:hidden">
                <CreateStoryDialog>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group relative p-2.5 text-white hover:bg-white/15 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <div className="relative">
                      <Share size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                    </div>
                  </Button>
                </CreateStoryDialog>
              </div>
              
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    {profile?.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name} 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    ) : (
                      <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-[#025803]">
                        {profile?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{profile?.name}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <ThemeToggle />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-white text-[#025803] hover:bg-white/90 font-medium px-5 h-9"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
