import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Field, FieldDescription, FieldLabel } from '../Field';
import { RichTextEditor } from './RichText';
import type { RichTextValue } from './RichText.types';
import { serializeRichTextToHtml, serializeRichTextToPlainText } from './RichText.utils';
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

const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  args: { value: EMPTY_VALUE, onValueChange: () => undefined },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: () => <EditorExample placeholder="Write an update…" /> };
export const DocumentToolbar: Story = { render: () => <EditorExample toolbar="document" /> };
export const ControlledValue: Story = { render: () => <ControlledExample /> };
export const ExistingPersistedValue: Story = { render: () => <EditorExample initialValue={PERSISTED_VALUE} /> };
export const ReadOnly: Story = { render: () => <RichTextRenderer value={PERSISTED_VALUE} /> };
export const Links: Story = {
  render: () => <EditorExample initialValue={PERSISTED_VALUE} toolbar={['bold', 'italic', 'link']} />,
};
export const FormIntegration: Story = { render: () => <FormExample /> };
export const Serialization: Story = { render: () => <SerializationExample /> };
export const Disabled: Story = {
  render: () => <RichTextEditor value={PERSISTED_VALUE} onValueChange={() => undefined} disabled />,
};
