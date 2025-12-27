'use client';
import { PageHeader } from '@/components/page-header';
import { TaxesTable } from '@/components/taxes/taxes-table';

export default function PersonalTaxesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Personal Tax Management" />
      <TaxesTable dataSource="local" />
    </div>
  );
}
