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
import type { Tax } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Tax name is required.'),
  rate: z.coerce
    .number({ invalid_type_error: 'Rate must be a number' })
    .min(0, 'Rate must be non-negative.')
    .max(100, 'Rate cannot exceed 100.'),
  type: z.enum(['GST', 'VAT', 'Sales Tax', 'Income Tax', 'Payroll Tax', 'Service Tax', 'Withholding Tax']),
});

type CreateTaxFormProps = {
  onTaxCreate: (tax: Omit<Tax, 'id'>) => void;
};

export function CreateTaxForm({ onTaxCreate }: CreateTaxFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'GST',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onTaxCreate({
      ...values,
      rate: values.rate / 100, // Convert percentage to decimal
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., General Sales Tax" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 18" {...field} />
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
              <FormLabel>Tax Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tax type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GST">GST</SelectItem>
                  <SelectItem value="VAT">VAT</SelectItem>
                  <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                  <SelectItem value="Income Tax">Income Tax</SelectItem>
                  <SelectItem value="Payroll Tax">Payroll Tax</SelectItem>
                  <SelectItem value="Service Tax">Service Tax</SelectItem>
                  <SelectItem value="Withholding Tax">Withholding Tax</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Define Tax
        </Button>
      </form>
    </Form>
  );
}
