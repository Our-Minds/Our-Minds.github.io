
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, DollarSign, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock transaction data - in a real app, this would come from an API
interface Transaction {
  id: string;
  date: string;
  clientName: string;
  sessionType: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2025-04-15T10:30:00Z',
    clientName: 'Michael Johnson',
    sessionType: 'One-hour consultation',
    amount: 85,
    status: 'completed'
  },
  {
    id: 'tx-002',
    date: '2025-04-10T14:00:00Z',
    clientName: 'Sarah Williams',
    sessionType: 'Follow-up session',
    amount: 60,
    status: 'completed'
  },
  {
    id: 'tx-003',
    date: '2025-04-05T11:15:00Z',
    clientName: 'James Roberts',
    sessionType: 'Initial assessment',
    amount: 95,
    status: 'completed'
  },
  {
    id: 'tx-004',
    date: '2025-04-01T16:45:00Z',
    clientName: 'Emily Davis',
    sessionType: 'One-hour consultation',
    amount: 85,
    status: 'completed'
  }
];

export default function FinancesTab() {
  const { toast } = useToast();
  const [paypalEmail, setPaypalEmail] = useState('consultant@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [newPaypalEmail, setNewPaypalEmail] = useState(paypalEmail);

  // Calculate total earnings
  const totalEarnings = mockTransactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const handleSaveEmail = () => {
    setPaypalEmail(newPaypalEmail);
    setIsEditing(false);
    
    toast({
      title: "PayPal email updated",
      description: "Your payment information has been updated successfully.",
    });
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-mental-green-500" />
              <span className="text-2xl font-bold">${totalEarnings.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-mental-green-500" />
              <span className="text-2xl font-bold">$325.00</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4 text-mental-green-500" />
              <span className="text-2xl font-bold">$85.00</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Update your payment details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paypal-email">PayPal Email</Label>
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="paypal-email"
                    value={newPaypalEmail}
                    onChange={(e) => setNewPaypalEmail(e.target.value)}
                    placeholder="your-paypal@example.com"
                    className="flex-1"
                  />
                  <Button onClick={handleSaveEmail}>Save</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewPaypalEmail(paypalEmail);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="paypal-email"
                    value={paypalEmail}
                    disabled
                    className="bg-muted"
                  />
                  <Button onClick={() => setIsEditing(true)}>Change</Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                All payments will be sent to this PayPal email address.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent payment history and session details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.clientName}</TableCell>
                  <TableCell>{transaction.sessionType}</TableCell>
                  <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
