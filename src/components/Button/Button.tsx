import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `
    inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium
    whitespace-nowrap ring-offset-background saturate-(--glass-saturation)
    backdrop-blur-(--glass-blur) transition-colors
    focus-visible:ring-[3px] focus-visible:ring-ring/50
    focus-visible:outline-none
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        default: `
          border border-primary/30 bg-primary/90 text-primary-foreground
          hover:bg-primary/75
        `,
        destructive: `
          border border-destructive/30 bg-destructive/90
          text-destructive-foreground
          hover:bg-destructive/75
        `,
        outline: `
          border-2 border-input bg-background/20 text-foreground
          hover:bg-accent/80 hover:text-accent-foreground
        `,
        secondary: `
          border border-secondary/30 bg-secondary/90 text-secondary-foreground
          hover:bg-secondary/75
        `,
        ghost: `
          text-foreground
          hover:bg-accent/60 hover:text-accent-foreground
        `,
        link: `
          text-primary underline-offset-4
          hover:underline
        `,
      },
      size: {
        default: `
          h-9 px-4 py-2
          has-[>svg]:px-3
        `,
        sm: `
          h-8 gap-1.5 rounded-md px-3
          has-[>svg]:px-2.5
        `,
        lg: `
          h-10 rounded-md px-6
          has-[>svg]:px-4
        `,
        icon: 'size-9',
        'icon-xs': 'size-6 rounded-[calc(var(--radius)-3px)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
