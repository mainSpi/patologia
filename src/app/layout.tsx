import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppHeader from '@/components/AppHeader';
import Link from 'next/link';
import { Home, LayoutDashboard, BarChart3, Settings, Microscope, ShieldCheck } from 'lucide-react';
import { ActiveSidebarMenuButton } from '@/components/ActiveSidebarMenu';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Card Explorer',
  description: 'Explore and view SVS images with tagged cards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={false}>
          <Sidebar side="left" collapsible="icon">
            <SidebarHeader className="p-2 flex items-center justify-center group-data-[collapsible=icon]:justify-center border-b">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary hover:opacity-80 transition-opacity">
                <Microscope className="h-7 w-7 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden whitespace-nowrap">Card Explorer</span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                <ActiveSidebarMenuButton href="/" icon={<Home className="h-4 w-4 shrink-0" />} label="Home" tooltip="Home" />
                <ActiveSidebarMenuButton href="/dashboard" icon={<LayoutDashboard className="h-4 w-4 shrink-0" />} label="Dashboard" tooltip="Dashboard" />
                <ActiveSidebarMenuButton href="/analytics" icon={<BarChart3 className="h-4 w-4 shrink-0" />} label="Analytics" tooltip="Analytics" />
                <ActiveSidebarMenuButton href="/admin" icon={<ShieldCheck className="h-4 w-4 shrink-0" />} label="Admin" tooltip="Admin" />
                <ActiveSidebarMenuButton href="/settings" icon={<Settings className="h-4 w-4 shrink-0" />} label="Settings" tooltip="Settings" />
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <SidebarInset> {/* This is a <main> tag */}
            <AppHeader />
            <div className="flex-grow"> {/* This div ensures content pushes footer down */}
              {children}
            </div>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background">
              <p>&copy; {new Date().getFullYear()} Card Explorer. All rights reserved.</p>
            </footer>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
