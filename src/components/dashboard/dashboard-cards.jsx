'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  FileWarning,
  Landmark,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getFinancialSummary } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function DashboardCards({ dataSource = 'default' }) {
  const [summary, setSummary] = useState({
      cashInflow: 0,
      cashOutflow: 0,
      netTaxes: 0,
      unpaidInvoicesCount: 0
  });

  useEffect(() => {
      setSummary(getFinancialSummary(dataSource));
  }, [dataSource]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cardData = [
    {
      title: 'Total Cash Inflow',
      amount: formatCurrency(summary.cashInflow),
      icon: ArrowUpRight,
      color: 'text-green-800 dark:text-green-200',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
    },
    {
      title: 'Total Cash Outflow',
      amount: formatCurrency(summary.cashOutflow),
      icon: ArrowDownLeft,
      color: 'text-red-800 dark:text-red-200',
      bgColor: 'bg-red-100 dark:bg-red-900/50',
    },
    {
      title: 'Net Taxes Payable',
      amount: formatCurrency(summary.netTaxes),
      icon: Landmark,
      color: 'text-cyan-800 dark:text-cyan-200',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/50',
    },
    {
      title: 'Unpaid Invoices',
      amount: summary.unpaidInvoicesCount.toString(),
      icon: FileWarning,
      color: 'text-yellow-800 dark:text-yellow-200',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.title} className={cn('overflow-hidden', card.bgColor)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", card.color)}>{card.title}</CardTitle>
            <card.icon className={cn('h-5 w-5', card.color)} />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className={cn('text-2xl font-bold', card.color)}>{card.amount}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
