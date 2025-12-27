'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getAssetAllocation } from '@/lib/data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useState, useEffect } from 'react';


const chartConfig = {
  Cryptocurrency: {
    label: 'Crypto',
    color: 'hsl(var(--chart-1))',
  },
  Stocks: {
    label: 'Stocks',
    color: 'hsl(var(--chart-2))',
  },
  ETF: {
    label: 'ETFs',
    color: 'hsl(var(--chart-3))',
  },
  'Tokenized Asset': {
    label: 'Tokens',
    color: 'hsl(var(--chart-4))',
  },
};


export function AssetAllocationChart({ dataSource = 'default' }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(getAssetAllocation(dataSource));
  }, [dataSource]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>
          Distribution of your digital investments by asset type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
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
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
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
