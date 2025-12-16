'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTaxes } from '@/lib/data';
import type { Tax } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CreateTaxForm } from './create-tax-form';

export function TaxesTable() {
  const [taxes, setTaxes] = useState<Tax[]>(getTaxes());
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddTax = (newTax: Omit<Tax, 'id'>) => {
    const newId = `TAX-${String(taxes.length + 1).padStart(3, '0')}`;
    setTaxes((prev) => [{ id: newId, ...newTax }, ...prev]);
    setIsSheetOpen(false);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tax Configuration</CardTitle>
            <CardDescription>
              Define and manage your business taxes.
            </CardDescription>
          </div>
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <PlusCircle />
                Define Tax
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Define New Tax</SheetTitle>
              </SheetHeader>
              <CreateTaxForm onTaxCreate={handleAddTax} />
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tax Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxes.map((tax) => (
              <TableRow key={tax.id}>
                <TableCell className="font-medium">{tax.name}</TableCell>
                <TableCell>{tax.type}</TableCell>
                <TableCell className="text-right">{formatPercentage(tax.rate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
