import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createEditor, Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { RichTextEditor, RichTextEditorContent } from './RichText';
import type {
  RichTextEditorHandle,
  RichTextEditorInstance,
  RichTextToken,
  RichTextTokenOptions,
  RichTextValue,
} from './RichText.types';
import {
  deserializeRichTextFromHtml,
  insertRichTextToken,
  isRichTextEmpty,
  serializeRichTextToHtml,
  serializeRichTextToPlainText,
  updateRichTextToken,
  withLinks,
} from './RichText.utils';
import { RichTextRenderer } from './RichTextRenderer';

const tokens: RichTextTokenOptions[] = [
  {
    kind: 'variable',
    trigger: '{',
    suggestions: [
      { value: 'first_name', label: 'First name', description: 'Contact name', group: 'Contact' },
      { value: 'last_name', label: 'Last name' },
    ],
    renderChip: (node) =>
      `${node.value === 'first_name' ? 'First name' : 'Last name'} · ${node.data?.fallback ?? 'there'}`,
  },
  { kind: 'company', trigger: '@', suggestions: [{ value: 'acme', label: 'Acme' }] },
];
const empty: RichTextValue = [{ type: 'paragraph', children: [{ text: '' }] }];
const token: RichTextToken = {
  type: 'token',
  kind: 'variable',
  value: 'first_name',
  data: { fallback: 'friend' },
  children: [{ text: '' }],
};
let editor: RichTextEditorInstance;
function CaptureEditor() {
  editor = useSlate();
  return <RichTextEditorContent />;
}
async function type(text: string) {
  // jsdom does not implement the browser property Slate uses to accept keyboard events.
  Object.defineProperty(screen.getByRole('textbox'), 'isContentEditable', { configurable: true, value: true });
  await act(async () => {
    Transforms.select(editor, Editor.end(editor, []));
    Transforms.insertText(editor, text);
  });
}

