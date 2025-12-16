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
      color: 'text-green-500',
    },
    {
      title: 'Total Cash Outflow',
      amount: formatCurrency(summary.cashOutflow),
      icon: ArrowDownLeft,
      color: 'text-red-500',
    },
    {
      title: 'Net Cash Flow',
      amount: formatCurrency(summary.netCashFlow),
      icon: CircleDollarSign,
      color: summary.netCashFlow >= 0 ? 'text-blue-500' : 'text-orange-500',
    },
    {
      title: 'Unpaid Invoices',
      amount: summary.unpaidInvoicesCount.toString(),
      icon: FileWarning,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.amount}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
