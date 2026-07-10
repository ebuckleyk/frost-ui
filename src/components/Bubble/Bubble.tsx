import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

function BubbleGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="bubble-group" className={cn('flex min-w-0 flex-col gap-2', className)} {...props} />;
}

const bubbleVariants = cva(
  `
    group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1
    group-data-[align=end]/message:self-end data-[align=end]:self-end
    data-[variant=ghost]:max-w-full
  `,
  {
    variants: {
      variant: {
        default: `
          *:data-[slot=bubble-content]:border-primary/30
          *:data-[slot=bubble-content]:bg-primary/78
          *:data-[slot=bubble-content]:text-primary-foreground
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/88
        `,
        secondary: `
          *:data-[slot=bubble-content]:bg-secondary/58
          *:data-[slot=bubble-content]:text-secondary-foreground
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-secondary/72
        `,
        muted: `
          *:data-[slot=bubble-content]:bg-muted/58
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/72
        `,
        tinted: `
          *:data-[slot=bubble-content]:border-primary/20
          *:data-[slot=bubble-content]:bg-primary/14 *:data-[slot=bubble-content]:text-foreground
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/22
        `,
        outline: `
          *:data-[slot=bubble-content]:bg-background/42
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/58
        `,
        ghost: `
          border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:border-transparent
          *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0
          *:data-[slot=bubble-content]:shadow-none *:data-[slot=bubble-content]:saturate-100
          *:data-[slot=bubble-content]:backdrop-blur-none
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50
        `,
        destructive: `
          *:data-[slot=bubble-content]:border-destructive/25
          *:data-[slot=bubble-content]:bg-destructive/14
          *:data-[slot=bubble-content]:text-destructive
          [&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/22
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Bubble({
  variant = 'default',
  align = 'start',
  className,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof bubbleVariants> & { align?: 'start' | 'end' }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  );
}

function BubbleContent({ asChild = false, className, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        `
          w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-(--glass-edge)
          bg-card/68 px-3 py-2 text-sm/relaxed wrap-break-word
          shadow-[inset_0_1px_0_var(--glass-highlight-soft),var(--glass-shadow-soft)] saturate-(--glass-saturation)
          backdrop-blur-(--glass-blur)
          group-data-[align=end]/bubble:self-end [button]:text-left
          [button,a]:transition-colors [button,a]:outline-none
          [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3
          [button,a]:focus-visible:ring-ring/50
        `,
        className,
      )}
      {...props}
    />
  );
}

const bubbleReactionsVariants = cva(
  `
    absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full
    border border-(--glass-edge) bg-card/72 px-1.5 py-0.5 text-sm
    shadow-[inset_0_1px_0_var(--glass-highlight-soft),var(--glass-shadow-soft)] ring-3
    ring-background/75
    saturate-(--glass-saturation) backdrop-blur-(--glass-blur) has-[button]:p-0
  `,
  {
    variants: {
      side: { top: 'top-0 -translate-y-3/4', bottom: 'bottom-0 translate-y-3/4' },
      align: { start: 'left-3', end: 'right-3' },
    },
    defaultVariants: { side: 'bottom', align: 'end' },
  },
);

function BubbleReactions({
  side = 'bottom',
  align = 'end',
  className,
  ...props
}: React.ComponentProps<'div'> & { align?: 'start' | 'end'; side?: 'top' | 'bottom' }) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  );
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions, bubbleReactionsVariants, bubbleVariants };
