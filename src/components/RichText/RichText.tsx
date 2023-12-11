import * as React from 'react';
import { Toggle } from '@/components';
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  QuoteIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';
import isHotkey from 'is-hotkey';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, ListOrdered } from 'lucide-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useSlate, withReact } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

import { createContextScope, Scope } from '@/lib/createContext';
import { cn } from '@/lib/utils';

import * as richTextUtils from './RichText.utils';

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

enum TOOLBAR_OPTION {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  CODE = 'code',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  BULLETED_LIST = 'bulleted-list',
  NUMBERED_LIST = 'numbered-list',
  ALIGN_LEFT = 'left',
  ALIGN_RIGHT = 'right',
  ALIGN_CENTER = 'center',
  ALIGN_JUSTIFY = 'justify',
  BLOCK_QUOTE = 'block-quote',
}

type ToolbarOption = {
  option: TOOLBAR_OPTION;
  icon: React.ComponentType;
  isMark?: boolean;
};

const FORMAT_GROUP: ToolbarOption[] = [
  { option: TOOLBAR_OPTION.BOLD, icon: FontBoldIcon, isMark: true },
  { option: TOOLBAR_OPTION.ITALIC, icon: FontItalicIcon, isMark: true },
  { option: TOOLBAR_OPTION.UNDERLINE, icon: UnderlineIcon, isMark: true },
  { option: TOOLBAR_OPTION.CODE, icon: CodeIcon, isMark: true },
  { option: TOOLBAR_OPTION.BLOCK_QUOTE, icon: QuoteIcon },
];
const HEADINGS_GROUP: ToolbarOption[] = [
  { option: TOOLBAR_OPTION.H1, icon: Heading1 },
  { option: TOOLBAR_OPTION.H2, icon: Heading2 },
  { option: TOOLBAR_OPTION.H3, icon: Heading3 },
  { option: TOOLBAR_OPTION.H4, icon: Heading4 },
  { option: TOOLBAR_OPTION.H5, icon: Heading5 },
  { option: TOOLBAR_OPTION.H6, icon: Heading6 },
];

const ALIGNMENT_GROUP: ToolbarOption[] = [
  { option: TOOLBAR_OPTION.BULLETED_LIST, icon: List },
  { option: TOOLBAR_OPTION.NUMBERED_LIST, icon: ListOrdered },
  { option: TOOLBAR_OPTION.ALIGN_LEFT, icon: TextAlignLeftIcon },
  { option: TOOLBAR_OPTION.ALIGN_CENTER, icon: TextAlignCenterIcon },
  { option: TOOLBAR_OPTION.ALIGN_RIGHT, icon: TextAlignRightIcon },
  { option: TOOLBAR_OPTION.ALIGN_JUSTIFY, icon: TextAlignJustifyIcon },
];

/**
 * RichText
 */
const RICHTEXT_NAME = 'RichText';
type ScopedProps<P> = P & { __scopeRichText?: Scope };
const [createRichTextContext, createRichTextScope] = createContextScope(RICHTEXT_NAME);

export type RichTextValue = Descendant;
type RichTextProps = React.PropsWithChildren<
  Pick<
    EditableProps,
    | 'onFocus'
    | 'onBlur'
    | 'className'
    | 'readOnly'
    | 'spellCheck'
    | 'autoFocus'
    | 'placeholder'
    | 'autoCorrect'
    | 'value'
  > & {
    onChange?: ((value: RichTextValue[]) => void) | undefined;
  }
>;

type RichTextContextValue = Pick<
  RichTextProps,
  'placeholder' | 'spellCheck' | 'readOnly' | 'autoFocus' | 'autoCorrect' | 'onBlur' | 'onFocus'
>;

const [RichTextProvider, useRichTextContext] = createRichTextContext<RichTextContextValue>(RICHTEXT_NAME);
const SLATE_INIT_VALUE = [{ type: 'paragraph', children: [{ text: '' }] }] satisfies Descendant[];

const RichText: React.FC<RichTextProps> = (props: ScopedProps<RichTextProps>) => {
  const { __scopeRichText, children, onChange, ...rest } = props;
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <RichTextProvider scope={__scopeRichText} {...rest}>
      <Slate editor={editor} initialValue={SLATE_INIT_VALUE} onChange={onChange}>
        {children}
      </Slate>
    </RichTextProvider>
  );
};

RichText.displayName = RICHTEXT_NAME;

/**
 * RichTextArea
 */
const RICHTEXTAREA_NAME = 'RichTextArea';

