import * as React from 'react';

import { cn } from '@/lib/utils';

import type { RichTextElement, RichTextInline, RichTextText, RichTextValue } from './RichText.types';
import { normalizeRichTextUrl } from './RichText.utils';

function TextNode({ node }: { node: RichTextText }): React.ReactElement {
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.code) content = <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.875em]">{content}</code>;
  return <>{content}</>;
}

function InlineNode({ node }: { node: RichTextInline }): React.ReactElement {
  if ('text' in node) return <TextNode node={node} />;
  const url = normalizeRichTextUrl(node.url);
  const content = node.children.map((child, index) => <TextNode key={index} node={child} />);
  return url ? (
    <a href={url} className="text-primary underline underline-offset-4">
      {content}
    </a>
  ) : (
    <>{content}</>
  );
}

function ElementNode({ element }: { element: RichTextElement }): React.ReactElement {
  if (element.type === 'link') return <InlineNode node={element} />;
  const style = { textAlign: element.align };
  const children = element.children.map((child, index) =>
    'text' in child || child.type === 'link' ? (
      <InlineNode key={index} node={child} />
    ) : (
      <ElementNode key={index} element={child} />
    ),
  );

  switch (element.type) {
    case 'paragraph':
      return <p style={style}>{children}</p>;
    case 'block-quote':
      return (
        <blockquote style={style} className="border-l-2 border-border pl-3 text-muted-foreground">
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} className="list-disc pl-6">
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol style={style} className="list-decimal pl-6">
          {children}
        </ol>
      );
    case 'list-item':
      return <li style={style}>{children}</li>;
    case 'heading-1':
      return (
        <h1 style={style} className="text-2xl font-semibold">
          {children}
        </h1>
      );
    case 'heading-2':
      return (
        <h2 style={style} className="text-xl font-semibold">
          {children}
        </h2>
      );
    case 'heading-3':
      return (
        <h3 style={style} className="text-lg font-semibold">
          {children}
        </h3>
      );
    case 'heading-4':
      return (
        <h4 style={style} className="font-semibold">
          {children}
        </h4>
      );
    case 'heading-5':
      return (
        <h5 style={style} className="font-semibold">
          {children}
        </h5>
      );
    case 'heading-6':
      return (
        <h6 style={style} className="font-semibold">
          {children}
        </h6>
      );
  }
}

export type RichTextRendererProps = React.ComponentProps<'div'> & { value: RichTextValue };

export function RichTextRenderer({ value, className, ...props }: RichTextRendererProps): React.ReactElement {
  return (
    <div data-slot="rich-text-renderer" className={cn('space-y-2 text-sm text-foreground', className)} {...props}>
      {value.map((element, index) => (
        <ElementNode key={index} element={element} />
      ))}
    </div>
  );
}
