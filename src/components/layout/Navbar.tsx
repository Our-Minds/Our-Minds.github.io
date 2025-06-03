
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateStoryDialog } from '@/components/story/CreateStoryDialog';
import { useState } from 'react';

export function Navbar() {
  const {
    profile,
    isAuthenticated,
    isAdmin,
    logout
  } = useAuth();
  const [createStoryOpen, setCreateStoryOpen] = useState(false);
  
  return <header className="sticky top-0 z-20 w-full bg-[#025803] text-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <img src="/public/assets/OurMinds.png" alt="Our Minds Logo" className="h-8 w-8" />
            <span className="ml-2 text-lg font-semibold">OUR MINDS</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-mental-green-100 transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-mental-green-100 transition-colors">
            About Us
          </Link>
          {!isAuthenticated && <Link to="/login" className="hover:text-mental-green-100 transition-colors">
              Login
            </Link>}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? <>
              
              
              <CreateStoryDialog />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border-2 border-white overflow-hidden">
                    {profile?.profileImage ? <img src={profile.profileImage} alt={profile.name} className="h-8 w-8 rounded-full object-cover" /> : <span className="h-8 w-8 rounded-full bg-mental-green-500 flex items-center justify-center text-sm font-medium">
                        {profile?.name.charAt(0)}
                      </span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
                  {isAdmin && <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>}
        </div>
      </div>
    </header>;
}
export default Navbar;
