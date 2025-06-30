
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your platform, users, and content
        </p>
      </div>
      <Button asChild className="mt-4 md:mt-0">
        <Link to="/home">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Back to Main Site
        </Link>
      </Button>
    </div>
  );
};

export default AdminHeader;
