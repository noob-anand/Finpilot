import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getTransactions, getInvoices } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';


export function RecentActivity() {
  const recentTransactions = getTransactions().slice(0, 3);
  const recentInvoices = getInvoices().filter(i => i.status !== 'paid').slice(0, 3);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          A quick look at your latest financial movements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Pending Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                        transaction.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.type === 'inflow' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <div className="mt-4 text-center">
                <Button variant="ghost" asChild>
                    <Link href="/transactions">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="invoices">
            <Table>
               <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.customer}</div>
                       <Badge
                        variant={
                          invoice.status === 'overdue' ? 'destructive' : 'outline'
                        }
                        className={cn(
                          'text-xs mt-1',
                           invoice.status === 'unpaid' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                        )}
                        >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
                <Button variant="ghost" asChild>
                    <Link href="/invoices">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
