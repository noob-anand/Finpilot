'use client';

import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getMonthlyChartData } from '@/lib/data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartConfig = {
  inflow: {
    label: 'Inflow',
    color: 'hsl(var(--chart-1))',
  },
  outflow: {
    label: 'Outflow',
    color: 'hsl(var(--chart-2))',
  },
  netProfit: {
    label: 'Net Profit',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const data = getMonthlyChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Overview</CardTitle>
        <CardDescription>Monthly Inflow vs. Outflow</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="inflow"
                fill="var(--color-inflow)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="outflow"
                fill="var(--color-outflow)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke="var(--color-netProfit)"
                strokeWidth={2}
                dot={{
                  fill: 'var(--color-netProfit)',
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
