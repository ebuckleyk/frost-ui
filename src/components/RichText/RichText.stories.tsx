import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { Button } from '../Button';
import { Field, FieldDescription, FieldLabel } from '../Field';
import { RichTextEditor, RichTextEditorContent, RichTextEditorToolbar } from './RichText';
import type { RichTextValue } from './RichText.types';
import { getRichTextHashtags, serializeRichTextToHtml, serializeRichTextToPlainText } from './RichText.utils';
import { RichTextRenderer } from './RichTextRenderer';

const EMPTY_VALUE: RichTextValue = [{ type: 'paragraph', children: [{ text: '' }] }];
const PERSISTED_VALUE: RichTextValue = [
  { type: 'heading-2', children: [{ text: 'A persisted document' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'This value was loaded from application state. Visit ' },
      { type: 'link', url: 'https://example.com', children: [{ text: 'Example' }] },
      { text: ' for details.' },
    ],
  },
  { type: 'bulleted-list', children: [{ type: 'list-item', children: [{ text: 'Existing list item', bold: true }] }] },
];

const BASIC_SOURCE = `import * as React from 'react';
import { EMPTY_RICH_TEXT_VALUE, RichTextEditor, type RichTextValue } from '@ebuckleyk/frost-ui';

export function CommentEditor() {
  const [value, setValue] = React.useState<RichTextValue>(EMPTY_RICH_TEXT_VALUE);

  return (
    <RichTextEditor
      value={value}
      onValueChange={setValue}
      placeholder="Write an update..."
      aria-label="Update"
    />
  );
}`;

const HASHTAGS_SOURCE = `import * as React from 'react';
import {
  EMPTY_RICH_TEXT_VALUE,
  getRichTextHashtags,
  RichTextEditor,
  type RichTextValue,
} from '@ebuckleyk/frost-ui';

export function HashtagEditor() {
  const [value, setValue] = React.useState<RichTextValue>(EMPTY_RICH_TEXT_VALUE);
  const summary = getRichTextHashtags(value);

  return (
    <>
      <RichTextEditor
        value={value}
        onValueChange={setValue}
        hashtags={{
          suggestions: ['design', 'engineering', 'product', 'react'],
          allowFreeform: true,
          onSearch: (query) => console.log('Search:', query),
          onHashtagClick: (tag) => console.log('Selected:', tag),
          onHashtagsChange: ({ values, added, removed }) => {
            console.log({ values, added, removed });
          },
        }}
      />
      <p>{summary.totalCount} hashtags, {summary.uniqueCount} unique</p>
    </>
  );
}`;

const SERIALIZATION_SOURCE = `import {
  deserializeRichTextFromHtml,
  getRichTextHashtags,
  serializeRichTextToHtml,
  serializeRichTextToPlainText,
  type RichTextValue,
} from '@ebuckleyk/frost-ui';

const html = serializeRichTextToHtml(value);
const plainText = serializeRichTextToPlainText(value);
const hashtags = getRichTextHashtags(value);

localStorage.setItem('document', JSON.stringify(value));
const restored = JSON.parse(localStorage.getItem('document') ?? '[]') as RichTextValue;

// Trusted HTML can be converted back into a sanitized Frost document.
const imported = deserializeRichTextFromHtml(html);`;

const FORM_SOURCE = `const [body, setBody] = React.useState<RichTextValue>(EMPTY_RICH_TEXT_VALUE);

<form onSubmit={handleSubmit}>
  <Field>
    <FieldLabel htmlFor="body">Body</FieldLabel>
    <RichTextEditor
      id="body"
      name="body"
      value={body}
      onValueChange={setBody}
      aria-label="Body"
    />
    <FieldDescription>
      The hidden form value contains the canonical JSON document.
    </FieldDescription>
  </Field>
  <Button type="submit">Submit</Button>
</form>`;

function EditorExample({ initialValue = EMPTY_VALUE, ...props }: Partial<React.ComponentProps<typeof RichTextEditor>>) {
  const [value, setValue] = React.useState(initialValue);
  return <RichTextEditor {...props} value={value} onValueChange={setValue} />;
}

