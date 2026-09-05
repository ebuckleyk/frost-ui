import * as React from 'react';
import DOMPurify from 'dompurify';
import escapeHtml from 'escape-html';
import { Editor, Range, Element as SlateElement, Node as SlateNode, Text, Transforms } from 'slate';
import type { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from 'slate-react';

import type {
  RichTextAlignment,
  RichTextBlock,
  RichTextBlockType,
  RichTextEditorInstance,
  RichTextElement,
  RichTextHashtag,
  RichTextHashtagChange,
  RichTextHashtagSummary,
  RichTextInline,
  RichTextLink,
  RichTextListItem,
  RichTextMark,
  RichTextText,
  RichTextValue,
} from './RichText.types';

export const EMPTY_RICH_TEXT_VALUE: RichTextValue = [{ type: 'paragraph', children: [{ text: '' }] }];

const LIST_TYPES = new Set<RichTextBlockType>(['numbered-list', 'bulleted-list']);
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const BLOCK_TAGS = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'DIV', 'FOOTER', 'HEADER', 'MAIN', 'NAV', 'SECTION']);
const HASHTAG_PATTERN = /^[\p{L}\p{N}_-]+$/u;

export function cloneRichTextValue(value: RichTextValue): RichTextValue {
  return JSON.parse(JSON.stringify(value)) as RichTextValue;
}

