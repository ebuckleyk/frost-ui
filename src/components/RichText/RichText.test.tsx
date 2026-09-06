import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createEditor, Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { RichTextEditor, RichTextEditorContent, RichTextEditorToolbar } from './RichText';
import { getRichTextShortcut } from './RichText.shortcuts';
import type { RichTextValue } from './RichText.types';
import {
  deserializeRichTextFromHtml,
  getActiveLink,
  getRichTextHashtagChange,
  getRichTextHashtags,
  isRichTextEmpty,
  removeLink,
  serializeRichTextToHtml,
  serializeRichTextToPlainText,
  toggleBlock,
  toggleMark,
  upsertLink,
  withLinks,
} from './RichText.utils';

const EXISTING_VALUE: RichTextValue = [
  { type: 'heading-2', children: [{ text: 'Persisted heading', bold: true }] },
  {
    type: 'paragraph',
    children: [
      { text: 'Visit ' },
      { type: 'link', url: 'https://example.com', children: [{ text: 'Example', underline: true }] },
      { text: ' today.' },
    ],
  },
];

describe('RichTextEditor', () => {
  it('animates intrinsic height changes and respects reduced motion', () => {
    render(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} />);

    expect(document.querySelector('[data-slot="rich-text-editor"]')).toHaveClass(
      'transition-[height,border-color,box-shadow]',
      'motion-reduce:transition-none',
    );
  });

  it('renders a controlled initial value and external replacement', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<RichTextEditor value={EXISTING_VALUE} onValueChange={onValueChange} />);

    expect(screen.getByText('Persisted heading')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Example' })).toHaveAttribute('href', 'https://example.com/');

    const replacement: RichTextValue = [{ type: 'paragraph', children: [{ text: 'Reset content' }] }];
    rerender(<RichTextEditor value={replacement} onValueChange={onValueChange} />);
    expect(screen.getByText('Reset content')).toBeVisible();
    expect(screen.queryByText('Persisted heading')).not.toBeInTheDocument();
  });

  it('exposes readable basic toolbar labels', () => {
    render(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Bold' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Underline' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add link' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Bulleted list' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Numbered list' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Heading 1' })).not.toBeInTheDocument();
  });

  it('exposes document formatting controls with customer-readable labels', () => {
    render(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} toolbar="document" />);
    expect(screen.getByRole('button', { name: 'Heading 1' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Block quote' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Align left' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Inline code' })).toBeVisible();
  });

  it('exposes active formatting state with aria-pressed', async () => {
    function SelectBoldText() {
      const editor = useSlate();
      React.useEffect(() => {
        Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 4 } });
      }, [editor]);
      return null;
    }

    render(
      <RichTextEditor value={[{ type: 'paragraph', children: [{ text: 'Bold', bold: true }] }]} onValueChange={vi.fn()}>
        <RichTextEditorToolbar />
        <SelectBoldText />
        <RichTextEditorContent />
      </RichTextEditor>,
    );
    const boldControl = screen.getByRole('button', { name: 'Bold' });
    await waitFor(() => expect(boldControl).toHaveAttribute('aria-pressed', 'true'));
    expect(boldControl).toHaveClass('aria-pressed:bg-primary/20', 'aria-pressed:text-primary');
  });

  it('updates the standard Toggle pressed state after applying formatting', async () => {
    function SelectText() {
      const editor = useSlate();
      React.useEffect(() => {
        Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 4 } });
      }, [editor]);
      return null;
    }

    const onValueChange = vi.fn();
    render(
      <RichTextEditor value={[{ type: 'paragraph', children: [{ text: 'Bold' }] }]} onValueChange={onValueChange}>
        <RichTextEditorToolbar />
        <SelectText />
        <RichTextEditorContent />
      </RichTextEditor>,
    );
    const boldControl = screen.getByRole('button', { name: 'Bold' });

    await waitFor(() => expect(boldControl).toHaveAttribute('aria-pressed', 'false'));
    fireEvent.click(boldControl);

    await waitFor(() => expect(boldControl).toHaveAttribute('aria-pressed', 'true'));
    expect(onValueChange).toHaveBeenLastCalledWith([{ type: 'paragraph', children: [{ text: 'Bold', bold: true }] }]);
  });

  it('supports read-only and disabled states', () => {
    const { rerender } = render(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('contenteditable', 'false');
    expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();

    rerender(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Add link' })).toBeDisabled();
  });

  it('opens the link editor and rejects unsafe URLs', async () => {
    render(<RichTextEditor value={EXISTING_VALUE} onValueChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    const linkInput = await screen.findByLabelText('Link URL');
    fireEvent.change(linkInput, { target: { value: 'javascript:alert(1)' } });
    expect(screen.getByText(/safe HTTP/i)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Apply link' })).toBeDisabled();
  });

  it.each([
    ['b', 'bold'],
    ['i', 'italic'],
    ['u', 'underline'],
    ['`', 'code'],
    ['k', 'link'],
  ] as const)('maps Mod+%s to %s', (key, shortcut) => {
    expect(getRichTextShortcut({ key, ctrlKey: true, metaKey: false })).toBe(shortcut);
    expect(getRichTextShortcut({ key, ctrlKey: false, metaKey: true })).toBe(shortcut);
  });

  it('emits canonical values when the editor document changes', async () => {
    const onValueChange = vi.fn();

    function MutationControl() {
      const editor = useSlate();
      return (
        <button
          onClick={() => {
            Transforms.select(editor, Editor.end(editor, []));
            Transforms.insertText(editor, 'Updated');
          }}
        >
          Mutate editor
        </button>
      );
    }

    render(
      <RichTextEditor value={[{ type: 'paragraph', children: [{ text: '' }] }]} onValueChange={onValueChange}>
        <RichTextEditorToolbar />
        <RichTextEditorContent />
        <MutationControl />
      </RichTextEditor>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Mutate editor' }));
    await waitFor(() =>
      expect(onValueChange).toHaveBeenLastCalledWith([{ type: 'paragraph', children: [{ text: 'Updated' }] }]),
    );
  });

  it('offers and inserts structured hashtag suggestions', async () => {
    const onValueChange = vi.fn();

    function TypeHashtag() {
      const editor = useSlate();
      return (
        <button
          onClick={() => {
            Transforms.select(editor, Editor.end(editor, []));
            Transforms.insertText(editor, '#rea');
          }}
        >
          Type hashtag
        </button>
      );
    }

    render(
      <RichTextEditor
        value={[{ type: 'paragraph', children: [{ text: '' }] }]}
        onValueChange={onValueChange}
        hashtags={{ suggestions: ['React', 'Reading'] }}
      >
        <RichTextEditorContent />
        <TypeHashtag />
      </RichTextEditor>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Type hashtag' }));
    fireEvent.click(await screen.findByRole('option', { name: '#React' }));

    await waitFor(() =>
      expect(onValueChange).toHaveBeenLastCalledWith([
        {
          type: 'paragraph',
          children: [{ text: '' }, { type: 'hashtag', tag: 'React', children: [{ text: '' }] }, { text: ' ' }],
        },
      ]),
    );
  });

  it('reports hashtag additions and removals from controlled values', async () => {
    const onHashtagsChange = vi.fn();
    const first: RichTextValue = [
      { type: 'paragraph', children: [{ type: 'hashtag', tag: 'react', children: [{ text: '' }] }] },
    ];
    const second: RichTextValue = [
      {
        type: 'paragraph',
        children: [
          { type: 'hashtag', tag: 'design', children: [{ text: '' }] },
          { type: 'hashtag', tag: 'design', children: [{ text: '' }] },
        ],
      },
    ];
    const { rerender } = render(
      <RichTextEditor value={first} onValueChange={vi.fn()} hashtags={{ onHashtagsChange }} />,
    );

    rerender(<RichTextEditor value={second} onValueChange={vi.fn()} hashtags={{ onHashtagsChange }} />);
    await waitFor(() =>
      expect(onHashtagsChange).toHaveBeenLastCalledWith({
        values: ['design', 'design'],
        uniqueValues: ['design'],
        totalCount: 2,
        uniqueCount: 1,
        added: ['design', 'design'],
        removed: ['react'],
      }),
    );
  });

  it('exposes hashtag clicks without hiding the structured value', async () => {
    const onHashtagClick = vi.fn();
    render(
      <RichTextEditor
        value={[{ type: 'paragraph', children: [{ type: 'hashtag', tag: 'react', children: [{ text: '' }] }] }]}
        onValueChange={vi.fn()}
        hashtags={{ onHashtagClick }}
        toolbar={false}
      />,
    );

    await act(async () => fireEvent.click(screen.getByRole('button', { name: '#react' })));
    expect(onHashtagClick).toHaveBeenCalledWith('react');
  });
});

describe('rich text editing commands', () => {
  function editorWith(value: RichTextValue) {
    const editor = withLinks(createEditor());
    editor.children = value;
    return editor;
  }

  it.each(['bold', 'italic', 'underline'] as const)('toggles the %s mark on selected text', (mark) => {
    const editor = editorWith([{ type: 'paragraph', children: [{ text: 'Format me' }] }]);
    editor.selection = { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 9 } };
    toggleMark(editor, mark);
    expect(Editor.leaf(editor, [0, 0])[0]).toMatchObject({ text: 'Format me', [mark]: true });
  });

  it.each(['bulleted-list', 'numbered-list'] as const)('toggles a %s', (listType) => {
    const editor = editorWith([{ type: 'paragraph', children: [{ text: 'List item' }] }]);
    editor.selection = { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 9 } };
    toggleBlock(editor, listType);
    expect(editor.children[0]).toMatchObject({
      type: listType,
      children: [{ type: 'list-item', children: [{ text: 'List item' }] }],
    });
  });

  it('adds, edits, and removes links', () => {
    const editor = editorWith([{ type: 'paragraph', children: [{ text: 'Example link' }] }]);
    editor.selection = { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 7 } };
    upsertLink(editor, 'example.com');
    expect(getActiveLink(editor)?.[0].url).toBe('https://example.com/');

    upsertLink(editor, 'https://example.org/docs');
    expect(getActiveLink(editor)?.[0].url).toBe('https://example.org/docs');

    removeLink(editor);
    expect(editor.children).toEqual([{ type: 'paragraph', children: [{ text: 'Example link' }] }]);
  });
});

describe('rich text serialization', () => {
  const documentValue: RichTextValue = [
    {
      type: 'paragraph',
      children: [
        { text: '<safe>', bold: true, italic: true, underline: true, code: true },
        { type: 'link', url: 'example.com/docs', children: [{ text: ' docs' }] },
      ],
    },
    { type: 'bulleted-list', children: [{ type: 'list-item', children: [{ text: 'First' }] }] },
    { type: 'numbered-list', children: [{ type: 'list-item', children: [{ text: 'Second' }] }] },
  ];

  it('serializes clean semantic HTML without editor or test markup', () => {
    const html = serializeRichTextToHtml(documentValue);
    expect(html).toContain('<code>');
    expect(html).not.toContain('<pre>');
    expect(html).toContain('<ul><li>First</li></ul>');
    expect(html).toContain('<ol><li>Second</li></ol>');
    expect(html).toContain('href="https://example.com/docs"');
    expect(html).toContain('&lt;safe&gt;');
    expect(html).not.toMatch(/data-testid|data-slate|class=/);
  });

  it('serializes readable plain text with list boundaries', () => {
    expect(serializeRichTextToPlainText(documentValue)).toBe('<safe> docs\n• First\n1. Second');
  });

  it('round-trips supported HTML semantics', () => {
    const html =
      '<h2><strong>Title</strong></h2><p>Hello <a href="https://example.com"><em>world</em></a></p><ol><li>One</li></ol>';
    const parsed = deserializeRichTextFromHtml(html);
    expect(serializeRichTextToHtml(parsed)).toBe(
      '<h2><strong>Title</strong></h2><p>Hello <a href="https://example.com/"><em>world</em></a></p><ol><li>One</li></ol>',
    );
  });

  it('sanitizes unsafe HTML and flattens unsupported markup', () => {
    const parsed = deserializeRichTextFromHtml(
      '<div onclick="evil()">Safe<script>alert(1)</script><a href="javascript:evil()"> link</a><img src=x onerror=evil()></div>',
    );
    const html = serializeRichTextToHtml(parsed);
    expect(html).toContain('Safe link');
    expect(html).not.toMatch(/script|javascript|onclick|onerror|<img/i);
  });

  it('detects empty and non-empty documents', () => {
    expect(isRichTextEmpty([{ type: 'paragraph', children: [{ text: '  ' }] }])).toBe(true);
    expect(isRichTextEmpty([{ type: 'paragraph', children: [{ text: 'Content' }] }])).toBe(false);
    expect(isRichTextEmpty(undefined)).toBe(true);
  });

  it('serializes, deserializes, and summarizes structured hashtags', () => {
    const value: RichTextValue = [
      {
        type: 'paragraph',
        children: [
          { text: 'Topics: ' },
          { type: 'hashtag', tag: 'design', children: [{ text: '' }] },
          { text: ' and ' },
          { type: 'hashtag', tag: 'design', children: [{ text: '' }] },
        ],
      },
    ];

    expect(serializeRichTextToHtml(value)).toBe(
      '<p>Topics: <span data-hashtag="design">#design</span> and <span data-hashtag="design">#design</span></p>',
    );
    expect(serializeRichTextToPlainText(value)).toBe('Topics: #design and #design');
    expect(deserializeRichTextFromHtml(serializeRichTextToHtml(value))).toEqual(value);
    expect(getRichTextHashtags(value)).toEqual({
      values: ['design', 'design'],
      uniqueValues: ['design'],
      totalCount: 2,
      uniqueCount: 1,
    });
    expect(getRichTextHashtagChange(value, [{ type: 'paragraph', children: [{ text: '' }] }])).toMatchObject({
      added: [],
      removed: ['design', 'design'],
    });
  });
});
