'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function PageHeader({
  title,
  children,
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
          {title}
        </h1>
      </div>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}
