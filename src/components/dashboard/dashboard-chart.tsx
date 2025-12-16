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
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={1}/>
                  <stop offset="95%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
               <YAxis yAxisId="right" orientation="right" hide={true} />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="netProfit"
                stroke="url(#splitColor)"
                strokeWidth={2}
                dot={{
                  fill: "hsl(var(--chart-3))",
                  r: 4,
                }}
                activeDot={{
                   r: 6
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="inflow"
                fill="var(--color-inflow)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="outflow"
                fill="var(--color-outflow)"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