type RichTextAreaProps = React.HtmlHTMLAttributes<HTMLDivElement>;
const RichTextArea: React.FC<RichTextAreaProps> = (props: ScopedProps<RichTextAreaProps>) => {
  const { __scopeRichText, className } = props;
  const context = useRichTextContext(RICHTEXTAREA_NAME, __scopeRichText);
  const editor = useSlate();

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const hotKey in HOTKEYS) {
        if (isHotkey(hotKey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotKey];
          richTextUtils.toggleMark(editor, mark);
        }
      }
    },
    [editor],
  );
  return (
    <Editable
      {...context}
      onFocus={context.onFocus}
      onBlur={context.onBlur}
      data-slate-editor={'richtext-editor'}
      role="textbox"
      className={cn(
        'border border-primary/20 bg-secondary/40 rounded p-4 focus:border-secondary-foreground richtext-editor',
        className,
      )}
      onKeyDown={onKeyDown}
      renderElement={richTextUtils.renderElement}
      renderLeaf={richTextUtils.renderLeaf}
      renderPlaceholder={richTextUtils.renderPlaceholder}
    />
  );
};
RichTextArea.displayName = RICHTEXTAREA_NAME;

/**
 * RichTextToolbar
 */
const RICHTEXTTOOLBAR_NAME = 'RichTextToolbar';
type ToolbarOptions = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  'bulleted-list'?: boolean;
  'numbered-list'?: boolean;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  justify?: boolean;
  'block-quote'?: boolean;
};
type RichTextToolbarProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  toolbar?: ToolbarOptions;
};

type ToolbarOptionProps = {
  format: string;
  Icon: React.ComponentType<React.HtmlHTMLAttributes<HTMLDivElement>>;
};

const BlockButton = ({ format, Icon }: ToolbarOptionProps) => {
  const editor = useSlate();
  const isActive = richTextUtils.isBlockActive(editor, format);
  const toggleBlock = React.useCallback(() => {
    richTextUtils.toggleBlock(editor, format);
  }, [editor, format]);
  return (
    <Toggle aria-label={format} pressed={isActive} onPressedChange={toggleBlock} variant={'outline'}>
      <Icon className="h-3 w-3" />
    </Toggle>
  );
};

const MarkButton = ({ format, Icon }: ToolbarOptionProps) => {
  const editor = useSlate();
  const isActive = richTextUtils.isMarkActive(editor, format);
  const toggleMark = React.useCallback(() => {
    richTextUtils.toggleMark(editor, format);
  }, [editor, format]);
  return (
    <Toggle aria-label={format} pressed={isActive} onPressedChange={toggleMark} variant={'outline'}>
      <Icon className="h-3 w-3" />
    </Toggle>
  );
};

const DEFAULT_TOOLBAR_CONFIG: ToolbarOptions = {
  [TOOLBAR_OPTION.BOLD]: true,
  [TOOLBAR_OPTION.ITALIC]: true,
  [TOOLBAR_OPTION.UNDERLINE]: true,
  [TOOLBAR_OPTION.CODE]: true,
  [TOOLBAR_OPTION.H1]: true,
  [TOOLBAR_OPTION.H2]: true,
  [TOOLBAR_OPTION.H3]: true,
  [TOOLBAR_OPTION.H4]: true,
  [TOOLBAR_OPTION.H5]: true,
  [TOOLBAR_OPTION.H6]: true,
  [TOOLBAR_OPTION.BULLETED_LIST]: true,
  [TOOLBAR_OPTION.NUMBERED_LIST]: true,
  [TOOLBAR_OPTION.ALIGN_LEFT]: true,
  [TOOLBAR_OPTION.ALIGN_RIGHT]: true,
  [TOOLBAR_OPTION.ALIGN_CENTER]: true,
  [TOOLBAR_OPTION.ALIGN_JUSTIFY]: true,
  [TOOLBAR_OPTION.BLOCK_QUOTE]: true,
};

const RichTextToolbar: React.FC<RichTextToolbarProps> = (props: ScopedProps<RichTextToolbarProps>) => {
  const { className, toolbar = DEFAULT_TOOLBAR_CONFIG } = props;
  return (
    <div className={cn('rounded gap-1', className)}>
      {[FORMAT_GROUP, HEADINGS_GROUP, ALIGNMENT_GROUP].map((group) => {
        return group.map((g, k) => {
          const enabled = toolbar[g.option];
          if (!enabled) return <></>;

          return g.isMark ? (
            <MarkButton key={k} Icon={g.icon} format={g.option} />
          ) : (
            <BlockButton key={k} Icon={g.icon} format={g.option} />
          );
        });
      })}
    </div>
  );
};

RichTextToolbar.displayName = RICHTEXTTOOLBAR_NAME;

export { RichText, RichTextArea, RichTextToolbar, createRichTextScope };