export function normalizeRichTextUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeRichTextHashtag(value: string): string | null {
  const tag = value.trim().replace(/^#/, '');
  return tag && HASHTAG_PATTERN.test(tag) ? tag : null;
}

function serializeText(node: RichTextText): string {
  let output = escapeHtml(node.text);
  if (node.bold) output = `<strong>${output}</strong>`;
  if (node.italic) output = `<em>${output}</em>`;
  if (node.underline) output = `<u>${output}</u>`;
  if (node.code) output = `<code>${output}</code>`;
  return output;
}

function serializeInline(node: RichTextInline): string {
  if (Text.isText(node)) return serializeText(node);

  if (node.type === 'hashtag') {
    const tag = normalizeRichTextHashtag(node.tag);
    return tag ? `<span data-hashtag="${escapeHtml(tag)}">#${escapeHtml(tag)}</span>` : '';
  }

  const children = node.children.map(serializeText).join('');
  const url = normalizeRichTextUrl(node.url);
  return url ? `<a href="${escapeHtml(url)}">${children}</a>` : children;
}

function alignmentAttribute(element: { align?: RichTextAlignment }): string {
  return element.align ? ` style="text-align: ${element.align}"` : '';
}

function serializeElement(element: RichTextElement): string {
  const children = element.children.map((child) =>
    SlateElement.isElement(child) ? serializeElement(child) : serializeInline(child),
  );
  const content = children.join('');
  switch (element.type) {
    case 'link':
    case 'hashtag':
      return serializeInline(element);
    case 'block-quote':
      return `<blockquote${alignmentAttribute(element)}>${content}</blockquote>`;
    case 'bulleted-list':
      return `<ul${alignmentAttribute(element)}>${content}</ul>`;
    case 'numbered-list':
      return `<ol${alignmentAttribute(element)}>${content}</ol>`;
    case 'list-item':
      return `<li${alignmentAttribute(element)}>${content}</li>`;
    case 'heading-1':
      return `<h1${alignmentAttribute(element)}>${content}</h1>`;
    case 'heading-2':
      return `<h2${alignmentAttribute(element)}>${content}</h2>`;
    case 'heading-3':
      return `<h3${alignmentAttribute(element)}>${content}</h3>`;
    case 'heading-4':
      return `<h4${alignmentAttribute(element)}>${content}</h4>`;
    case 'heading-5':
      return `<h5${alignmentAttribute(element)}>${content}</h5>`;
    case 'heading-6':
      return `<h6${alignmentAttribute(element)}>${content}</h6>`;
    case 'paragraph':
      return `<p${alignmentAttribute(element)}>${content}</p>`;
  }
}

export function serializeRichTextToHtml(value: RichTextValue): string {
  return value.map(serializeElement).join('');
}

function inlinePlainText(nodes: RichTextInline[]): string {
  return nodes
    .map((node) =>
      Text.isText(node) ? node.text : node.type === 'hashtag' ? `#${node.tag}` : inlinePlainText(node.children),
    )
    .join('');
}

function blockPlainText(element: RichTextElement, listIndex?: number): string {
  if (element.type === 'link') return inlinePlainText(element.children);
  if (element.type === 'hashtag') return `#${element.tag}`;
  if (element.type === 'bulleted-list' || element.type === 'numbered-list') {
    return element.children
      .map((item, index) => blockPlainText(item, element.type === 'numbered-list' ? index + 1 : undefined))
      .join('\n');
  }
  const text = inlinePlainText(element.children as RichTextInline[]);
  if (element.type === 'list-item') return `${listIndex ? `${listIndex}.` : '•'} ${text}`;
  return text;
}

export function serializeRichTextToPlainText(value: RichTextValue): string {
  return value.map((element) => blockPlainText(element)).join('\n');
}

export function isRichTextEmpty(value: RichTextValue | null | undefined): boolean {
  return !value?.some(
    (element) =>
      SlateNode.string(element).trim().length > 0 ||
      Array.from(SlateNode.elements(element)).some(([node]) => node.type === 'hashtag'),
  );
}

export function getRichTextHashtags(value: RichTextValue | null | undefined): RichTextHashtagSummary {
  const values: string[] = [];
  value?.forEach((block) => {
    for (const [node] of SlateNode.elements(block)) {
      if (node.type === 'hashtag') values.push(node.tag);
    }
  });
  const uniqueValues = Array.from(new Set(values));
  return { values, uniqueValues, totalCount: values.length, uniqueCount: uniqueValues.length };
}

export function getRichTextHashtagChange(
  previous: RichTextValue | null | undefined,
  current: RichTextValue | null | undefined,
): RichTextHashtagChange {
  const summary = getRichTextHashtags(current);
  const remainingPrevious = [...getRichTextHashtags(previous).values];
  const added = summary.values.filter((tag) => {
    const index = remainingPrevious.indexOf(tag);
    if (index === -1) return true;
    remainingPrevious.splice(index, 1);
    return false;
  });
  return { ...summary, added, removed: remainingPrevious };
}

function getAlignment(element: HTMLElement): RichTextAlignment | undefined {
  const alignment = element.style.textAlign;
  return alignment === 'left' || alignment === 'center' || alignment === 'right' || alignment === 'justify'
    ? alignment
    : undefined;
}

function mergeMarks(text: RichTextText, marks: Partial<Omit<RichTextText, 'text'>>): RichTextText {
  return { ...text, ...marks };
}

function parseInlineNodes(
  nodes: NodeListOf<ChildNode> | ChildNode[],
  marks: Partial<Omit<RichTextText, 'text'>> = {},
): RichTextInline[] {
  const output: RichTextInline[] = [];

  Array.from(nodes).forEach((node) => {
    if (node.nodeType === globalThis.Node.TEXT_NODE) {
      if (node.textContent) output.push({ text: node.textContent, ...marks });
      return;
    }
    if (!(node instanceof HTMLElement)) return;

    const tag = node.tagName;
    if (tag === 'BR') {
      output.push({ text: '\n', ...marks });
      return;
    }

    const nextMarks = { ...marks };
    if (tag === 'STRONG' || tag === 'B') nextMarks.bold = true;
    if (tag === 'EM' || tag === 'I') nextMarks.italic = true;
    if (tag === 'U') nextMarks.underline = true;
    if (tag === 'CODE') nextMarks.code = true;

    const children = parseInlineNodes(node.childNodes, nextMarks);
    if (tag === 'SPAN' && node.hasAttribute('data-hashtag')) {
      const hashtag = normalizeRichTextHashtag(node.getAttribute('data-hashtag') ?? node.textContent ?? '');
      if (hashtag) {
        output.push({ type: 'hashtag', tag: hashtag, children: [{ text: '' }] });
        return;
      }
    }
    if (tag === 'A') {
      const url = normalizeRichTextUrl(node.getAttribute('href') ?? '');
      if (url) {
        output.push({
          type: 'link',
          url,
          children: children.flatMap((child) =>
            Text.isText(child) ? [child] : child.children.map((text) => mergeMarks(text, nextMarks)),
          ),
        });
        return;
      }
    }
    output.push(...children);
  });

  return output.length > 0 ? output : [{ text: '', ...marks }];
}

function parseList(element: HTMLElement, type: 'bulleted-list' | 'numbered-list'): RichTextBlock {
  const items = Array.from(element.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement && child.tagName === 'LI')
    .map<RichTextListItem>((item) => ({
      type: 'list-item',
      align: getAlignment(item),
      children: parseInlineNodes(item.childNodes),
    }));
  return {
    type,
    align: getAlignment(element),
    children: items.length > 0 ? items : [{ type: 'list-item', children: [{ text: '' }] }],
  };
}

function parseBlock(element: HTMLElement): RichTextBlock[] {
  const align = getAlignment(element);
  const children = parseInlineNodes(element.childNodes);

  switch (element.tagName) {
    case 'P':
      return [{ type: 'paragraph', align, children }];
    case 'BLOCKQUOTE':
      return [{ type: 'block-quote', align, children }];
    case 'UL':
      return [parseList(element, 'bulleted-list')];
    case 'OL':
      return [parseList(element, 'numbered-list')];
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
      return [{ type: `heading-${element.tagName.slice(1)}`, align, children } as RichTextBlock];
    default: {
      const nestedBlocks = Array.from(element.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement && isBlockElement(child))
        .flatMap(parseBlock);
      return nestedBlocks.length > 0 ? nestedBlocks : [{ type: 'paragraph', align, children }];
    }
  }
}

function isBlockElement(element: HTMLElement): boolean {
  return /^(P|BLOCKQUOTE|UL|OL|H[1-6])$/.test(element.tagName) || BLOCK_TAGS.has(element.tagName);
}

export function deserializeRichTextFromHtml(html: string): RichTextValue {
  if (typeof DOMParser === 'undefined') return cloneRichTextValue(EMPTY_RICH_TEXT_VALUE);

  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'b',
      'blockquote',
      'br',
      'code',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'i',
      'li',
      'ol',
      'p',
      'span',
      'strong',
      'u',
      'ul',
    ],
    ALLOWED_ATTR: ['data-hashtag', 'href', 'style'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
  const document = new DOMParser().parseFromString(sanitized, 'text/html');
  const value: RichTextValue = [];
  let looseInline: RichTextInline[] = [];

  const flushInline = () => {
    if (looseInline.length === 0) return;
    value.push({ type: 'paragraph', children: looseInline });
    looseInline = [];
  };

  Array.from(document.body.childNodes).forEach((node) => {
    if (node instanceof HTMLElement && isBlockElement(node)) {
      flushInline();
      value.push(...parseBlock(node));
    } else {
      looseInline.push(...parseInlineNodes([node]));
    }
  });
  flushInline();

  return value.length > 0 ? value : cloneRichTextValue(EMPTY_RICH_TEXT_VALUE);
}

export function isMarkActive(editor: RichTextEditorInstance, mark: RichTextMark): boolean {
  return Editor.marks(editor)?.[mark] === true;
}

export function toggleMark(editor: RichTextEditorInstance, mark: RichTextMark): void {
  if (isMarkActive(editor, mark)) Editor.removeMark(editor, mark);
  else Editor.addMark(editor, mark, true);
}

export function isBlockActive(editor: RichTextEditorInstance, format: RichTextBlockType | RichTextAlignment): boolean {
  if (!editor.selection) return false;
  const isAlignment = format === 'left' || format === 'center' || format === 'right' || format === 'justify';
  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, editor.selection),
    match: (node) =>
      !Editor.isEditor(node) &&
      SlateElement.isElement(node) &&
      (isAlignment ? 'align' in node && node.align === format : node.type === format),
  });
  return Boolean(match);
}

