'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type TabsVariant = 'default' | 'line';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        `
    flex flex-col gap-2
  `,
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  `
    group/tabs-list inline-flex h-9 w-fit items-center justify-center
    text-muted-foreground
  `,
  {
    variants: {
      variant: {
        default: 'glass-control-muted rounded-lg p-[3px]',
        line: 'border-b border-border bg-transparent p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>;

function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `
          inline-flex h-[calc(100%-1px)] flex-1 items-center
          justify-center gap-1.5 rounded-md border border-transparent px-2 py-1
          text-sm font-medium whitespace-nowrap
          text-muted-foreground
          transition-[color,background-color,border-color,box-shadow]
          group-data-[variant=line]/tabs-list:h-9
          group-data-[variant=line]/tabs-list:rounded-none
          group-data-[variant=line]/tabs-list:border-b-2
          group-data-[variant=line]/tabs-list:bg-transparent
          group-data-[variant=line]/tabs-list:px-4 hover:bg-accent/20
          hover:text-foreground
          group-data-[variant=line]/tabs-list:hover:bg-transparent
          focus-visible:border-ring focus-visible:ring-[3px]
          focus-visible:ring-ring/50 focus-visible:outline-1
          focus-visible:outline-ring disabled:pointer-events-none
          disabled:opacity-50
          data-[state=active]:bg-background/30
          data-[state=active]:text-foreground
          data-[state=active]:shadow-sm
          group-data-[variant=line]/tabs-list:data-[state=active]:border-b-primary
          group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent
          group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none
          [&_svg]:pointer-events-none [&_svg]:shrink-0
          [&_svg:not([class*='size-'])]:size-4
        `,
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        `
    flex-1 outline-none
  `,
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsVariant };
