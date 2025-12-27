'use client';
import { PageHeader } from '@/components/page-header';
import { InvoicesTable } from '@/components/invoices/invoices-table';

export default function PersonalInvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Personal Invoices" />
      <InvoicesTable dataSource="local" />
    </div>
  );
}