export function toggleBlock(editor: RichTextEditorInstance, format: RichTextBlockType | RichTextAlignment): void {
  const active = isBlockActive(editor, format);
  const isAlignment = format === 'left' || format === 'center' || format === 'right' || format === 'justify';
  const isList = !isAlignment && LIST_TYPES.has(format);

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) && SlateElement.isElement(node) && LIST_TYPES.has(node.type as RichTextBlockType),
    split: true,
  });

  if (isAlignment) {
    Transforms.setNodes(editor, { align: active ? undefined : format });
    return;
  }

  Transforms.setNodes<RichTextElement>(editor, {
    type: active ? 'paragraph' : isList ? 'list-item' : format,
  } as Partial<RichTextElement>);

  if (!active && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] } as RichTextElement);
  }
}

export function getActiveLink(editor: RichTextEditorInstance): [RichTextLink, number[]] | undefined {
  if (!editor.selection) return undefined;
  const entry = Editor.above(editor, {
    match: (node) => SlateElement.isElement(node) && node.type === 'link',
  });
  return entry ? ([entry[0] as RichTextLink, entry[1]] as [RichTextLink, number[]]) : undefined;
}

export function upsertLink(editor: RichTextEditorInstance, url: string): void {
  const normalized = normalizeRichTextUrl(url);
  if (!normalized || !editor.selection) return;
  const activeLink = getActiveLink(editor);
  if (activeLink) {
    Transforms.setNodes(editor, { url: normalized }, { at: activeLink[1] });
    return;
  }

  if (Range.isCollapsed(editor.selection)) {
    Transforms.insertNodes(editor, { type: 'link', url: normalized, children: [{ text: normalized }] });
  } else {
    Transforms.wrapNodes(editor, { type: 'link', url: normalized, children: [] }, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}

export function removeLink(editor: RichTextEditorInstance): void {
  Transforms.unwrapNodes(editor, { match: (node) => SlateElement.isElement(node) && node.type === 'link' });
}

export function withLinks(editor: RichTextEditorInstance): RichTextEditorInstance {
  const { isInline, isVoid } = editor;
  editor.isInline = (element) => (element.type === 'link' || element.type === 'hashtag' ? true : isInline(element));
  editor.isVoid = (element) => (element.type === 'hashtag' ? true : isVoid(element));
  return editor;
}

export function insertRichTextHashtag(editor: RichTextEditorInstance, tag: string): boolean {
  const normalized = normalizeRichTextHashtag(tag);
  if (!normalized || !editor.selection) return false;
  const hashtag: RichTextHashtag = { type: 'hashtag', tag: normalized, children: [{ text: '' }] };
  Transforms.insertNodes(editor, [hashtag, { text: ' ' }]);
  return true;
}

export function renderRichTextElement(
  { attributes, children, element }: RenderElementProps,
  onHashtagClick?: (tag: string) => void,
): React.ReactElement {
  switch (element.type) {
    case 'link':
      return (
        <a
          {...attributes}
          href={normalizeRichTextUrl(element.url) ?? undefined}
          className="text-primary underline underline-offset-4"
        >
          {children}
        </a>
      );
    case 'hashtag':
      return (
        <span {...attributes} className="mx-0.5 inline-block">
          <span contentEditable={false}>
            {onHashtagClick ? (
              <button
                type="button"
                className="rounded-sm bg-primary/10 px-1 text-primary hover:bg-primary/20"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onHashtagClick(element.tag)}
              >
                #{element.tag}
              </button>
            ) : (
              <span className="rounded-sm bg-primary/10 px-1 text-primary">#{element.tag}</span>
            )}
          </span>
          {children}
        </span>
      );
    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          style={{ textAlign: element.align }}
          className="border-l-2 border-border pl-3 text-muted-foreground"
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} style={{ textAlign: element.align }} className="list-disc pl-6">
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol {...attributes} style={{ textAlign: element.align }} className="list-decimal pl-6">
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li {...attributes} style={{ textAlign: element.align }}>
          {children}
        </li>
      );
    case 'heading-1':
      return (
        <h1 {...attributes} style={{ textAlign: element.align }} className="text-2xl font-semibold">
          {children}
        </h1>
      );
    case 'heading-2':
      return (
        <h2 {...attributes} style={{ textAlign: element.align }} className="text-xl font-semibold">
          {children}
        </h2>
      );
    case 'heading-3':
      return (
        <h3 {...attributes} style={{ textAlign: element.align }} className="text-lg font-semibold">
          {children}
        </h3>
      );
    case 'heading-4':
      return (
        <h4 {...attributes} style={{ textAlign: element.align }} className="font-semibold">
          {children}
        </h4>
      );
    case 'heading-5':
      return (
        <h5 {...attributes} style={{ textAlign: element.align }} className="font-semibold">
          {children}
        </h5>
      );
    case 'heading-6':
      return (
        <h6 {...attributes} style={{ textAlign: element.align }} className="font-semibold">
          {children}
        </h6>
      );
    case 'paragraph':
      return (
        <p {...attributes} style={{ textAlign: element.align }}>
          {children}
        </p>
      );
  }
}

export function renderRichTextLeaf({ attributes, children, leaf }: RenderLeafProps): React.ReactElement {
  let output = children;
  if (leaf.bold) output = <strong>{output}</strong>;
  if (leaf.italic) output = <em>{output}</em>;
  if (leaf.underline) output = <u>{output}</u>;
  if (leaf.code) output = <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.875em]">{output}</code>;
  return <span {...attributes}>{output}</span>;
}

export function renderRichTextPlaceholder({ attributes, children }: RenderPlaceholderProps): React.ReactElement {
  return <span {...attributes}>{children}</span>;
}
