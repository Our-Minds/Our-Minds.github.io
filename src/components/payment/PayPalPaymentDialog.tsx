
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Mail, DollarSign, Clock } from 'lucide-react';

interface PayPalPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  consultantName: string;
  consultantEmail: string;
  amount: number;
  onPaymentComplete: () => void;
}

export const PayPalPaymentDialog = ({
  isOpen,
  onClose,
  consultantName,
  consultantEmail,
  amount,
  onPaymentComplete
}: PayPalPaymentDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handlePaymentComplete = () => {
    setPaymentConfirmed(true);
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 2000);
  };

  const paypalUrl = "https://www.paypal.com/us/digital-wallet/send-receive-money/send-money";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pay with PayPal - ${amount.toFixed(2)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PayPal Container */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">PayPal Payment Portal</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(paypalUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                src={paypalUrl}
                className="w-full h-96 border-0"
                title="PayPal Send Money"
                sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
              />
            </div>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Important:</p>
              <p>If the PayPal page doesn't load properly, click "Open in New Tab" above to complete your payment.</p>
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-mental-green-50 p-4 rounded-lg border border-mental-green-200">
                  <h4 className="font-semibold text-mental-green-800 mb-2">Consultant Details</h4>
                  <p className="text-sm"><strong>Name:</strong> {consultantName}</p>
                  <p className="text-sm"><strong>PayPal Email:</strong> {consultantEmail}</p>
                  <p className="text-sm"><strong>Amount:</strong> ${amount.toFixed(2)} USD</p>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-start gap-3 p-3 rounded-lg ${currentStep >= 1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      1
                    </div>
                    <div>
                      <h5 className="font-medium">Log in to PayPal</h5>
                      <p className="text-sm text-gray-600">Use the PayPal portal on the left to log into your account</p>
                      {currentStep === 1 && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setCurrentStep(2)}
                        >
                          I'm Logged In
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg ${currentStep >= 2 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      2
                    </div>
                    <div>
                      <h5 className="font-medium">Send Money</h5>
                      <p className="text-sm text-gray-600">Click "Send" and enter the consultant's email:</p>
                      <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-800 border-yellow-300">
                        {consultantEmail}
                      </Badge>
                      {currentStep === 2 && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setCurrentStep(3)}
                        >
                          Email Entered
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg ${currentStep >= 3 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      3
                    </div>
                    <div>
                      <h5 className="font-medium">Enter Amount</h5>
                      <p className="text-sm text-gray-600">Enter exactly:</p>
                      <Badge variant="outline" className="mt-1 bg-green-50 text-green-800 border-green-300">
                        ${amount.toFixed(2)} USD
                      </Badge>
                      {currentStep === 3 && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setCurrentStep(4)}
                        >
                          Amount Entered
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg ${currentStep >= 4 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      4
                    </div>
                    <div>
                      <h5 className="font-medium">Add Note (Optional)</h5>
                      <p className="text-sm text-gray-600">Add a note: "Therapy session booking"</p>
                      {currentStep === 4 && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setCurrentStep(5)}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg ${currentStep >= 5 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 5 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      5
                    </div>
                    <div>
                      <h5 className="font-medium">Send Payment</h5>
                      <p className="text-sm text-gray-600">Review and click "Send Money" to complete payment</p>
                      {currentStep === 5 && !paymentConfirmed && (
                        <Button 
                          size="sm" 
                          className="mt-2 bg-green-600 hover:bg-green-700"
                          onClick={handlePaymentComplete}
                        >
                          I've Sent the Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {paymentConfirmed && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Payment Completed!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your session is now pending confirmation from {consultantName}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-amber-600">
                  <Clock className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Payment Verification</p>
                    <p className="text-sm">
                      {consultantName} will confirm receipt of payment and approve your session. 
                      You'll receive a notification once confirmed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
