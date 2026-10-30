# RichText token chips

Pass the same `tokens` configuration to `RichTextEditor`, `RichTextRenderer`, and the optional second argument of `serializeRichTextToHtml` / `serializeRichTextToPlainText`.

```tsx
const editorRef = React.useRef<RichTextEditorHandle>(null);
const tokens: RichTextTokenOptions[] = [{
  kind: 'variable',
  trigger: '{',
  suggestions: [{ value: 'first_name', label: 'First name', group: 'Contact' }],
  renderChip: (node) => `First name · ${node.data?.fallback ?? 'there'}`,
  onTokenClick: (node, anchorEl) => openFallbackPopover(node, anchorEl),
}];

<RichTextEditor ref={editorRef} value={value} onValueChange={setValue} tokens={tokens} />;

editorRef.current?.insertToken({ kind: 'variable', value: 'first_name' });
// On popover save, pass the exact node received by the editor callback:
editorRef.current?.updateToken(node, { ...node.data, fallback: 'friend' });
```

`insertToken` restores the last selection when an external control has focus; without a selection it appends at the end. `updateToken` replaces metadata on that exact occurrence, so repeated values remain independent. Both return false when read-only or disabled; updates also return false for stale or deleted nodes. A controlled document replacement invalidates prior node references. Renderer callback nodes belong to the supplied document, not to an editor instance.

Kinds and single-character triggers must be unique. `hashtag` is reserved; enabling `hashtags` reserves `#`. Custom tokens default to `allowFreeform: false`. `onSearch(query)` notifies the app to fetch results and supply an updated `suggestions` array; the app owns request cancellation and stale-result handling. Queries contain letters, numbers, underscores, or hyphens. Triggers begin a block or follow whitespace. Suggestions include optional description and group text.

`renderChip` returns the label string used for display, accessible naming, and default serialization. Without it the matching suggestion label is used, then the token value. `getPlainText` and `getHtml` override serialized content; custom HTML is sanitized and enclosed in a token wrapper. HTML preserves kind, value, and string metadata, even without token configs during deserialization. Plain text is a readable export and cannot preserve token identity or metadata. Use the canonical JSON value or HTML for lossless persistence.

Arrow keys navigate suggestions, Enter/Tab insert, and Escape dismisses them. Chips are focusable buttons: Enter/Space activates the app callback and Backspace removes the focused chip in editable mode. Slate also deletes the whole inline when backspacing immediately after it.

Existing `hashtags` props, hashtag nodes, summary callbacks, and `data-hashtag` serialization remain compatible. See the `VariableChips` story for an app-owned anchored fallback popover and two token kinds alongside hashtags.
