
import { PageHeader } from '@/components/page-header';
import { PortfolioSummary } from '@/components/investments/portfolio-summary';
import { InvestmentsTable } from '@/components/investments/investments-table';
import { AssetAllocationChart } from '@/components/investments/asset-allocation-chart';

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Digital Asset Investments" />
      <PortfolioSummary />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InvestmentsTable />
        </div>
        <div className="lg:col-span-2">
          <AssetAllocationChart />
        </div>
      </div>
    </div>
  );
}
