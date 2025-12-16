
import { PageHeader } from '@/components/page-header';
import { TaxesTable } from '@/components/taxes/taxes-table';

export default function TaxesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tax Management" />
      <TaxesTable />
    </div>
  );
}
