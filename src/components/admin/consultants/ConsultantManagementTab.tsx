
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePendingConsultants, useApproveConsultant } from '@/hooks/useAdminData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ConsultantManagementTab = () => {
  const { data: consultants, isLoading, error } = usePendingConsultants();
  const approveConsultant = useApproveConsultant();

  const handleApproveConsultant = (consultantId: string) => {
    approveConsultant.mutate(consultantId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Consultant Management</h3>
        <Button size="sm">
          Add Consultant
        </Button>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p>Failed to load consultants</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        ) : consultants && consultants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultants.map((consultant) => (
                <TableRow key={consultant.id}>
                  <TableCell>{consultant.name}</TableCell>
                  <TableCell>{consultant.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {consultant.specialization.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {consultant.specialization.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{consultant.specialization.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{consultant.submittedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleApproveConsultant(consultant.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p>No pending consultants</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantManagementTab;
