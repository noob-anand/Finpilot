'use client';

import { TrendingUp, TrendingDown, Wallet, Scale } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPortfolioSummary } from '@/lib/data';
import { cn } from '@/lib/utils';

export function PortfolioSummary() {
  const summary = getPortfolioSummary();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatPercentage = (amount) => {
      return `${amount.toFixed(2)}%`;
  }

  const isProfit = summary.totalProfitLoss >= 0;

  const cardData = [
    {
      title: 'Total Portfolio Value',
      amount: formatCurrency(summary.totalValue),
      icon: Wallet,
      color: 'text-blue-800 dark:text-blue-200',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    },
    {
      title: 'Total Invested',
      amount: formatCurrency(summary.totalInvested),
      icon: Scale,
      color: 'text-gray-800 dark:text-gray-200',
      bgColor: 'bg-gray-100 dark:bg-gray-900/50',
    },
    {
      title: 'Total Profit/Loss',
      amount: formatCurrency(summary.totalProfitLoss),
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200',
      bgColor: isProfit ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50',
    },
    {
      title: 'Total Return (%)',
      amount: formatPercentage(summary.totalProfitLossPercentage),
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200',
      bgColor: isProfit ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50',
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
