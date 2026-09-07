import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  `
    glass-card relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5
    rounded-lg px-4 py-3 text-sm
    has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3
    [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current
  `,
  {
    variants: {
      variant: {
        default: 'text-card-foreground',
        destructive: `
          border-destructive/30! bg-destructive/10! text-destructive
          *:data-[slot=alert-description]:text-destructive/90
          [&>svg]:text-current
        `,
        warning: `
          border-warning/30! bg-warning/10! text-warning
          *:data-[slot=alert-description]:text-warning/90
          [&>svg]:text-current
        `,
        info: `
          border-info/30! bg-info/10! text-info
          *:data-[slot=alert-description]:text-info/90
          [&>svg]:text-current
        `,
      },
      layout: {
        default: '',
        banner: `
          min-h-16 py-4 pr-12
          *:data-[slot=alert-action]:mt-2
          sm:grid-cols-[calc(var(--spacing)*4)_minmax(0,1fr)_auto]
          sm:gap-x-3
          sm:*:data-[slot=alert-action]:col-start-3
          sm:*:data-[slot=alert-action]:row-span-2
          sm:*:data-[slot=alert-action]:row-start-1
          sm:*:data-[slot=alert-action]:mt-0
        `,
        'banner-stacked': `
          min-h-16 py-4 pr-12
          *:data-[slot=alert-action]:mt-2
        `,
      },
    },
    defaultVariants: {
      variant: 'default',
      layout: 'default',
    },
  },
);

function Alert({
  className,
  variant,
  layout,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div data-slot="alert" role="alert" className={cn(alertVariants({ variant, layout }), className)} {...props} />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        `
        col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight
      `,
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        `
          col-start-2 grid justify-items-start gap-1 text-sm
          text-muted-foreground
          [&_p]:leading-relaxed
        `,
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn('col-start-2 flex flex-wrap items-center gap-2 self-center', className)}
      {...props}
    />
  );
}

function AlertClose({ className, children, type = 'button', ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      data-slot="alert-close"
      type={type}
      className={cn(
        `
          absolute top-2.5 right-2.5 inline-flex size-8 items-center justify-center
          rounded-md text-current opacity-70 transition-[color,background-color,opacity]
          hover:bg-current/10 hover:opacity-100
          focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none
          disabled:pointer-events-none disabled:opacity-50
          [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
        `,
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <XIcon />
          <span className="sr-only">Dismiss alert</span>
        </>
      )}
    </button>
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertClose };
