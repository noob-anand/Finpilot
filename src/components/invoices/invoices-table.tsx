'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInvoices, getTaxes } from '@/lib/data';
import type { Invoice } from '@/types';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CreateInvoiceForm } from './create-invoice-form';

export function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const taxes = getTaxes();

  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    const newId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    setInvoices((prev) => [{ id: newId, ...newInvoice }, ...prev]);
    setIsSheetOpen(false);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalAmount = (invoice: Invoice) => {
    return invoice.amount + (invoice.taxAmount || 0);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>
              View, create, and track your invoices.
            </CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <PlusCircle />
                Create Invoice
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New Invoice</SheetTitle>
              </SheetHeader>
              <CreateInvoiceForm onInvoiceCreate={handleAddInvoice} />
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Base Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>{invoice.taxAmount ? formatCurrency(invoice.taxAmount) : 'N/A'}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(getTotalAmount(invoice))}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === 'paid'
                        ? 'secondary'
                        : invoice.status === 'overdue'
                        ? 'destructive'
                        : 'outline'
                    }
                    className={cn(
                       invoice.status === 'paid' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                       invoice.status === 'unpaid' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                    )}
                  >
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
