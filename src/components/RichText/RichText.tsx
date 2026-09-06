'use client';

import * as React from 'react';
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  Link1Icon,
  QuoteIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Smile,
  Unlink,
} from 'lucide-react';
import { createEditor, Editor, Range, Element as SlateElement, Transforms, type Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { Toggle } from '@/components/Toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/Tooltip';

import { getRichTextShortcut } from './RichText.shortcuts';
import type {
  RichTextAlignment,
  RichTextBlockType,
  RichTextEditorInstance,
  RichTextHashtagOptions,
  RichTextMark,
  RichTextToolbarCapability,
  RichTextToolbarPreset,
  RichTextValue,
} from './RichText.types';
import {
  cloneRichTextValue,
  getActiveLink,
  getRichTextHashtagChange,
  insertRichTextHashtag,
  isBlockActive,
  isMarkActive,
  normalizeRichTextHashtag,
  normalizeRichTextUrl,
  removeLink,
  renderRichTextElement,
  renderRichTextLeaf,
  renderRichTextPlaceholder,
  toggleBlock,
  toggleMark,
  upsertLink,
  withLinks,
} from './RichText.utils';

const BASIC_CAPABILITIES = ['bold', 'italic', 'underline', 'link', 'bulleted-list', 'numbered-list'] as const;
const DOCUMENT_CAPABILITIES = [
  'bold',
  'italic',
  'underline',
  'code',
  'link',
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'heading-5',
  'heading-6',
  'block-quote',
  'bulleted-list',
  'numbered-list',
  'align-left',
  'align-center',
  'align-right',
  'align-justify',
] as const;

const LazyRichTextEmojiPicker = React.lazy(() => import('./RichTextEmojiPicker'));

type RichTextEditorContextValue = {
  editor: RichTextEditorInstance;
  disabled: boolean;
  readOnly: boolean;
  hashtagQuery: string | null;
  hashtagSuggestions: string[];
  activeHashtagIndex: number;
  linkOpen: boolean;
  linkUrl: string;
  savedSelection: Range | null;
  setLinkOpen: (open: boolean) => void;
  setLinkUrl: (url: string) => void;
  setActiveHashtagIndex: (index: number) => void;
  commitHashtag: (tag: string) => void;
  closeHashtagSuggestions: () => void;
  onHashtagClick?: (tag: string) => void;
  openLinkEditor: () => void;
};

const RichTextEditorContext = React.createContext<RichTextEditorContextValue | null>(null);

function useRichTextEditorContext(): RichTextEditorContextValue {
  const context = React.useContext(RichTextEditorContext);
  if (!context) throw new Error('RichTextEditor components must be used inside RichTextEditor.');
  return context;
}

function resolveCapabilities(
  toolbar: RichTextToolbarPreset | readonly RichTextToolbarCapability[],
): readonly RichTextToolbarCapability[] {
  if (Array.isArray(toolbar)) return toolbar;
  return toolbar === 'document' ? DOCUMENT_CAPABILITIES : BASIC_CAPABILITIES;
}

type HashtagMatch = { query: string; range: Range };

function getHashtagMatch(editor: ReturnType<typeof createEditor>): HashtagMatch | null {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) return null;
  const block = Editor.above(editor, {
    at: editor.selection.anchor,
    match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && Editor.isBlock(editor, node),
  });
  if (!block) return null;

  const cursor = editor.selection.anchor;
  const text = Editor.string(editor, { anchor: Editor.start(editor, block[1]), focus: cursor });
  const match = text.match(/(?:^|\s)#([\p{L}\p{N}_-]*)$/u);
  if (!match) return null;
  const start = Editor.before(editor, cursor, { distance: match[1].length + 1 });
  return start ? { query: match[1], range: { anchor: start, focus: cursor } } : null;
}

export type RichTextEditorProps = {
  /** The canonical serializable document. */
  value: RichTextValue;
  /** Receives each canonical document update. */
  onValueChange: (value: RichTextValue) => void;
  /**
   * A toolbar preset, explicit capability list, or false to hide the toolbar.
   * Add `emoji` to an explicit list to lazily enable emoji insertion.
   */
  toolbar?: RichTextToolbarPreset | readonly RichTextToolbarCapability[] | false;
  /** Enables structured hashtag entry and configures suggestions and callbacks. */
  hashtags?: RichTextHashtagOptions | false;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  id?: string;
  /** Adds hidden form data containing the JSON-serialized canonical document. */
  name?: string;
  className?: string;
  toolbarClassName?: string;
  contentClassName?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
};

export function RichTextEditor({
  value,
  onValueChange,
  toolbar = 'basic',
  hashtags = false,
  placeholder = 'Write something…',
  disabled = false,
  readOnly = false,
  invalid = false,
  id,
  name,
  className,
  toolbarClassName,
  contentClassName,
  autoFocus,
  spellCheck = true,
  onFocus,
  onBlur,
  children,
  'aria-label': ariaLabel = 'Rich text editor',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: RichTextEditorProps): React.ReactElement {
  const editor = React.useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastValueFingerprint = React.useRef(JSON.stringify(value));
  const previousHashtagValue = React.useRef(cloneRichTextValue(value));
  const [hashtagMatch, setHashtagMatch] = React.useState<HashtagMatch | null>(null);
  const [activeHashtagIndex, setActiveHashtagIndex] = React.useState(0);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [savedSelection, setSavedSelection] = React.useState<Range | null>(null);
  const isReadOnly = readOnly || disabled;
  const hashtagOptions = hashtags || undefined;
  const hashtagsEnabled = Boolean(hashtagOptions);
  const hashtagSuggestionSource = hashtagOptions?.suggestions;
  const allowFreeformHashtags = hashtagOptions?.allowFreeform !== false;
  const onHashtagClick = hashtagOptions?.onHashtagClick;
  const onHashtagsChange = hashtagOptions?.onHashtagsChange;
  const onHashtagSearch = hashtagOptions?.onSearch;
  const hashtagSuggestions = React.useMemo(() => {
    if (!hashtagMatch || !hashtagsEnabled) return [];
    const query = hashtagMatch.query.toLocaleLowerCase();
    const suggestions = Array.from(
      new Set(
        (hashtagSuggestionSource ?? [])
          .map(normalizeRichTextHashtag)
          .filter((tag): tag is string => Boolean(tag))
          .filter((tag) => tag.toLocaleLowerCase().startsWith(query)),
      ),
    );
    if (allowFreeformHashtags && hashtagMatch.query && !suggestions.some((tag) => tag.toLocaleLowerCase() === query)) {
      suggestions.push(hashtagMatch.query);
    }
    return suggestions;
  }, [allowFreeformHashtags, hashtagMatch, hashtagsEnabled, hashtagSuggestionSource]);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const styles = window.getComputedStyle(container);
    const borderHeight = (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0);
    let animationFrame = 0;

    const updateHeight = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const nextHeight = `${content.getBoundingClientRect().height + borderHeight}px`;
        if (container.style.height !== nextHeight) container.style.height = nextHeight;
      });
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(content);
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const fingerprint = JSON.stringify(value);
    if (fingerprint === lastValueFingerprint.current) return;
    lastValueFingerprint.current = fingerprint;
    editor.children = cloneRichTextValue(value) as Descendant[];
    editor.selection = null;
    editor.history = { undos: [], redos: [] };
    editor.onChange();
  }, [editor, value]);

  React.useEffect(() => {
    const change = getRichTextHashtagChange(previousHashtagValue.current, value);
    previousHashtagValue.current = cloneRichTextValue(value);
    if (change.added.length > 0 || change.removed.length > 0) onHashtagsChange?.(change);
  }, [onHashtagsChange, value]);

  React.useEffect(() => {
    if (hashtagMatch) onHashtagSearch?.(hashtagMatch.query);
  }, [hashtagMatch, onHashtagSearch]);

  const closeHashtagSuggestions = React.useCallback(() => {
    setHashtagMatch(null);
    setActiveHashtagIndex(0);
  }, []);

  const commitHashtag = React.useCallback(
    (tag: string) => {
      if (!hashtagMatch || isReadOnly) return;
      Transforms.select(editor, hashtagMatch.range);
      Transforms.delete(editor);
      insertRichTextHashtag(editor, tag);
      closeHashtagSuggestions();
      ReactEditor.focus(editor);
    },
    [closeHashtagSuggestions, editor, hashtagMatch, isReadOnly],
  );

  const openLinkEditor = React.useCallback(() => {
    if (isReadOnly) return;
    if (!editor.selection) Transforms.select(editor, Editor.end(editor, []));
    if (!editor.selection) return;
    setSavedSelection(editor.selection);
    setLinkUrl(getActiveLink(editor)?.[0].url ?? '');
    setLinkOpen(true);
  }, [editor, isReadOnly]);

  const context = React.useMemo<RichTextEditorContextValue>(
    () => ({
      editor,
      disabled,
      readOnly: isReadOnly,
      hashtagQuery: hashtagMatch?.query ?? null,
      hashtagSuggestions,
      activeHashtagIndex,
      linkOpen,
      linkUrl,
      savedSelection,
      setLinkOpen,
      setLinkUrl,
      setActiveHashtagIndex,
      commitHashtag,
      closeHashtagSuggestions,
      onHashtagClick,
      openLinkEditor,
    }),
    [
      activeHashtagIndex,
      closeHashtagSuggestions,
      commitHashtag,
      disabled,
      editor,
      hashtagMatch,
      hashtagSuggestions,
      isReadOnly,
      linkOpen,
      linkUrl,
      onHashtagClick,
      openLinkEditor,
      savedSelection,
    ],
  );

  const handleChange = React.useCallback(
    (nextValue: Descendant[]) => {
      setHashtagMatch(hashtagsEnabled && !isReadOnly ? getHashtagMatch(editor) : null);
      setActiveHashtagIndex(0);
      if (!editor.operations.some((operation) => operation.type !== 'set_selection')) return;
      const canonicalValue = cloneRichTextValue(nextValue as RichTextValue);
      lastValueFingerprint.current = JSON.stringify(canonicalValue);
      onValueChange(canonicalValue);
    },
    [editor, hashtagsEnabled, isReadOnly, onValueChange],
  );

  return (
    <div
      ref={containerRef}
      data-slot="rich-text-editor"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        `
          input-glass overflow-hidden rounded-md border border-input
          bg-transparent bg-clip-padding text-sm
          transition-[height,border-color,box-shadow] duration-200 ease-out
          focus-within:border-ring focus-within:ring-[3px]
          focus-within:ring-ring/50
          data-[disabled=true]:cursor-not-allowed
          data-[disabled=true]:opacity-50 motion-reduce:transition-none
          dark:bg-input/30
        `,
        invalid && 'border-destructive ring-[3px] ring-destructive/20 dark:ring-destructive/40',
        className,
      )}
    >
      <div ref={contentRef}>
        <Slate editor={editor} initialValue={cloneRichTextValue(value)} onChange={handleChange}>
          <RichTextEditorContext.Provider value={context}>
            {children ?? (
              <>
                {toolbar !== false && (
                  <RichTextEditorToolbar capabilities={resolveCapabilities(toolbar)} className={toolbarClassName} />
                )}
                <RichTextEditorContent
                  id={id}
                  placeholder={placeholder}
                  className={contentClassName}
                  autoFocus={autoFocus}
                  spellCheck={spellCheck}
                  aria-invalid={invalid || undefined}
                  aria-label={ariaLabelledBy ? undefined : ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </>
            )}
            {hashtagsEnabled ? <RichTextHashtagSuggestions /> : null}
          </RichTextEditorContext.Provider>
        </Slate>
        {name && <input type="hidden" name={name} value={JSON.stringify(value)} disabled={disabled} />}
      </div>
    </div>
  );
}

