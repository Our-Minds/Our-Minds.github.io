
import { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  description: string;
  session_id: string | null;
  user_name?: string;
}

export default function FinancesTab() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newPaypalEmail, setNewPaypalEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [pendingPayout, setPendingPayout] = useState(0);

  useEffect(() => {
    if (user) {
      fetchConsultantData();
      fetchTransactions();
    }
  }, [user]);

  const fetchConsultantData = async () => {
    if (!user) return;

    try {
      const { data: consultant, error } = await supabase
        .from('consultants')
        .select('paypal_email')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (consultant) {
        setPaypalEmail(consultant.paypal_email || '');
        setNewPaypalEmail(consultant.paypal_email || '');
      }
    } catch (error: any) {
      console.error('Error fetching consultant data:', error);
      toast({
        title: "Error loading consultant data",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First get transactions
      const { data: transactionData, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Then get user names for sessions
      const processedTransactions = await Promise.all(
        (transactionData || []).map(async (transaction) => {
          let userName = 'Unknown Client';
          
          if (transaction.session_id) {
            try {
              const { data: session } = await supabase
                .from('sessions')
                .select('user_id')
                .eq('id', transaction.session_id)
                .single();
                
              if (session) {
                const { data: user } = await supabase
                  .from('users')
                  .select('name')
                  .eq('id', session.user_id)
                  .single();
                  
                if (user) {
                  userName = user.name;
                }
              }
            } catch (error) {
              console.error('Error fetching user name:', error);
            }
          }
          
          return {
            ...transaction,
            user_name: userName
          };
        })
      );

      setTransactions(processedTransactions);
      calculateEarnings(processedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEarnings = (transactionData: Transaction[]) => {
    const completed = transactionData.filter(tx => tx.status === 'completed');
    const total = completed.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate this month's earnings
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTotal = completed
      .filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate pending payout (pending transactions)
    const pending = transactionData
      .filter(tx => tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);

    setTotalEarnings(total);
    setMonthlyEarnings(monthlyTotal);
    setPendingPayout(pending);
  };

  const handleSaveEmail = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('consultants')
        .update({ paypal_email: newPaypalEmail })
        .eq('id', user.id);

      if (error) throw error;

      setPaypalEmail(newPaypalEmail);
      setIsEditing(false);
      
      toast({
        title: "PayPal email updated",
        description: "Your payment information has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating PayPal email:', error);
      toast({
        title: "Error updating PayPal email",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</span>
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
              <span className="text-2xl font-bold">${pendingPayout.toFixed(2)}</span>
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
                    disabled={isLoading}
                  />
                  <Button onClick={handleSaveEmail} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewPaypalEmail(paypalEmail);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="paypal-email"
                    value={paypalEmail || 'No PayPal email set'}
                    disabled
                    className="bg-muted"
                  />
                  <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                    Change
                  </Button>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p>Loading transactions...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet. Complete sessions to see your earnings here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>{transaction.user_name || 'Unknown Client'}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
