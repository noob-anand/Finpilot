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
import type { Tax } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Tax name is required.'),
  rate: z.coerce
    .number({ invalid_type_error: 'Rate must be a number' })
    .min(0, 'Rate must be non-negative.')
    .max(100, 'Rate cannot exceed 100.'),
});

type CreateTaxFormProps = {
  onTaxCreate: (tax: Omit<Tax, 'id'>) => void;
};

export function CreateTaxForm({ onTaxCreate }: CreateTaxFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
        <Button type="submit" className="w-full">
          Define Tax
        </Button>
      </form>
    </Form>
  );
}