export type RichTextEditorContentProps = Omit<
  React.ComponentProps<typeof Editable>,
  'renderElement' | 'renderLeaf' | 'renderPlaceholder'
>;

export function RichTextEditorContent({
  className,
  onKeyDown,
  ...props
}: RichTextEditorContentProps): React.ReactElement {
  const editor = useSlate();
  const {
    activeHashtagIndex,
    closeHashtagSuggestions,
    commitHashtag,
    disabled,
    hashtagQuery,
    hashtagSuggestions,
    onHashtagClick,
    openLinkEditor,
    readOnly,
    setActiveHashtagIndex,
  } = useRichTextEditorContext();
  const renderElement = React.useCallback(
    (renderProps: Parameters<typeof renderRichTextElement>[0]) => renderRichTextElement(renderProps, onHashtagClick),
    [onHashtagClick],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || readOnly) return;

      if (hashtagQuery !== null) {
        if (event.key === 'ArrowDown' && hashtagSuggestions.length > 0) {
          event.preventDefault();
          setActiveHashtagIndex((activeHashtagIndex + 1) % hashtagSuggestions.length);
          return;
        }
        if (event.key === 'ArrowUp' && hashtagSuggestions.length > 0) {
          event.preventDefault();
          setActiveHashtagIndex((activeHashtagIndex - 1 + hashtagSuggestions.length) % hashtagSuggestions.length);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeHashtagSuggestions();
          return;
        }
        if ((event.key === 'Enter' || event.key === 'Tab') && hashtagSuggestions[activeHashtagIndex]) {
          event.preventDefault();
          commitHashtag(hashtagSuggestions[activeHashtagIndex]);
          return;
        }
      }

      const shortcut = getRichTextShortcut(event);
      if (shortcut && shortcut !== 'link') {
        event.preventDefault();
        toggleMark(editor, shortcut);
      } else if (shortcut === 'link') {
        event.preventDefault();
        openLinkEditor();
      }
    },
    [
      activeHashtagIndex,
      closeHashtagSuggestions,
      commitHashtag,
      editor,
      hashtagQuery,
      hashtagSuggestions,
      onKeyDown,
      openLinkEditor,
      readOnly,
      setActiveHashtagIndex,
    ],
  );

  return (
    <Editable
      {...props}
      role="textbox"
      readOnly={readOnly}
      aria-disabled={disabled || undefined}
      renderElement={renderElement}
      renderLeaf={renderRichTextLeaf}
      renderPlaceholder={renderRichTextPlaceholder}
      onKeyDown={handleKeyDown}
      className={cn(
        `
          min-h-32 px-3 py-2.5 text-foreground outline-none
          [&_blockquote]:my-2 [&_h1]:my-2 [&_h2]:my-2 [&_h3]:my-2
          [&_ol]:my-2 [&_p]:my-1 [&_ul]:my-2
        `,
        disabled && 'pointer-events-none',
        className,
      )}
    />
  );
}

