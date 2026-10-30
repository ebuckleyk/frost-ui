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
  RichTextEditorHandle,
  RichTextEditorInstance,
  RichTextHashtagOptions,
  RichTextMark,
  RichTextTokenOptions,
  RichTextTokenSuggestion,
  RichTextToolbarCapability,
  RichTextToolbarPreset,
  RichTextValue,
} from './RichText.types';
import {
  cloneRichTextValue,
  getActiveLink,
  getRichTextHashtagChange,
  insertRichTextHashtag,
  insertRichTextToken,
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
  updateRichTextToken,
  upsertLink,
  withLinks,
} from './RichText.utils';

const EMPTY_TOKENS: readonly RichTextTokenOptions[] = [];

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
  tokenQuery: string | null;
  tokenSuggestions: RichTextTokenSuggestion[];
  tokenKind?: string;
  tokens: readonly RichTextTokenOptions[];
  suggestionsId: string;
  activeTokenIndex: number;
  linkOpen: boolean;
  linkUrl: string;
  savedSelection: Range | null;
  setLinkOpen: (open: boolean) => void;
  setLinkUrl: (url: string) => void;
  setActiveTokenIndex: (index: number) => void;
  commitToken: (suggestion: RichTextTokenSuggestion) => void;
  closeTokenSuggestions: () => void;
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

type TokenMatch = { query: string; range: Range; kind: string };

