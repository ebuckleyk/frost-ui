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

export type RichTextInline = RichTextText | RichTextLink;

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
  | RichTextLink;

export type RichTextBlock = Exclude<RichTextElement, RichTextLink>;

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
  | 'link';
export type RichTextToolbarPreset = 'basic' | 'document';

export type RichTextEditorInstance = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: RichTextEditorInstance;
    Element: RichTextElement;
    Text: RichTextText;
  }
}