describe('rich text tokens', () => {
  it('inserts two token kinds and the hashtag preset with keyboard navigation', async () => {
    const onValueChange = vi.fn();
    render(
      <RichTextEditor value={empty} onValueChange={onValueChange} tokens={tokens} hashtags={{ suggestions: ['news'] }}>
        <CaptureEditor />
      </RichTextEditor>,
    );
    await type('{');
    const textbox = screen.getByRole('textbox');
    expect(await screen.findByRole('listbox', { name: 'Token suggestions' })).toBeVisible();
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Last name' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(textbox, { key: 'ArrowUp' });
    fireEvent.keyDown(textbox, { key: 'Enter' });
    expect(await screen.findByRole('button', { name: 'First name · there' })).toBeVisible();
    await type('@ac');
    fireEvent.keyDown(textbox, { key: 'Enter' });
    expect(await screen.findByRole('button', { name: 'Acme' })).toBeVisible();
    await type('#new');
    fireEvent.click(await screen.findByRole('option', { name: '#news' }));
    await waitFor(() =>
      expect(serializeRichTextToPlainText(editor.children as RichTextValue, tokens)).toBe(
        'First name · there Acme #news ',
      ),
    );
    expect(onValueChange).toHaveBeenCalled();
  });

  it('supports search results, defaults to no freeform, and dismisses suggestions', async () => {
    const onSearch = vi.fn();
    const { rerender } = render(
      <RichTextEditor value={empty} onValueChange={vi.fn()} tokens={[{ kind: 'variable', trigger: '{', onSearch }]}>
        <CaptureEditor />
      </RichTextEditor>,
    );
    await type('{first');
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('first'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender(
      <RichTextEditor value={empty} onValueChange={vi.fn()} tokens={[{ ...tokens[0], onSearch }]}>
        <CaptureEditor />
      </RichTextEditor>,
    );
    expect(await screen.findByRole('option')).toHaveTextContent('First name');
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('allows freeform only when enabled and ignores Enter during composition', async () => {
    render(
      <RichTextEditor
        value={empty}
        onValueChange={vi.fn()}
        tokens={[{ kind: 'custom', trigger: '$', allowFreeform: true }]}
      >
        <CaptureEditor />
      </RichTextEditor>,
    );
    await type('$hello');
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', isComposing: true });
    expect(screen.getByRole('option', { name: 'hello' })).toBeVisible();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(await screen.findByRole('button', { name: 'hello' })).toBeVisible();
  });

  it('inserts from outside at the saved selection and edits only the clicked occurrence', async () => {
    const ref = React.createRef<RichTextEditorHandle>();
    const onClick = vi.fn((node: RichTextToken) => ref.current!.updateToken(node, { fallback: 'friend' }));
    render(
      <RichTextEditor
        ref={ref}
        value={[{ type: 'paragraph', children: [{ text: 'Hello world' }] }]}
        onValueChange={vi.fn()}
        tokens={[{ ...tokens[0], onTokenClick: onClick }]}
      >
        <CaptureEditor />
      </RichTextEditor>,
    );
    await act(async () => Transforms.select(editor, { path: [0, 0], offset: 6 }));
    await act(async () => Transforms.deselect(editor));
    await act(async () => {
      expect(ref.current!.insertToken({ kind: 'variable', value: 'first_name' })).toBe(true);
    });
    expect(serializeRichTextToPlainText(editor.children as RichTextValue, tokens)).toBe(
      'Hello First name · there world',
    );
    await act(async () => {
      ref.current!.insertToken({ kind: 'variable', value: 'first_name' });
    });
    const chips = screen.getAllByRole('button', { name: 'First name · there' });
    await act(async () => fireEvent.click(chips[0]));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ value: 'first_name' }), chips[0]);
    expect(screen.getByRole('button', { name: 'First name · friend' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'First name · there' })).toBeVisible();
  });

  it.each(['Enter', ' '])('activates a focusable chip with %s and deletes it with Backspace', async (key) => {
    const onTokenClick = vi.fn();
    render(
      <RichTextEditor
        value={[{ type: 'paragraph', children: [{ text: '' }, token, { text: 'tail' }] }]}
        onValueChange={vi.fn()}
        tokens={[{ ...tokens[0], onTokenClick }]}
      >
        <CaptureEditor />
      </RichTextEditor>,
    );
    const chip = screen.getByRole('button', { name: 'First name · friend' });
    chip.focus();
    expect(chip).toHaveFocus();
    fireEvent.keyDown(chip, { key });
    expect(onTokenClick).toHaveBeenCalledWith(expect.objectContaining({ data: { fallback: 'friend' } }), chip);
    await act(async () => fireEvent.keyDown(chip, { key: 'Backspace' }));
    expect(screen.queryByRole('button', { name: 'First name · friend' })).not.toBeInTheDocument();
    expect(serializeRichTextToPlainText(editor.children as RichTextValue)).toBe('tail');
  });

  it.each(['disabled', 'readOnly'] as const)('prevents token mutation when %s', async (state) => {
    const ref = React.createRef<RichTextEditorHandle>();
    render(
      <RichTextEditor
        ref={ref}
        {...{ [state]: true }}
        value={[{ type: 'paragraph', children: [{ text: '' }, token, { text: '' }] }]}
        onValueChange={vi.fn()}
        tokens={tokens}
      >
        <CaptureEditor />
      </RichTextEditor>,
    );
    expect(ref.current!.insertToken({ kind: 'variable', value: 'first_name' })).toBe(false);
    expect(ref.current!.updateToken(token, {})).toBe(false);
    fireEvent.keyDown(screen.getByRole('button', { name: 'First name · friend' }), { key: 'Backspace' });
    expect(screen.getByRole('button', { name: 'First name · friend' })).toBeVisible();
  });

  it('renders the same label and anchor callbacks in the renderer', () => {
    const onTokenClick = vi.fn();
    render(
      <RichTextRenderer value={[{ type: 'paragraph', children: [token] }]} tokens={[{ ...tokens[0], onTokenClick }]} />,
    );
    const chip = screen.getByRole('button', { name: 'First name · friend' });
    fireEvent.click(chip);
    expect(onTokenClick).toHaveBeenCalledWith(token, chip);
  });

  it('round-trips token metadata through HTML and exports readable plain text', () => {
    const value: RichTextValue = [{ type: 'paragraph', children: [{ text: 'Hi ' }, token] }];
    const html = serializeRichTextToHtml(value, tokens);
    expect(html).toContain('First name · friend');
    expect(deserializeRichTextFromHtml(html)).toEqual(value);
    expect(serializeRichTextToPlainText(deserializeRichTextFromHtml(html), tokens)).toBe('Hi First name · friend');
    expect(isRichTextEmpty([{ type: 'paragraph', children: [token] }])).toBe(false);
    expect(serializeRichTextToPlainText(value)).toBe('Hi first_name');
  });

  it('supports custom serialization while escaping metadata and sanitizing HTML', () => {
    const unsafeToken = { ...token, data: { fallback: '"<img src=x onerror=evil()>' } };
    const value: RichTextValue = [{ type: 'paragraph', children: [unsafeToken] }];
    const config = [
      { ...tokens[0], getPlainText: () => '{first_name}', getHtml: () => '<b>Name</b><script>evil()</script>' },
    ];
    const html = serializeRichTextToHtml(value, config);
    expect(html).toContain('<b>Name</b>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(deserializeRichTextFromHtml(html)).toEqual(value);
    expect(serializeRichTextToPlainText(value, config)).toBe('{first_name}');
    expect(
      deserializeRichTextFromHtml(
        '<p><span data-token-kind="variable" data-token-value="first_name" data-token-data="[]">Name</span></p>',
      )[0].children[0],
    ).toEqual({ ...token, data: undefined });
  });

  it('treats tokens as atomic in Slate and refuses updates to deleted nodes', () => {
    const instance = withLinks(createEditor());
    instance.children = [{ type: 'paragraph', children: [{ text: '' }] }];
    Transforms.select(instance, Editor.end(instance, []));
    insertRichTextToken(instance, { kind: 'variable', value: 'first_name' });
    const [entry] = Editor.nodes(instance, { at: [], match: (node) => 'type' in node && node.type === 'token' });
    expect(instance.isInline(entry[0] as RichTextToken)).toBe(true);
    expect(instance.isVoid(entry[0] as RichTextToken)).toBe(true);
    Transforms.select(instance, { path: [0, 2], offset: 0 });
    Editor.deleteBackward(instance, { unit: 'character' });
    expect(isRichTextEmpty(instance.children as RichTextValue)).toBe(true);
    expect(updateRichTextToken(instance, entry[0] as RichTextToken, {})).toBe(false);
  });
});