function getTokenMatch(
  editor: ReturnType<typeof createEditor>,
  configs: readonly RichTextTokenOptions[],
): TokenMatch | null {
  if (!editor.selection || !Range.isCollapsed(editor.selection)) return null;
  const block = Editor.above(editor, {
    at: editor.selection.anchor,
    match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && Editor.isBlock(editor, node),
  });
  if (!block) return null;

  const cursor = editor.selection.anchor;
  const text = Editor.string(editor, { anchor: Editor.start(editor, block[1]), focus: cursor });
  for (const config of configs) {
    const startIndex = text.lastIndexOf(config.trigger);
    if (startIndex < 0 || (startIndex > 0 && !/\s/u.test(text[startIndex - 1]))) continue;
    const query = text.slice(startIndex + config.trigger.length);
    if (!/^[\p{L}\p{N}_-]*$/u.test(query)) continue;
    const start = Editor.before(editor, cursor, { distance: Array.from(query + config.trigger).length });
    if (start) return { query, range: { anchor: start, focus: cursor }, kind: config.kind };
  }
  return null;
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
  tokens?: readonly RichTextTokenOptions[];
  ref?: React.Ref<RichTextEditorHandle>;
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
  tokens = EMPTY_TOKENS,
  ref,
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
  const suggestionsId = React.useId();
  const lastSelection = React.useRef<ReturnType<typeof Editor.rangeRef> | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const lastValueFingerprint = React.useRef(JSON.stringify(value));
  const previousHashtagValue = React.useRef(cloneRichTextValue(value));
  const [tokenMatch, setTokenMatch] = React.useState<TokenMatch | null>(null);
  const [activeTokenIndex, setActiveTokenIndex] = React.useState(0);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [savedSelection, setSavedSelection] = React.useState<Range | null>(null);
  const isReadOnly = readOnly || disabled;
  const hashtagOptions = hashtags || undefined;
  const onHashtagClick = hashtagOptions?.onHashtagClick;
  const onHashtagsChange = hashtagOptions?.onHashtagsChange;
  const tokenConfigs = React.useMemo(() => {
    const kinds = new Set<string>();
    const triggers = new Set<string>();
    for (const config of tokens) {
      if (
        !config.kind ||
        config.kind === 'hashtag' ||
        kinds.has(config.kind) ||
        Array.from(config.trigger).length !== 1 ||
        /\s/u.test(config.trigger) ||
        triggers.has(config.trigger) ||
        (hashtagOptions && config.trigger === '#')
      ) {
        throw new Error('Token kinds and single-character triggers must be unique; hashtag is reserved.');
      }
      kinds.add(config.kind);
      triggers.add(config.trigger);
    }
    const preset: RichTextTokenOptions[] = hashtagOptions
      ? [
          {
            kind: 'hashtag',
            trigger: '#',
            suggestions: Array.from(
              new Set(
                (hashtagOptions.suggestions ?? [])
                  .map(normalizeRichTextHashtag)
                  .filter((tag): tag is string => Boolean(tag)),
              ),
            ).map((tag) => ({ value: tag, label: `#${tag}` })),
            allowFreeform: hashtagOptions.allowFreeform !== false,
            onSearch: hashtagOptions.onSearch,
          },
        ]
      : [];
    return [...preset, ...tokens];
  }, [tokens, hashtagOptions]);
  const activeConfig = tokenConfigs.find((config) => config.kind === tokenMatch?.kind);
  const tokenSuggestions = React.useMemo(() => {
    if (!tokenMatch || !activeConfig) return [];
    const query = tokenMatch.query.toLocaleLowerCase();
    const suggestions = (activeConfig.suggestions ?? []).filter(
      (item) => item.value.toLocaleLowerCase().startsWith(query) || item.label.toLocaleLowerCase().startsWith(query),
    );
    if (
      activeConfig.allowFreeform &&
      tokenMatch.query &&
      !suggestions.some((item) => item.value.toLocaleLowerCase() === query)
    ) {
      return [
        ...suggestions,
        { value: tokenMatch.query, label: activeConfig.kind === 'hashtag' ? `#${tokenMatch.query}` : tokenMatch.query },
      ];
    }
    return suggestions;
  }, [activeConfig, tokenMatch]);

  React.useImperativeHandle(
    ref,
    () => ({
      insertToken(token) {
        if (isReadOnly || !tokens.some((config) => config.kind === token.kind)) return false;
        if (!editor.selection) Transforms.select(editor, lastSelection.current?.current ?? Editor.end(editor, []));
        setTokenMatch(null);
        return insertRichTextToken(editor, token);
      },
      updateToken(node, data) {
        return !isReadOnly && updateRichTextToken(editor, node, data);
      },
    }),
    [editor, isReadOnly, tokens],
  );
  React.useEffect(
    () => () => {
      lastSelection.current?.unref();
    },
    [],
  );

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
    lastSelection.current?.unref();
    lastSelection.current = null;
    setTokenMatch(null);
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

  const searchQuery = tokenMatch?.query;
  const searchKind = tokenMatch?.kind;
  const onTokenSearch = activeConfig?.onSearch;
  React.useEffect(() => {
    if (searchQuery !== undefined && !isReadOnly) onTokenSearch?.(searchQuery);
  }, [searchQuery, searchKind, onTokenSearch, isReadOnly]);

  const closeTokenSuggestions = React.useCallback(() => {
    setTokenMatch(null);
    setActiveTokenIndex(0);
  }, []);

  const commitToken = React.useCallback(
    (suggestion: RichTextTokenSuggestion) => {
      if (!tokenMatch || !activeConfig || isReadOnly) return;
      Transforms.select(editor, tokenMatch.range);
      Transforms.delete(editor);
      if (activeConfig.kind === 'hashtag') insertRichTextHashtag(editor, suggestion.value);
      else insertRichTextToken(editor, { kind: activeConfig.kind, value: suggestion.value });
      closeTokenSuggestions();
      ReactEditor.focus(editor);
    },
    [closeTokenSuggestions, editor, tokenMatch, activeConfig, isReadOnly],
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
      tokenQuery: activeConfig && !isReadOnly ? (tokenMatch?.query ?? null) : null,
      tokenKind: activeConfig?.kind,
      tokens,
      suggestionsId,
      tokenSuggestions,
      activeTokenIndex,
      linkOpen,
      linkUrl,
      savedSelection,
      setLinkOpen,
      setLinkUrl,
      setActiveTokenIndex,
      commitToken,
      closeTokenSuggestions,
      onHashtagClick,
      openLinkEditor,
    }),
    [
      activeTokenIndex,
      activeConfig,
      tokens,
      suggestionsId,
      closeTokenSuggestions,
      commitToken,
      disabled,
      editor,
      tokenMatch,
      tokenSuggestions,
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
      if (editor.selection) {
        lastSelection.current?.unref();
        lastSelection.current = Editor.rangeRef(editor, editor.selection);
      }
      setTokenMatch(!isReadOnly ? getTokenMatch(editor, tokenConfigs) : null);
      setActiveTokenIndex(0);
      if (!editor.operations.some((operation) => operation.type !== 'set_selection')) return;
      const canonicalValue = cloneRichTextValue(nextValue as RichTextValue);
      lastValueFingerprint.current = JSON.stringify(canonicalValue);
      onValueChange(canonicalValue);
    },
    [editor, tokenConfigs, isReadOnly, onValueChange],
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
            {tokenConfigs.length > 0 ? <RichTextTokenSuggestions /> : null}
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
    activeTokenIndex,
    closeTokenSuggestions,
    commitToken,
    disabled,
    tokenQuery,
    tokenSuggestions,
    tokens,
    suggestionsId,
    onHashtagClick,
    openLinkEditor,
    readOnly,
    setActiveTokenIndex,
  } = useRichTextEditorContext();
  const renderElement = React.useCallback(
    (renderProps: Parameters<typeof renderRichTextElement>[0]) =>
      renderRichTextElement(
        renderProps,
        onHashtagClick,
        tokens,
        (node) => {
          if (readOnly) return;
          const path = ReactEditor.findPath(editor, node);
          Transforms.removeNodes(editor, { at: path });
          ReactEditor.focus(editor);
        },
        disabled,
      ),
    [onHashtagClick, tokens, editor, readOnly, disabled],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || readOnly || event.nativeEvent.isComposing) return;

      if (tokenQuery !== null) {
        if (event.key === 'ArrowDown' && tokenSuggestions.length > 0) {
          event.preventDefault();
          setActiveTokenIndex((activeTokenIndex + 1) % tokenSuggestions.length);
          return;
        }
        if (event.key === 'ArrowUp' && tokenSuggestions.length > 0) {
          event.preventDefault();
          setActiveTokenIndex((activeTokenIndex - 1 + tokenSuggestions.length) % tokenSuggestions.length);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeTokenSuggestions();
          return;
        }
        if (
          (event.key === 'Enter' || event.key === 'Tab') &&
          tokenSuggestions[Math.min(activeTokenIndex, tokenSuggestions.length - 1)]
        ) {
          event.preventDefault();
          commitToken(tokenSuggestions[Math.min(activeTokenIndex, tokenSuggestions.length - 1)]);
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
      activeTokenIndex,
      closeTokenSuggestions,
      commitToken,
      editor,
      tokenQuery,
      tokenSuggestions,
      onKeyDown,
      openLinkEditor,
      readOnly,
      setActiveTokenIndex,
    ],
  );

  return (
    <Editable
      {...props}
      role="textbox"
      readOnly={readOnly}
      aria-disabled={disabled || undefined}
      aria-controls={tokenQuery !== null && tokenSuggestions.length ? suggestionsId : undefined}
      aria-activedescendant={
        tokenQuery !== null && tokenSuggestions.length
          ? `${suggestionsId}-${Math.min(activeTokenIndex, tokenSuggestions.length - 1)}`
          : undefined
      }
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

function RichTextTokenSuggestions(): React.ReactElement | null {
  const { activeTokenIndex, commitToken, tokenQuery, tokenKind, tokenSuggestions, setActiveTokenIndex, suggestionsId } =
    useRichTextEditorContext();
  if (tokenQuery === null) return null;

  if (tokenSuggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      id={suggestionsId}
      aria-label={tokenKind === 'hashtag' ? 'Hashtag suggestions' : 'Token suggestions'}
      className="border-t border-border/70 bg-popover p-1 text-popover-foreground"
    >
      {tokenSuggestions.map((suggestion, index) => (
        <button
          key={suggestion.value}
          id={`${suggestionsId}-${index}`}
          tabIndex={-1}
          type="button"
          role="option"
          aria-selected={index === Math.min(activeTokenIndex, tokenSuggestions.length - 1)}
          className={cn(
            'flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none',
            index === Math.min(activeTokenIndex, tokenSuggestions.length - 1) && 'bg-accent text-accent-foreground',
          )}
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => setActiveTokenIndex(index)}
          onClick={() => commitToken(suggestion)}
        >
          <span>
            {suggestion.label}
            {suggestion.description ? ` — ${suggestion.description}` : ''}
            {suggestion.group ? ` (${suggestion.group})` : ''}
          </span>
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
