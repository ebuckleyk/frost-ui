import type { RichTextMark } from './RichText.types';

export type RichTextShortcut = RichTextMark | 'link' | null;

export function getRichTextShortcut(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey'>): RichTextShortcut {
  if (!event.ctrlKey && !event.metaKey) return null;
  const shortcuts: Partial<Record<string, RichTextShortcut>> = {
    b: 'bold',
    i: 'italic',
    u: 'underline',
    '`': 'code',
    k: 'link',
  };
  return shortcuts[event.key.toLowerCase()] ?? null;
}
