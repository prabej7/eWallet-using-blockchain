import {
  Table as T,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transactions } from '@/declarations/backend/backend.did';
import { useEffect, useState } from 'react';

const Table: React.FC<{
  transactions: Transactions[];
  onClick: (transaction: Transactions) => void;
}> = ({ transactions, onClick }) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let t = 0;
    transactions.map((transaction) => {
      t += Number(transaction.amount);
    });
    setTotal(t);
  }, [transactions]);

  return (
    <T>
      <TableCaption>
        {transactions.length == 0
          ? 'No Transactions yet.'
          : 'A list of your recent invoices.'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Transaction ID</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          return (
            <TableRow onClick={() => onClick(transaction)}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>
                {transaction.from} ({transaction.fromName})
              </TableCell>
              <TableCell>
                {transaction.to} ({transaction.toName})
              </TableCell>
              <TableCell className="text-right">
                ${Number(transaction.amount)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {transactions.length !== 0 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">${total}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </T>
  );
};

export default Table;
