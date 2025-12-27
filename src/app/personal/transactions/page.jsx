'use client';
import { PageHeader } from '@/components/page-header';
import { TransactionsTable } from '@/components/transactions/transactions-table';

export default function PersonalTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Personal Transactions" />
      <TransactionsTable dataSource="local" />
    </div>
  );
}
