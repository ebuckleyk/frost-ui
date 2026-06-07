import * as React from 'react';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        `
    animate-pulse rounded-md bg-accent/55 shadow-[inset_0_1px_0_var(--glass-highlight-soft)]
  `,
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