function ControlledExample() {
  const [value, setValue] = React.useState<RichTextValue>([
    { type: 'paragraph', children: [{ text: 'Edit this value.' }] },
  ]);
  return (
    <div className="space-y-3">
      <RichTextEditor value={value} onValueChange={setValue} />
      <Button type="button" variant="outline" onClick={() => setValue(EMPTY_VALUE)}>
        Reset externally
      </Button>
      <pre className="max-h-48 overflow-auto rounded-md border p-3 text-xs">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

function FormExample() {
  const [value, setValue] = React.useState(EMPTY_VALUE);
  const [submitted, setSubmitted] = React.useState('');
  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).get('body')?.toString() ?? '');
      }}
    >
      <Field>
        <FieldLabel htmlFor="story-body">Body</FieldLabel>
        <RichTextEditor id="story-body" name="body" value={value} onValueChange={setValue} aria-label="Body" />
        <FieldDescription>The hidden form value is the canonical JSON document.</FieldDescription>
      </Field>
      <Button type="submit">Submit</Button>
      {submitted ? <output className="block text-xs">Submitted {submitted.length} characters</output> : null}
    </form>
  );
}

function SerializationExample() {
  const [value, setValue] = React.useState(PERSISTED_VALUE);
  return (
    <div className="space-y-4">
      <RichTextEditor value={value} onValueChange={setValue} toolbar="document" />
      <div className="grid gap-3 md:grid-cols-2">
        <pre className="overflow-auto rounded-md border p-3 text-xs">{serializeRichTextToHtml(value)}</pre>
        <pre className="overflow-auto rounded-md border p-3 text-xs">{serializeRichTextToPlainText(value)}</pre>
      </div>
    </div>
  );
}

function HashtagsExample() {
  const [value, setValue] = React.useState<RichTextValue>([
    { type: 'paragraph', children: [{ text: 'Share an update about ' }] },
  ]);
  const [selected, setSelected] = React.useState<string>();
  const summary = getRichTextHashtags(value);
  return (
    <div className="space-y-3">
      <RichTextEditor
        value={value}
        onValueChange={setValue}
        hashtags={{
          suggestions: ['design', 'engineering', 'product', 'research', 'react'],
          onHashtagClick: setSelected,
        }}
        placeholder="Type # to add a hashtag"
      />
      <p className="text-sm text-muted-foreground">
        {summary.totalCount} hashtags, {summary.uniqueCount} unique{selected ? `; selected #${selected}` : ''}
      </p>
    </div>
  );
}

function ActiveFormattingExample() {
  const [value, setValue] = React.useState<RichTextValue>([
    { type: 'paragraph', children: [{ text: 'Bold formatting is active.', bold: true }] },
  ]);
  return (
    <RichTextEditor value={value} onValueChange={setValue} toolbar="document">
      <RichTextEditorToolbar />
      <SelectBoldText />
      <RichTextEditorContent />
    </RichTextEditor>
  );
}

