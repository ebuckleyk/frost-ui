import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: 'default' | 'sm';
};

function NativeSelect({ className, children, size = 'default', ...props }: NativeSelectProps) {
  return (
    <span className="relative inline-flex w-fit items-center">
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          `
            input-glass flex w-full min-w-0 appearance-none rounded-md
            border-input bg-transparent px-3 py-1 pr-8 text-base
            shadow-xs transition-[color,box-shadow] outline-none
            disabled:pointer-events-none disabled:cursor-not-allowed
            disabled:opacity-50
            data-[size=default]:h-9 data-[size=sm]:h-8
            md:text-sm
          `,
          `
            focus-visible:border-ring focus-visible:ring-[3px]
            focus-visible:ring-ring/50
          `,
          `
            aria-invalid:border-destructive aria-invalid:ring-destructive/20
            dark:aria-invalid:ring-destructive/40
          `,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="
          pointer-events-none absolute right-2.5 size-4 shrink-0
          text-muted-foreground opacity-70
        "
      />
    </span>
  );
}

function NativeSelectOption({ className, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return (
    <option
      data-slot="native-select-option"
      className={cn('bg-popover text-popover-foreground', className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({ className, ...props }: React.OptgroupHTMLAttributes<HTMLOptGroupElement>) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn('bg-popover text-popover-foreground', className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup };
