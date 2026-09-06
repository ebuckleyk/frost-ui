'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  `
    inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium
    whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none
    focus-visible:border-ring focus-visible:ring-[3px]
    focus-visible:ring-ring/50
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    [&_svg]:pointer-events-none [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        default: `
          border border-transparent bg-transparent shadow-none
          hover:bg-accent/20 hover:text-accent-foreground active:bg-accent/30
          aria-pressed:border-primary/50 aria-pressed:bg-primary/20 aria-pressed:text-primary
          aria-pressed:hover:bg-primary/20 aria-pressed:hover:text-primary aria-pressed:active:bg-primary/25
          data-[state=on]:border-primary/50 data-[state=on]:bg-primary/20 data-[state=on]:text-primary
          data-[state=on]:hover:bg-primary/20 data-[state=on]:hover:text-primary data-[state=on]:active:bg-primary/25
        `,
        outline: `
          glass-control border border-(--glass-edge) bg-transparent shadow-none
          hover:bg-accent/20 hover:text-accent-foreground active:bg-accent/30
          aria-pressed:border-primary/65 aria-pressed:bg-primary/20 aria-pressed:text-primary
          aria-pressed:hover:bg-primary/20 aria-pressed:hover:text-primary aria-pressed:active:bg-primary/25
          data-[state=on]:border-primary/65 data-[state=on]:bg-primary/20 data-[state=on]:text-primary
          data-[state=on]:hover:bg-primary/20 data-[state=on]:hover:text-primary data-[state=on]:active:bg-primary/25
        `,
      },
      size: {
        default: 'h-9 min-w-9 px-2',
        sm: 'h-8 min-w-8 px-1.5',
        lg: 'h-10 min-w-10 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant ?? 'default'}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
