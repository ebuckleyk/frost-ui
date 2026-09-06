'use client';

import * as React from 'react';

import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '@/components/ui/emoji-picker';

export type RichTextEmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
};

export default function RichTextEmojiPicker({ onEmojiSelect }: RichTextEmojiPickerProps): React.ReactElement {
  return (
    <EmojiPicker className="h-80" onEmojiSelect={({ emoji }) => onEmojiSelect(emoji)}>
      <EmojiPickerSearch autoFocus placeholder="Search emoji" />
      <EmojiPickerContent />
    </EmojiPicker>
  );
}
