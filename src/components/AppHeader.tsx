'use client';

import Link from 'next/link';
import { Microscope } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const AppHeader = () => {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-30 border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Microscope className="h-6 w-6" />
            <span className="hidden sm:inline font-semibold whitespace-nowrap">Card Explorer</span>
          </Link>
        </div>
        {/* Future user profile / actions can go here */}
      </div>
    </header>
  );
};

export default AppHeader;
