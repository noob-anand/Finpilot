'use client';

import { useState, useEffect } from 'react';
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
import { getInvestments } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CreateInvestmentForm } from './create-investment-form';

export function InvestmentsTable({ dataSource = 'default' }) {
  const [investments, setInvestments] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setInvestments(getInvestments(dataSource));
  }, [dataSource]);

  const handleAddInvestment = (newInvestment) => {
    const newId = `INV-ASSET-${String(investments.length + 1).padStart(3, '0')}`;
    const updatedInvestments = [{ id: newId, ...newInvestment }, ...investments];
    setInvestments(updatedInvestments);

    if (typeof window !== 'undefined' && dataSource === 'local') {
        localStorage.setItem('personal_investments', JSON.stringify(updatedInvestments));
    }
    setIsSheetOpen(false);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateProfitLoss = (investment) => {
    return (investment.currentPrice - investment.buyPrice) * investment.quantity;
  }

  const calculateTotalValue = (investment) => {
    return investment.currentPrice * investment.quantity;
  }
  
  const calculateInvestedAmount = (investment) => {
      return investment.buyPrice * investment.quantity;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Investments</CardTitle>
            <CardDescription>
              Track your digital asset portfolio.
            </CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <PlusCircle />
                Add Investment
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Investment</SheetTitle>
              </SheetHeader>
              <CreateInvestmentForm onInvestmentCreate={handleAddInvestment} />
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Invested</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Profit/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => {
                const profitLoss = calculateProfitLoss(investment);
                return (
                    <TableRow key={investment.id}>
                        <TableCell>
                            <div className="font-medium">{investment.name}</div>
                            <div className="text-sm text-muted-foreground">{investment.type}</div>
                        </TableCell>
                        <TableCell>{formatCurrency(calculateInvestedAmount(investment))}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(calculateTotalValue(investment))}</TableCell>
                        <TableCell className={cn('font-semibold', profitLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {formatCurrency(profitLoss)}
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
