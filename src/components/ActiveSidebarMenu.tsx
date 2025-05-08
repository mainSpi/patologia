'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react'; // Import React for React.ReactNode
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { ComponentPropsWithoutRef } from 'react';
import type { TooltipContent } from '@/components/ui/tooltip';


interface ActiveSidebarMenuButtonProps {
  href: string;
  icon: React.ReactNode; // Changed from LucideIcon to React.ReactNode
  label: string;
  tooltip?: string | Omit<ComponentPropsWithoutRef<typeof TooltipContent>, 'children'> & { children?: React.ReactNode };
}

export const ActiveSidebarMenuButton: React.FC<ActiveSidebarMenuButtonProps> = ({ href, icon, label, tooltip }) => { // Changed icon: Icon to icon
  const pathname = usePathname();
  // Make home active for view pages too, and other main sections for their sub-paths if any in future
  const isActive = href === "/" ? (pathname === "/" || pathname.startsWith("/view/")) : pathname.startsWith(href);

  let tooltipProps: string | React.ComponentProps<typeof TooltipContent> | undefined;
  if (typeof tooltip === 'string') {
    tooltipProps = tooltip;
  } else if (tooltip) {
    tooltipProps = { children: tooltip.children || label, side: tooltip.side || "right", align: tooltip.align || "center", ...tooltip };
  } else {
    tooltipProps = { children: label, side: "right", align: "center" };
  }
  

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={tooltipProps} isActive={isActive}>
        {/* Changed from <Icon className="h-4 w-4 shrink-0" /> to {icon} */}
        <Link href={href}>{icon}<span>{label}</span></Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
