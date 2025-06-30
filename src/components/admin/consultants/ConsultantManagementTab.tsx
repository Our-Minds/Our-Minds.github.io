
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAllConsultants, useApproveConsultant, useRejectConsultant } from '@/hooks/admin/useAdminConsultants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Eye, X, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddConsultantDialog } from './AddConsultantDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ConsultantManagementTab = () => {
  const { data: consultants, isLoading, error, refetch } = useAllConsultants();
  const approveConsultant = useApproveConsultant();
  const rejectConsultant = useRejectConsultant();

  console.log('ConsultantManagementTab - consultants:', consultants);
  console.log('ConsultantManagementTab - isLoading:', isLoading);
  console.log('ConsultantManagementTab - error:', error);

  const handleApproveConsultant = (consultantId: string) => {
    console.log('Approving consultant:', consultantId);
    approveConsultant.mutate(consultantId);
  };

  const handleRejectConsultant = (consultantId: string) => {
    console.log('Rejecting consultant:', consultantId);
    rejectConsultant.mutate(consultantId);
  };

  const handleRefresh = () => {
    console.log('Manually refreshing consultant data...');
    refetch();
  };

  // Filter consultants by status
  const pendingConsultants = consultants?.filter(c => c.status === 'pending') || [];
  const approvedConsultants = consultants?.filter(c => c.status === 'approved') || [];
  const rejectedConsultants = consultants?.filter(c => c.status === 'rejected') || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderConsultantTable = (consultantList: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultantList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No consultants found in this category
            </TableCell>
          </TableRow>
        ) : (
          consultantList.map((consultant) => (
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
              <TableCell>
                <Badge variant={getStatusBadgeVariant(consultant.status)}>
                  {consultant.status.charAt(0).toUpperCase() + consultant.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{consultant.submittedDate}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {consultant.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleApproveConsultant(consultant.id)}
                        disabled={approveConsultant.isPending}
                        className="text-green-600 hover:bg-green-50"
                        title="Approve consultant"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRejectConsultant(consultant.id)}
                        disabled={rejectConsultant.isPending}
                        className="text-red-600 hover:bg-red-50"
                        title="Reject consultant"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Consultant Management</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddConsultantDialog>
            <Button size="sm">
              Add Consultant
            </Button>
          </AddConsultantDialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{pendingConsultants.length}</div>
          <div className="text-sm text-blue-600">Pending</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{approvedConsultants.length}</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{rejectedConsultants.length}</div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
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
            <p className="text-red-600 font-medium">Failed to load consultants</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingConsultants.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedConsultants.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedConsultants.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              {renderConsultantTable(pendingConsultants)}
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              {renderConsultantTable(approvedConsultants)}
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              {renderConsultantTable(rejectedConsultants)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ConsultantManagementTab;
