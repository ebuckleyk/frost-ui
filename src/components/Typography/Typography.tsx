import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const NODES = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'div',
  'a',
  'label',
  'p',
  'blockquote',
  'table',
  'thead',
  'tr',
  'th',
  'tbody',
  'td',
  'ul',
  'li',
  'code',
  'small',
] as const;

const proseVariants = cva('', {
  variants: {
    variant: {
      h1: `
        scroll-m-20 text-4xl font-extrabold tracking-tight
        lg:text-5xl
      `,
      h2: `
        scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight
        first:mt-0
      `,
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      span: '',
      div: '',
      a: '',
      label: '',
      p: `
        leading-6
        not-first:mt-4
      `,
      blockquote: 'mt-4 border-l-2 pl-4 italic',
      table: 'w-full',
      thead: '',
      tr: `
        m-0 border-t p-0
        even:bg-muted
      `,
      th: `
        border px-3 py-2 text-left font-bold
        [[align=center]]:text-center
        [[align=right]]:text-right
      `,
      tbody: '',
      td: `
        border px-3 py-2 text-left
        [[align=center]]:text-center
        [[align=right]]:text-right
      `,
      ul: `
        my-4 ml-5 list-disc
        [&>li]:mt-1.5
      `,
      li: '',
      code: `
        relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm
        font-semibold
      `,
      lead: 'text-lg text-muted-foreground',
      large: 'text-base font-semibold',
      small: 'text-sm leading-none font-medium',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

/** Spacing-neutral application roles; color and layout belong to separate concerns. */
const typographyVariants = cva('', {
  variants: {
    variant: {
      heading1: 'text-[1.75rem]/tight font-semibold tracking-tight',
      heading2: 'text-2xl/tight font-semibold tracking-tight',
      heading3: 'text-xl/snug font-semibold tracking-tight',
      heading4: 'text-lg/snug font-semibold tracking-tight',
      heading5: 'text-base/snug font-semibold tracking-tight',
      heading6: 'text-sm/snug font-semibold tracking-tight',
      pageTitle: 'text-2xl/tight font-semibold tracking-tight sm:text-3xl/tight',
      sectionTitle: 'text-xl/snug font-semibold tracking-tight',
      cardTitle: 'text-base/snug font-semibold tracking-tight',
      body: 'text-base/6 font-normal tracking-normal',
      supporting: 'text-sm/5 font-normal tracking-normal',
      caption: 'text-xs/4 font-normal tracking-normal',
      label: 'text-sm/5 font-medium tracking-normal',
      control: 'text-sm/5 font-medium tracking-normal',
      badge: 'text-xs/4 font-semibold tracking-normal',
      metric: 'text-2xl/tight font-semibold tracking-tight tabular-nums',
      eyebrow: 'text-xs/4 font-semibold tracking-wide uppercase',
    },
    tone: {
      default: '',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: { variant: 'body', tone: 'default' },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>['variant']>;
type VisualProps = {
  /** Application role, or an explicit legacy document style. Never changes the element. */
  variant?: TypographyVariant | NonNullable<VariantProps<typeof proseVariants>['variant']>;
  tone?: VariantProps<typeof typographyVariants>['tone'];
  asChild?: boolean;
};
export type TypographyProps<E extends React.ElementType = 'p'> = VisualProps & {
  as?: E;
} & Omit<React.ComponentPropsWithRef<E>, keyof VisualProps | 'as'>;
type TypographyComponent<N extends React.ElementType> = <E extends React.ElementType = N>(
  props: TypographyProps<E>,
) => React.ReactElement | null;
type Typographies = { [N in (typeof NODES)[number]]: TypographyComponent<N> };

const applicationDefaults: Partial<Record<(typeof NODES)[number], TypographyVariant>> = {
  h1: 'heading1',
  h2: 'heading2',
  h3: 'heading3',
  h4: 'heading4',
  h5: 'heading5',
  h6: 'heading6',
  small: 'caption',
  label: 'label',
};
const applicationRoles = new Set<string>([
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'pageTitle',
  'sectionTitle',
  'cardTitle',
  'body',
  'supporting',
  'caption',
  'label',
  'control',
  'badge',
  'metric',
  'eyebrow',
]);

function createTypography(prose: boolean): Typographies {
  return Object.fromEntries(
    NODES.map((node) => {
      function Node({ as, asChild = false, className, variant, tone, ...props }: TypographyProps) {
        const selected = variant ?? (prose ? node : (applicationDefaults[node] ?? 'body'));
        const classes =
          applicationRoles.has(selected) && (!prose || variant !== undefined)
            ? typographyVariants({ variant: selected as TypographyVariant, tone })
            : cn(
                proseVariants({ variant: selected as VariantProps<typeof proseVariants>['variant'] }),
                typographyVariants({ variant: null, tone }),
              );
        return React.createElement(asChild ? Slot : (as ?? node), {
          ...props,
          className: cn(classes, className),
        });
      }
      Node.displayName = `${prose ? 'Prose' : 'Typography'}.${node}`;
      return [node, Node];
    }),
  ) as unknown as Typographies;
}

const Typography = createTypography(false);
/** Explicit document styles, including article spacing, lists, quotes and code. */
const Prose = createTypography(true);
const Text = Typography;

export { Typography, Text, Prose, typographyVariants, proseVariants };