function RichTextHashtagSuggestions(): React.ReactElement | null {
  const { activeHashtagIndex, commitHashtag, hashtagQuery, hashtagSuggestions, setActiveHashtagIndex } =
    useRichTextEditorContext();
  if (hashtagQuery === null) return null;

  if (hashtagSuggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label="Hashtag suggestions"
      className="border-t border-border/70 bg-popover p-1 text-popover-foreground"
    >
      {hashtagSuggestions.map((tag, index) => (
        <button
          key={tag}
          type="button"
          role="option"
          aria-selected={index === activeHashtagIndex}
          className={cn(
            'flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none',
            index === activeHashtagIndex && 'bg-accent text-accent-foreground',
          )}
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => setActiveHashtagIndex(index)}
          onClick={() => commitHashtag(tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}

type ToolbarControl = {
  capability: RichTextToolbarCapability;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  kind: 'mark' | 'block' | 'alignment';
  format: RichTextMark | RichTextBlockType | RichTextAlignment;
};

const TOOLBAR_CONTROLS: readonly ToolbarControl[] = [
  { capability: 'bold', label: 'Bold', icon: FontBoldIcon, kind: 'mark', format: 'bold' },
  { capability: 'italic', label: 'Italic', icon: FontItalicIcon, kind: 'mark', format: 'italic' },
  { capability: 'underline', label: 'Underline', icon: UnderlineIcon, kind: 'mark', format: 'underline' },
  { capability: 'code', label: 'Inline code', icon: CodeIcon, kind: 'mark', format: 'code' },
  { capability: 'heading-1', label: 'Heading 1', icon: Heading1, kind: 'block', format: 'heading-1' },
  { capability: 'heading-2', label: 'Heading 2', icon: Heading2, kind: 'block', format: 'heading-2' },
  { capability: 'heading-3', label: 'Heading 3', icon: Heading3, kind: 'block', format: 'heading-3' },
  { capability: 'heading-4', label: 'Heading 4', icon: Heading4, kind: 'block', format: 'heading-4' },
  { capability: 'heading-5', label: 'Heading 5', icon: Heading5, kind: 'block', format: 'heading-5' },
  { capability: 'heading-6', label: 'Heading 6', icon: Heading6, kind: 'block', format: 'heading-6' },
  { capability: 'block-quote', label: 'Block quote', icon: QuoteIcon, kind: 'block', format: 'block-quote' },
  { capability: 'bulleted-list', label: 'Bulleted list', icon: List, kind: 'block', format: 'bulleted-list' },
  { capability: 'numbered-list', label: 'Numbered list', icon: ListOrdered, kind: 'block', format: 'numbered-list' },
  { capability: 'align-left', label: 'Align left', icon: TextAlignLeftIcon, kind: 'alignment', format: 'left' },
  { capability: 'align-center', label: 'Align center', icon: TextAlignCenterIcon, kind: 'alignment', format: 'center' },
  { capability: 'align-right', label: 'Align right', icon: TextAlignRightIcon, kind: 'alignment', format: 'right' },
  { capability: 'align-justify', label: 'Justify', icon: TextAlignJustifyIcon, kind: 'alignment', format: 'justify' },
];

function FormattingControl({ control }: { control: ToolbarControl }): React.ReactElement {
  const editor = useSlate();
  const { disabled, readOnly } = useRichTextEditorContext();
  const active =
    control.kind === 'mark'
      ? isMarkActive(editor, control.format as RichTextMark)
      : isBlockActive(editor, control.format as RichTextBlockType | RichTextAlignment);

  const handlePressedChange = React.useCallback(() => {
    if (control.kind === 'mark') toggleMark(editor, control.format as RichTextMark);
    else toggleBlock(editor, control.format as RichTextBlockType | RichTextAlignment);
    ReactEditor.focus(editor);
  }, [control, editor]);

  const Icon = control.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          type="button"
          size="sm"
          aria-label={control.label}
          pressed={active}
          disabled={disabled || readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onPressedChange={handlePressedChange}
        >
          <Icon className="size-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{control.label}</TooltipContent>
    </Tooltip>
  );
}

function LinkControl(): React.ReactElement {
  const editor = useSlate();
  const linkInputId = React.useId();
  const { disabled, readOnly, linkOpen, linkUrl, savedSelection, setLinkOpen, setLinkUrl, openLinkEditor } =
    useRichTextEditorContext();
  const active = Boolean(getActiveLink(editor));
  const normalizedUrl = normalizeRichTextUrl(linkUrl);

  const restoreSelection = React.useCallback(() => {
    if (savedSelection) Transforms.select(editor, savedSelection);
  }, [editor, savedSelection]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!normalizedUrl) return;
      restoreSelection();
      upsertLink(editor, normalizedUrl);
      setLinkOpen(false);
      ReactEditor.focus(editor);
    },
    [editor, normalizedUrl, restoreSelection, setLinkOpen],
  );

  const handleRemove = React.useCallback(() => {
    restoreSelection();
    removeLink(editor);
    setLinkOpen(false);
    ReactEditor.focus(editor);
  }, [editor, restoreSelection, setLinkOpen]);

  const label = active ? 'Edit link' : 'Add link';
  return (
    <Popover open={linkOpen} onOpenChange={setLinkOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle
              type="button"
              size="sm"
              aria-label={label}
              pressed={active}
              disabled={disabled || readOnly}
              className="size-8"
              onMouseDown={(event) => event.preventDefault()}
              onPressedChange={openLinkEditor}
            >
              <Link1Icon />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" onOpenAutoFocus={(event) => event.preventDefault()}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor={linkInputId} className="text-sm font-medium">
            Link URL
          </label>
          <Input
            id={linkInputId}
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://example.com"
            autoFocus
            aria-invalid={linkUrl.length > 0 && !normalizedUrl ? true : undefined}
          />
          {linkUrl.length > 0 && !normalizedUrl && (
            <p className="text-xs text-destructive">Enter a safe HTTP, HTTPS, or mailto URL.</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            {active && (
              <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
                <Unlink /> Remove link
              </Button>
            )}
            <Button type="submit" size="sm" disabled={!normalizedUrl}>
              Apply link
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

const EmojiControl = React.memo(function EmojiControl(): React.ReactElement {
  const { disabled, editor, readOnly } = useRichTextEditorContext();
  const [open, setOpen] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);
  const savedSelection = React.useRef<Range | null>(null);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setHasOpened(true);
        if (editor.selection) savedSelection.current = editor.selection;
      }
      setOpen(nextOpen);
    },
    [editor],
  );

  const handleEmojiSelect = React.useCallback(
    (emoji: string) => {
      ReactEditor.focus(editor);
      if (savedSelection.current) Transforms.select(editor, savedSelection.current);
      Editor.insertText(editor, emoji);
      setOpen(false);
    },
    [editor],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle
              type="button"
              size="sm"
              aria-label="Insert emoji"
              aria-expanded={open}
              pressed={open}
              disabled={disabled || readOnly}
              className="size-8"
              onMouseDown={(event) => event.preventDefault()}
              onPressedChange={handleOpenChange}
            >
              <Smile />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Insert emoji</TooltipContent>
      </Tooltip>
      <PopoverContent
        forceMount={hasOpened || undefined}
        surface="solid"
        motion="none"
        align="start"
        className="w-auto p-0 data-[state=closed]:pointer-events-none data-[state=closed]:invisible"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        {hasOpened ? (
          <React.Suspense
            fallback={
              <div className="flex h-80 w-65 items-center justify-center text-sm text-muted-foreground">
                Loading emoji…
              </div>
            }
          >
            <LazyRichTextEmojiPicker onEmojiSelect={handleEmojiSelect} />
          </React.Suspense>
        ) : null}
      </PopoverContent>
    </Popover>
  );
});

export type RichTextEditorToolbarProps = React.ComponentProps<'div'> & {
  capabilities?: readonly RichTextToolbarCapability[];
};

export function RichTextEditorToolbar({
  capabilities = BASIC_CAPABILITIES,
  className,
  ...props
}: RichTextEditorToolbarProps): React.ReactElement {
  const enabled = React.useMemo(() => new Set(capabilities), [capabilities]);
  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      data-slot="rich-text-editor-toolbar"
      className={cn('flex min-h-10 flex-wrap items-center gap-0.5 border-b border-border/70 px-1.5 py-1', className)}
      {...props}
    >
      {TOOLBAR_CONTROLS.map((control) =>
        enabled.has(control.capability) ? <FormattingControl key={control.capability} control={control} /> : null,
      )}
      {enabled.has('link') ? <LinkControl /> : null}
      {enabled.has('emoji') ? <EmojiControl /> : null}
    </div>
  );
}
