import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

export type RichTextAlignment = 'left' | 'center' | 'right' | 'justify';

export type RichTextText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
  code?: true;
};

export type RichTextLink = {
  type: 'link';
  url: string;
  children: RichTextText[];
};

export type RichTextHashtag = {
  type: 'hashtag';
  tag: string;
  children: [{ text: '' }];
};

export type RichTextToken = {
  type: 'token';
  kind: string;
  value: string;
  data?: Record<string, string>;
  children: [{ text: '' }];
};

export type RichTextTokenSuggestion = {
  value: string;
  label: string;
  description?: string;
  group?: string;
};

export type RichTextTokenOptions = {
  /** Unique kind. `hashtag` is reserved for the built-in preset. */
  kind: string;
  /** One character that opens suggestions after whitespace or at the start of a block. */
  trigger: string;
  suggestions?: readonly RichTextTokenSuggestion[];
  /** Notify the app to load results and replace suggestions. */
  onSearch?: (query: string) => void;
  /** Defaults to false. */
  allowFreeform?: boolean;
  /** The visible and accessible chip label, also used by default for serialization. */
  renderChip?: (node: RichTextToken) => string;
  onTokenClick?: (node: RichTextToken, anchorEl: HTMLElement) => void;
  getPlainText?: (node: RichTextToken) => string;
  /** HTML inside the round-trip token wrapper. Sanitized before serialization. */
  getHtml?: (node: RichTextToken) => string;
};

export type RichTextEditorHandle = {
  /** Insert at the current/last selection, or the document end if there is none. */
  insertToken: (token: Pick<RichTextToken, 'kind' | 'value' | 'data'>) => boolean;
  /** Replace metadata on the exact node received by onTokenClick. Returns false for stale/deleted nodes. */
  updateToken: (node: RichTextToken, data: Record<string, string>) => boolean;
};

export type RichTextInline = RichTextText | RichTextLink | RichTextHashtag | RichTextToken;

type RichTextTextBlock<Type extends string> = {
  type: Type;
  align?: RichTextAlignment;
  children: RichTextInline[];
};

export type RichTextParagraph = RichTextTextBlock<'paragraph'>;
export type RichTextHeading = RichTextTextBlock<
  'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6'
>;
export type RichTextBlockQuote = RichTextTextBlock<'block-quote'>;
export type RichTextListItem = RichTextTextBlock<'list-item'>;

export type RichTextList = {
  type: 'bulleted-list' | 'numbered-list';
  align?: RichTextAlignment;
  children: RichTextListItem[];
};

export type RichTextElement =
  | RichTextParagraph
  | RichTextHeading
  | RichTextBlockQuote
  | RichTextListItem
  | RichTextList
  | RichTextLink
  | RichTextHashtag
  | RichTextToken;

export type RichTextBlock = Exclude<RichTextElement, RichTextLink | RichTextHashtag | RichTextToken>;

/** A serializable Frost rich-text document. */
export type RichTextValue = RichTextBlock[];

export type RichTextMark = 'bold' | 'italic' | 'underline' | 'code';
export type RichTextBlockType =
  | 'paragraph'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'block-quote'
  | 'bulleted-list'
  | 'numbered-list';

export type RichTextToolbarCapability =
  | RichTextMark
  | Exclude<RichTextBlockType, 'paragraph'>
  | `align-${RichTextAlignment}`
  | 'link'
  | 'emoji';
export type RichTextToolbarPreset = 'basic' | 'document';

export type RichTextEditorInstance = BaseEditor & ReactEditor & HistoryEditor;

export type RichTextHashtagSummary = {
  values: string[];
  uniqueValues: string[];
  totalCount: number;
  uniqueCount: number;
};

export type RichTextHashtagChange = RichTextHashtagSummary & {
  added: string[];
  removed: string[];
};

export type RichTextHashtagOptions = {
  /** Local suggestions filtered as the user types after `#`. */
  suggestions?: readonly string[];
  /** Allows a typed query to become a hashtag when it is not in `suggestions`. Defaults to true. */
  allowFreeform?: boolean;
  /** Called with the active query, suitable for loading remote suggestions. */
  onSearch?: (query: string) => void;
  /** Called when an interactive hashtag is selected in the editor or renderer. */
  onHashtagClick?: (tag: string) => void;
  /** Reports the complete hashtag summary and occurrence-level additions and removals. */
  onHashtagsChange?: (change: RichTextHashtagChange) => void;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: RichTextEditorInstance;
    Element: RichTextElement;
    Text: RichTextText;
  }
}
