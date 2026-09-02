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
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, ListOrdered, Unlink } from 'lucide-react';
import { createEditor, Editor, Transforms, type Descendant, type Range } from 'slate';
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
  RichTextMark,
  RichTextToolbarCapability,
  RichTextToolbarPreset,
  RichTextValue,
} from './RichText.types';
import {
  cloneRichTextValue,
  getActiveLink,
  isBlockActive,
  isMarkActive,
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

type RichTextEditorContextValue = {
  disabled: boolean;
  readOnly: boolean;
  linkOpen: boolean;
  linkUrl: string;
  savedSelection: Range | null;
  setLinkOpen: (open: boolean) => void;
  setLinkUrl: (url: string) => void;
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

export type RichTextEditorProps = {
  value: RichTextValue;
  onValueChange: (value: RichTextValue) => void;
  toolbar?: RichTextToolbarPreset | readonly RichTextToolbarCapability[] | false;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  id?: string;
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
  const lastValueFingerprint = React.useRef(JSON.stringify(value));
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [savedSelection, setSavedSelection] = React.useState<Range | null>(null);
  const isReadOnly = readOnly || disabled;

  React.useEffect(() => {
    const fingerprint = JSON.stringify(value);
    if (fingerprint === lastValueFingerprint.current) return;
    lastValueFingerprint.current = fingerprint;
    editor.children = cloneRichTextValue(value) as Descendant[];
    editor.selection = null;
    editor.history = { undos: [], redos: [] };
    editor.onChange();
  }, [editor, value]);

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
      disabled,
      readOnly: isReadOnly,
      linkOpen,
      linkUrl,
      savedSelection,
      setLinkOpen,
      setLinkUrl,
      openLinkEditor,
    }),
    [disabled, isReadOnly, linkOpen, linkUrl, openLinkEditor, savedSelection],
  );

  const handleChange = React.useCallback(
    (nextValue: Descendant[]) => {
      if (!editor.operations.some((operation) => operation.type !== 'set_selection')) return;
      const canonicalValue = cloneRichTextValue(nextValue as RichTextValue);
      lastValueFingerprint.current = JSON.stringify(canonicalValue);
      onValueChange(canonicalValue);
    },
    [editor, onValueChange],
  );

  return (
    <div
      data-slot="rich-text-editor"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        `
          input-glass overflow-hidden rounded-md border border-input
          bg-transparent bg-clip-padding text-sm transition-[border-color,box-shadow]
          focus-within:border-ring focus-within:ring-[3px]
          focus-within:ring-ring/50
          data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50
          dark:bg-input/30
        `,
        invalid && 'border-destructive ring-[3px] ring-destructive/20 dark:ring-destructive/40',
        className,
      )}
    >
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
        </RichTextEditorContext.Provider>
      </Slate>
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} disabled={disabled} />}
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
  const { disabled, readOnly, openLinkEditor } = useRichTextEditorContext();

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || readOnly) return;

      const shortcut = getRichTextShortcut(event);
      if (shortcut && shortcut !== 'link') {
        event.preventDefault();
        toggleMark(editor, shortcut);
      } else if (shortcut === 'link') {
        event.preventDefault();
        openLinkEditor();
      }
    },
    [editor, onKeyDown, openLinkEditor, readOnly],
  );

  return (
    <Editable
      {...props}
      role="textbox"
      readOnly={readOnly}
      aria-disabled={disabled || undefined}
      renderElement={renderRichTextElement}
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
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={label}
              aria-pressed={active}
              disabled={disabled || readOnly}
              className="size-8"
              onMouseDown={(event) => event.preventDefault()}
              onClick={openLinkEditor}
            >
              <Link1Icon />
            </Button>
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
    </div>
  );
}
