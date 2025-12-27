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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const chartConfig = {
  'Rent': {
    label: 'Rent',
    color: 'hsl(var(--chart-1))',
  },
  'Salaries': {
    label: 'Salaries',
    color: 'hsl(var(--chart-2))',
  },
  'Taxes': {
    label: 'Taxes',
    color: 'hsl(var(--chart-3))',
  },
  'Marketing': {
    label: 'Marketing',
    color: 'hsl(var(--chart-4))',
  },
  'Investments': {
    label: 'Investments',
    color: 'hsl(var(--chart-5))',
  },
};


export function CapitalAllocationChart({ dataSource = 'default' }) {
  const [data, setData] = useState([]);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  useEffect(() => {
    setData(getCapitalAllocation(dataSource));
  }, [dataSource]);

  const customTooltipFormatter = (value) => {
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    return `${formattedValue} (${percentage}%)`;
  };

  const CustomLegend = ({ payload }) => {
    const totalForLegend = payload.reduce((acc, curr) => acc + curr.payload.value, 0);
    return (
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {payload.map((entry, index) => {
          const { name, value, color } = entry.payload;
          const percentage = totalForLegend > 0 ? ((value / totalForLegend) * 100).toFixed(1) : 0;
          
          return (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
              <div className="flex flex-col text-xs">
                <span className="font-medium text-muted-foreground">{name}</span>
                <span className="font-bold">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
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
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data to display.</p>
          </div>
        ) : (
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
                      <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color || '#8884d8'} />
                      ))}
                  </Pie>
                  <Legend content={<CustomLegend />} />
                  </PieChart>
              </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
