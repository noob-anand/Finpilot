'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateProfilePage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);

  const addTransaction = () => {
    const newTransaction = {
      id: `txn-${Date.now()}`,
      description: '',
      amount: '',
      type: 'outflow',
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const removeTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const updatedTransactions = transactions.map((t) => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setTransactions(updatedTransactions);
  };

  const handleSubmit = () => {
    // Filter out any empty transactions
    const validTransactions = transactions.filter(t => t.description && t.amount > 0);
    // Save to local storage
    localStorage.setItem('personal_transactions', JSON.stringify(validTransactions));
    localStorage.setItem('personal_invoices', JSON.stringify([]));
    localStorage.setItem('personal_investments', JSON.stringify([]));
    localStorage.setItem('personal_taxes', JSON.stringify([]));
    localStorage.setItem('finpilot_data_source', 'local');
    
    // Redirect to the personal dashboard
    router.push('/personal');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Your Financial Profile" />
      <Card>
        <CardHeader>
          <CardTitle>Log Your Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg relative">
              <div className="grid gap-2 flex-1">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  placeholder="e.g., Coffee, Client Payment"
                  value={transaction.description}
                  onChange={(e) => handleInputChange(transaction.id, 'description', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  placeholder="25.00"
                  value={transaction.amount}
                   onChange={(e) => handleInputChange(transaction.id, 'amount', parseFloat(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`type-${index}`}>Type</Label>
                <Select
                  value={transaction.type}
                  onValueChange={(value) => handleInputChange(transaction.id, 'type', value)}
                >
                  <SelectTrigger id={`type-${index}`} className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inflow">Income</SelectItem>
                    <SelectItem value="outflow">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="grid gap-2">
                <Label htmlFor={`date-${index}`}>Date</Label>
                 <Input
                    id={`date-${index}`}
                    type="date"
                    value={transaction.date}
                    onChange={(e) => handleInputChange(transaction.id, 'date', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => removeTransaction(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addTransaction}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" disabled={transactions.length === 0}>
          Take me to my Dashboard
        </Button>
      </div>
    </div>
  );
}
