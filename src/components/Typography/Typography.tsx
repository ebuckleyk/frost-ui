import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const NODES = [
  'h1',
  'h2',
  'h3',
  'h4',
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

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      table: 'w-full',
      thead: '',
      tr: 'm-0 border-t p-0 even:bg-muted',
      th: 'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
      tbody: '',
      td: 'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
      ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
      li: '',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type Typographies = { [E in (typeof NODES)[number]]: PrimitiveForwardRefComponent<E> };
type TypographyPropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> &
  VariantProps<typeof typographyVariants>;

interface PrimitiveForwardRefComponent<E extends React.ElementType>
  extends React.ForwardRefExoticComponent<TypographyPropsWithRef<E>> {}

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {}

const getEl = (v: string | undefined | null): React.ElementType | undefined => {
  if (!v) return;
  else if (v === 'lead' || v === 'muted') return 'p';
  else if (v === 'large') return 'div';
  else return;
};

const Typography = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef((props: TypographyPropsWithRef<typeof node>, forwardedRef: unknown) => {
    const { className, variant = node, ...typographyProps } = props;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = getEl(variant) ? getEl(variant) : node;

    return <Comp className={cn(typographyVariants({ variant, className }))} {...typographyProps} ref={forwardedRef} />;
  });

  Node.displayName = `Typography.${node}`;

  return { ...primitive, [node]: Node };
}, {} as Typographies);

const Text = Typography;

export { Typography, Text };
