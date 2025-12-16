import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  FileWarning,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getFinancialSummary } from '@/lib/data';
import { cn } from '@/lib/utils';

export function DashboardCards() {
  const summary = getFinancialSummary();

  const formatCurrency = (amount: number) => {
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
      title: 'Net Cash Flow',
      amount: formatCurrency(summary.netCashFlow),
      icon: CircleDollarSign,
      color:
        summary.netCashFlow >= 0
          ? 'text-cyan-800 dark:text-cyan-200'
          : 'text-orange-800 dark:text-orange-200',
      bgColor:
        summary.netCashFlow >= 0
          ? 'bg-cyan-100 dark:bg-cyan-900/50'
          : 'bg-orange-100 dark:bg-orange-900/50',
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
        <Card key={card.title} className={cn(card.bgColor)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={cn("text-sm font-medium", card.color)}>{card.title}</CardTitle>
            <card.icon className={cn('h-5 w-5', card.color)} />
          </CardHeader>
          <CardContent className="p-0">
            <div className={cn('text-2xl font-bold p-6', card.color)}>{card.amount}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
