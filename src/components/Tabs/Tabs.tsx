'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type TabsVariant = 'default' | 'line';
const TabsAnimationContext = React.createContext(false);

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  /** Animates the active panel as the selected tab changes. */
  animated?: boolean;
};

function Tabs({ animated = false, className, ...props }: TabsProps) {
  return (
    <TabsAnimationContext.Provider value={animated}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-animated={animated || undefined}
        className={cn(
          `
            group/tabs flex flex-col gap-2
          `,
          className,
        )}
        {...props}
      />
    </TabsAnimationContext.Provider>
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

function TabsList({ className, children, ref, variant = 'default', ...props }: TabsListProps) {
  const animated = React.useContext(TabsAnimationContext);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>();

  const composedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;

      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!animated || !list) return;

    const updateIndicator = () => {
      const activeTrigger = list.querySelector<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]');
      if (!activeTrigger) return;

      setIndicatorStyle({
        transform: `translateX(${activeTrigger.offsetLeft}px)`,
        width: activeTrigger.offsetWidth,
      });
    };

    updateIndicator();

    const mutationObserver = new MutationObserver(updateIndicator);
    mutationObserver.observe(list, { attributeFilter: ['data-state'], subtree: true });

    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateIndicator);
    resizeObserver?.observe(list);
    list
      .querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
      .forEach((trigger) => resizeObserver?.observe(trigger));
    window.addEventListener('resize', updateIndicator);

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [animated, children]);

  return (
    <TabsPrimitive.List
      ref={composedRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn('relative', tabsListVariants({ variant }), className)}
      {...props}
    >
      {animated ? (
        <span
          aria-hidden="true"
          data-slot="tabs-indicator"
          style={indicatorStyle}
          className={cn(
            `
              pointer-events-none absolute left-0 z-0 opacity-0
              transition-[transform,width,opacity] duration-200 ease-out
              group-data-[animated=true]/tabs:opacity-100
              motion-reduce:transition-none
            `,
            variant === 'default' && 'inset-y-[3px] rounded-md bg-background/30 shadow-sm',
            variant === 'line' && 'bottom-0 h-0.5 bg-primary',
          )}
        />
      ) : null}
      {children}
    </TabsPrimitive.List>
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
          group-data-[animated=true]/tabs:z-10
          group-data-[variant=line]/tabs-list:h-9
          group-data-[variant=line]/tabs-list:rounded-none
          group-data-[variant=line]/tabs-list:border-b-2
          group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:px-4
          hover:bg-accent/20
          hover:text-foreground
          group-data-[variant=line]/tabs-list:hover:bg-transparent focus-visible:border-ring
          focus-visible:ring-[3px] focus-visible:ring-ring/50
          focus-visible:outline-1 focus-visible:outline-ring
          disabled:pointer-events-none
          disabled:opacity-50
          data-[state=active]:bg-background/30
          data-[state=active]:text-foreground
          data-[state=active]:shadow-sm
          group-data-[animated=true]/tabs:data-[state=active]:bg-transparent
          group-data-[animated=true]/tabs:data-[state=active]:shadow-none
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
          group-data-[animated=true]/tabs:data-[state=active]:animate-in
          group-data-[animated=true]/tabs:data-[state=active]:duration-200
          group-data-[animated=true]/tabs:data-[state=active]:fade-in-0
          group-data-[animated=true]/tabs:data-[state=active]:slide-in-from-bottom-1
          group-data-[animated=true]/tabs:data-[state=active]:motion-reduce:animate-none
  `,
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsVariant };
