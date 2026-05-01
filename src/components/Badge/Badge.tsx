import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  `
    inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden
    rounded-full border px-2 py-0 text-[0.625rem] font-semibold tracking-widest
    whitespace-nowrap transition-[color,background-color,border-color,box-shadow]
    focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    [&>svg]:pointer-events-none [&>svg]:size-3!
  `,
  {
    variants: {
      variant: {
        default: `
          shadow-frost-sm border-primary/25 bg-primary/90
          text-primary-foreground
          [a&]:hover:bg-primary
        `,

        secondary: `
          border border-(--glass-edge) bg-secondary/45 text-secondary-foreground
          shadow-none
          [a&]:hover:bg-secondary/55
        `,

        destructive: `
          border border-destructive/30 bg-destructive/90 text-white
          focus-visible:ring-destructive/20
          dark:bg-destructive/70
          dark:focus-visible:ring-destructive/40
          [a&]:hover:bg-destructive/90
        `,

        outline: `
          border border-(--glass-edge) bg-transparent text-foreground
          [a&]:hover:bg-accent/20 [a&]:hover:text-accent-foreground
        `,

        ghost: `
          border border-transparent bg-transparent text-foreground
          [a&]:hover:bg-accent/20 [a&]:hover:text-accent-foreground
        `,

        link: `
          text-primary underline-offset-4
          [a&]:hover:underline
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
