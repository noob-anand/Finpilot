'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, Home, Receipt, Wallet } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AiCopilot from '@/components/ai-copilot';
import Image from 'next/image';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
    { href: '/transactions', label: 'Transactions', icon: Wallet },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="font-semibold text-xl">FinPilot</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <Image src="https://picsum.photos/seed/finpilot-user/100" alt="User avatar" width={36} height={36} data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Business Owner</span>
              <span className="text-xs text-muted-foreground">
                owner@example.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen">
          <main className="flex-1 p-4 lg:p-6 bg-background rounded-xl m-4">{children}</main>
        </div>
        <AiCopilot />
      </SidebarInset>
    </SidebarProvider>
  );
}
