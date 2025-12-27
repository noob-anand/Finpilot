'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { CapitalAllocationChart } from '@/components/dashboard/capital-allocation-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PersonalDashboardPage() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const dataSource = localStorage.getItem('finpilot_data_source');
    if (dataSource === 'local') {
      setHasData(true);
    }
  }, []);

  if (!hasData) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-semibold mb-4">Your Personal Dashboard is Empty</h2>
            <p className="text-muted-foreground mb-6">
                It looks like you haven't created your profile yet. Please add some financial data to get started.
            </p>
            <Button asChild>
                <Link href="/personal/data">Create Your Profile</Link>
            </Button>
        </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Personal Dashboard" />
      <DashboardCards dataSource="local" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DashboardChart dataSource="local" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <CapitalAllocationChart dataSource="local" />
          <RecentActivity dataSource="local" />
        </div>
      </div>
    </div>
  );
}
