'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Asset name is required.'),
  type: z.enum(['Cryptocurrency', 'Stocks', 'Tokenized Asset', 'ETF']),
  quantity: z.coerce.number().positive('Quantity must be positive.'),
  buyPrice: z.coerce.number().positive('Buy price must be positive.'),
  currentPrice: z.coerce.number().positive('Current price must be positive.'),
});

export function CreateInvestmentForm({ onInvestmentCreate }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'Cryptocurrency',
    },
  });

  const onSubmit = (values) => {
    onInvestmentCreate(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bitcoin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="Stocks">Stocks</SelectItem>
                  <SelectItem value="Tokenized Asset">Tokenized Asset</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 0.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy Price (per unit)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 40000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Price (per unit)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 65000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Investment
        </Button>
      </form>
    </Form>
  );
}
