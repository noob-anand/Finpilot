import { PageHeader } from '@/components/page-header';
import { InvoicesTable } from '@/components/invoices/invoices-table';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" />
      <InvoicesTable />
    </div>
  );
}
