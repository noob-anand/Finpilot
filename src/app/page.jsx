import { PageHeader } from '@/components/page-header';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { CapitalAllocationChart } from '@/components/dashboard/capital-allocation-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <DashboardCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DashboardChart />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <CapitalAllocationChart />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
