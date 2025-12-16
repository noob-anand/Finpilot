'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getCapitalAllocation } from '@/lib/data';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  'Operating Expenses': {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
  'Taxes': {
    label: 'Taxes',
    color: 'hsl(var(--chart-4))',
  },
  'Investments': {
    label: 'Investments',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


export function CapitalAllocationChart() {
  const data = getCapitalAllocation();
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const customTooltipFormatter = (value: number) => {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    return `${formattedValue} (${percentage}%)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Allocation</CardTitle>
        <CardDescription>
          Where your money is going.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" formatter={customTooltipFormatter} />} />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    strokeWidth={5}
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
                    ))}
                </Pie>
                 <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}