function SelectBoldText() {
  const editor = useSlate();
  React.useEffect(() => {
    Transforms.select(editor, { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 4 } });
  }, [editor]);
  return null;
}

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  args: { value: EMPTY_VALUE, onValueChange: () => undefined },
  parameters: {
    docs: {
      description: {
        component: `A controlled Slate-based editor with formatting, links, structured hashtags, safe serialization, and read-only rendering.

Store the serializable \`RichTextValue\` in application state and pass every update back through \`value\`. Use \`toolbar="document"\` for the full formatting set or provide an explicit capability array. Hashtags are opt-in inline nodes: type \`#\`, filter with the keyboard, and commit with Enter, Tab, or a pointer. Arrow keys move through suggestions and Escape closes them.

The canonical JSON value is the persistence format. Use \`serializeRichTextToHtml\` or \`serializeRichTextToPlainText\` at output boundaries, \`RichTextRenderer\` for read-only display, and \`getRichTextHashtags\` for occurrence and unique counts. \`onHashtagsChange\` reports complete, added, and removed hashtag occurrences.`,
      },
    },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <EditorExample placeholder="Write an update…" />,
  parameters: {
    docs: {
      description: { story: 'Keep the controlled `RichTextValue` in application state and apply every update.' },
      source: { code: BASIC_SOURCE, language: 'tsx' },
    },
  },
};
export const DocumentToolbar: Story = {
  render: () => <EditorExample toolbar="document" />,
  parameters: {
    docs: {
      description: {
        story:
          'The `document` preset adds headings, block quotes, code, lists, links, and alignment. The default `basic` preset remains compact.',
      },
      source: {
        code: '<RichTextEditor value={value} onValueChange={setValue} toolbar="document" />',
        language: 'tsx',
      },
    },
  },
};
export const ActiveFormatting: Story = {
  render: () => <ActiveFormattingExample />,
  parameters: {
    docs: {
      description: {
        story: 'Bold is selected on load so the toolbar exposes the standard primary Toggle selected state.',
      },
    },
  },
};
export const ControlledValue: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          'External value replacements are reflected immediately, supporting resets and asynchronously loaded records.',
      },
      source: { code: BASIC_SOURCE, language: 'tsx' },
    },
  },
};
export const ExistingPersistedValue: Story = {
  render: () => <EditorExample initialValue={PERSISTED_VALUE} />,
  parameters: {
    docs: {
      description: { story: 'Canonical JSON preserves blocks, formatting marks, links, and structured hashtags.' },
      source: {
        code: `const persisted: RichTextValue = [
  { type: 'heading-2', children: [{ text: 'A persisted document' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'Visit ' },
      { type: 'link', url: 'https://example.com', children: [{ text: 'Example' }] },
      { text: ' or browse ' },
      { type: 'hashtag', tag: 'engineering', children: [{ text: '' }] },
    ],
  },
];

<RichTextEditor value={persisted} onValueChange={setValue} />`,
        language: 'tsx',
      },
    },
  },
};
export const ReadOnly: Story = {
  render: () => <RichTextRenderer value={PERSISTED_VALUE} />,
  parameters: {
    docs: {
      description: { story: '`RichTextRenderer` displays canonical documents without mounting editing controls.' },
      source: {
        code: `<RichTextRenderer
  value={value}
  onHashtagClick={(tag) => navigate(\`/topics/\${tag}\`)}
/>`,
        language: 'tsx',
      },
    },
  },
};
export const Links: Story = {
  render: () => <EditorExample initialValue={PERSISTED_VALUE} toolbar={['bold', 'italic', 'link']} />,
  parameters: {
    docs: {
      description: { story: 'Capability arrays expose only the formatting controls an application needs.' },
      source: {
        code: `<RichTextEditor
  value={value}
  onValueChange={setValue}
  toolbar={['bold', 'italic', 'link']}
/>`,
        language: 'tsx',
      },
    },
  },
};
export const Hashtags: Story = {
  render: () => <HashtagsExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Hashtags are structured inline nodes. Suggestions, freeform entry, search, click handling, and change summaries are independently configurable.',
      },
      source: { code: HASHTAGS_SOURCE, language: 'tsx' },
    },
  },
};
export const FormIntegration: Story = {
  render: () => <FormExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Providing `name` adds hidden form data containing the canonical JSON document. Disabled editors omit it.',
      },
      source: { code: FORM_SOURCE, language: 'tsx' },
    },
  },
};
export const Serialization: Story = {
  render: () => <SerializationExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Serialize at system boundaries. Keep `RichTextValue` as the source of truth so formatting and hashtag metadata are retained.',
      },
      source: { code: SERIALIZATION_SOURCE, language: 'tsx' },
    },
  },
};
export const Disabled: Story = {
  render: () => <RichTextEditor value={PERSISTED_VALUE} onValueChange={() => undefined} disabled />,
  parameters: {
    docs: {
      description: { story: 'Disabled editors block editing and formatting controls and disable hidden form fields.' },
      source: {
        code: '<RichTextEditor value={value} onValueChange={setValue} disabled />',
        language: 'tsx',
      },
    },
  },
};
