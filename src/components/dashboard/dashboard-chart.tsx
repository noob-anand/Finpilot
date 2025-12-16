'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getMonthlyChartData } from '@/lib/data';
import { ChartTooltipContent } from '@/components/ui/chart';

export function DashboardChart() {
  const data = getMonthlyChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Overview</CardTitle>
        <CardDescription>Monthly Inflow vs. Outflow</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="inflow" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
