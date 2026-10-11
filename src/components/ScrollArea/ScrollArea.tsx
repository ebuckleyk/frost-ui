'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

export type ScrollAreaProps = React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportProps?: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>;
  renderViewport?: (viewport: React.ReactElement) => React.ReactNode;
  scrollbarClassName?: string;
  scrollbarThumbClassName?: string;
};

// Select's asChild viewport supplies an overflow shorthand. Normalize it before
// ScrollArea adds its axis styles, so React never mixes shorthand and longhands.
function ScrollAreaViewport({ style, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>) {
  if (!style || !('overflow' in style)) return <ScrollAreaPrimitive.Viewport style={style} {...props} />;
  const { overflow, ...axisStyle } = style;
  const axes = overflow?.split(/\s+/);
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      style={{
        ...(axes
          ? {
              overflowX: axes[0] as React.CSSProperties['overflowX'],
              overflowY: (axes[1] ?? axes[0]) as React.CSSProperties['overflowY'],
            }
          : {}),
        ...axisStyle,
      }}
    />
  );
}

function ScrollArea({
  className,
  children,
  viewportProps,
  renderViewport,
  scrollbarClassName,
  scrollbarThumbClassName,
  ...props
}: ScrollAreaProps) {
  const viewport = (
    <ScrollAreaViewport
      {...viewportProps}
      data-slot="scroll-area-viewport"
      className={cn(
        `size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1`,
        viewportProps?.className,
      )}
    >
      {children}
    </ScrollAreaViewport>
  );
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn('relative', className)} {...props}>
      {renderViewport ? renderViewport(viewport) : viewport}
      <ScrollBar className={scrollbarClassName} thumbClassName={scrollbarThumbClassName} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  thumbClassName,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & { thumbClassName?: string }) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          `
          h-full w-2.5 border-l border-l-transparent
        `,
        orientation === 'horizontal' &&
          `
          h-2.5 flex-col border-t border-t-transparent
        `,
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn('relative flex-1 rounded-full bg-border', thumbClassName)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
