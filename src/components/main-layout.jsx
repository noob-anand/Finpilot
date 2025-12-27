'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DollarSign,
  Home,
  Receipt,
  Wallet,
  Landmark,
  CandlestickChart,
  User,
  Sparkles,
} from 'lucide-react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPersonal = pathname.startsWith('/personal');

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
    { href: '/transactions', label: 'Transactions', icon: Wallet },
    { href: '/taxes', label: 'Taxes', icon: Landmark },
    { href: '/investments', label: 'Investments', icon: CandlestickChart },
  ];

  const handleUseExample = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finpilot_data_source');
      router.push('/');
    }
  };

  const getHref = (baseHref) => {
    if (!isPersonal) return baseHref;
    if (baseHref === '/') return '/personal';
    return `/personal${baseHref}`;
  };

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
                <Link href={getHref(item.href)}>
                  <SidebarMenuButton
                    isActive={pathname === getHref(item.href)}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-sidebar-accent transition-colors">
                <Avatar className="h-9 w-9">
                  <Image
                    src="https://picsum.photos/seed/finpilot-user/100"
                    alt="User avatar"
                    width={36}
                    height={36}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Business Owner</span>
                  <span className="text-xs text-muted-foreground">
                    owner@example.com
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUseExample}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Use Example</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/personal/data">
                  <User className="mr-2 h-4 w-4" />
                  <span>Create Your Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen">
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
        <AiCopilot />
      </SidebarInset>
    </SidebarProvider>
  );
}
