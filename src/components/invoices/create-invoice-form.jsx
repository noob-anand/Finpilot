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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  customer: z.string().min(2, 'Customer name is required.'),
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be positive.'),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  taxId: z.string().optional(),
});

export function CreateInvoiceForm({ onInvoiceCreate, taxes = [] }) {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
    },
  });

  const onSubmit = (values) => {
    let taxAmount = undefined;
    if (values.taxId && values.taxId !== 'no-tax') {
      const selectedTax = taxes.find(t => t.id === values.taxId);
      if (selectedTax) {
        taxAmount = values.amount * selectedTax.rate;
      }
    }

    onInvoiceCreate({
      customer: values.customer,
      amount: values.amount,
      status: 'unpaid',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      taxId: values.taxId,
      taxAmount,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1500.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apply Tax (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tax to apply" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no-tax">No Tax</SelectItem>
                  {taxes.map(tax => (
                    <SelectItem key={tax.id} value={tax.id}>
                      {tax.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Invoice
        </Button>
      </form>
    </Form>
  );
}
