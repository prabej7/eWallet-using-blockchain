import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Transactions } from '@/declarations/backend/backend.did';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transactions;
}

const Transaction: React.FC<Props> = ({ open, onClose, transaction }) => {
  const [date, setDate] = useState<Date>();
  useEffect(() => {
    setDate(Date(transaction.time));
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transaction ID : 123456</AlertDialogTitle>
          <AlertDialogDescription>
            See the transaction details.
          </AlertDialogDescription>
          <div className="flex gap-12">
            <div>
              <ul>
                <li>Date</li>
                <li>.</li>
                <li>From</li>
                <li>To</li>
                <li>Purpose</li>
                <li>Amount</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>{String(date)}</li>
                
                <li>
                  {transaction.fromName} ({transaction.from})
                </li>
                <li>
                  {transaction.toName} ({transaction.to})
                </li>
                <li>{transaction.remarks}</li>
                <li>${Number(transaction.amount)}</li>
              </ul>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="destructive" onClick={onClose}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Transaction;
