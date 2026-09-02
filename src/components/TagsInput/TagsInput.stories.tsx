import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { Field, FieldDescription, FieldLabel } from '../Field';
import { TagsInput, type TagsInputProps, type TagsInputRejection } from './TagsInput';

function TagsExample({ initialValue = [], ...props }: Partial<TagsInputProps> & { initialValue?: string[] }) {
  const [value, setValue] = React.useState(initialValue);
  return <TagsInput {...props} value={value} onValueChange={setValue} />;
}

function ControlledExample() {
  const [value, setValue] = React.useState(['Podcast']);
  return (
    <div className="space-y-3">
      <TagsInput value={value} onValueChange={setValue} />
      <Button type="button" variant="outline" onClick={() => setValue(['Replacement'])}>
        Replace externally
      </Button>
      <output className="block text-sm">{value.join(', ')}</output>
    </div>
  );
}

function ValidationExample() {
  const [value, setValue] = React.useState<string[]>([]);
  const [rejection, setRejection] = React.useState<TagsInputRejection>();
  return (
    <Field data-invalid={rejection?.reason === 'invalid'}>
      <FieldLabel htmlFor="validated-tags">Keywords</FieldLabel>
      <TagsInput
        id="validated-tags"
        value={value}
        onValueChange={setValue}
        validateTag={(tag) => (tag.length >= 3 ? true : 'Use at least three characters.')}
        onTagRejected={setRejection}
        invalid={rejection?.reason === 'invalid'}
        aria-describedby="tag-feedback"
      />
      <FieldDescription id="tag-feedback">
        {rejection?.message ?? 'Each keyword must be at least three characters.'}
      </FieldDescription>
    </Field>
  );
}

function MaximumExample() {
  const [rejection, setRejection] = React.useState<TagsInputRejection>();
  return (
    <div className="space-y-2">
      <TagsExample initialValue={['Podcast', 'Audio']} maxTags={3} onTagRejected={setRejection} />
      <p className="text-sm text-muted-foreground">
        {rejection?.reason === 'max-tags' ? 'Maximum of three tags reached.' : 'Up to three tags.'}
      </p>
    </div>
  );
}

function FormExample() {
  const [value, setValue] = React.useState(['Podcast']);
  const [submitted, setSubmitted] = React.useState('');
  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).getAll('tags').join(', '));
      }}
    >
      <Field>
        <FieldLabel htmlFor="form-tags">Tags</FieldLabel>
        <TagsInput id="form-tags" name="tags" value={value} onValueChange={setValue} />
      </Field>
      <Button type="submit">Submit</Button>
      {submitted ? <output className="block text-sm">Submitted: {submitted}</output> : null}
    </form>
  );
}

const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
  args: { value: [], onValueChange: () => undefined },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicFreeformTags: Story = { render: () => <TagsExample placeholder="Add keywords" /> };
export const Controlled: Story = { render: () => <ControlledExample /> };
export const Suggestions: Story = {
  render: () => <TagsExample suggestions={['Podcast', 'Audio', 'Interview', 'News']} />,
};
export const Validation: Story = { render: () => <ValidationExample /> };
export const MaximumTags: Story = { render: () => <MaximumExample /> };
export const CustomNormalization: Story = {
  render: () => (
    <TagsExample
      normalizeTag={(tag) => tag.replace(/^#/, '').trim()}
      renderTag={(tag) => `#${tag}`}
      placeholder="Add a topic"
    />
  ),
};
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="space-y-3">
      <TagsInput value={['Podcast', 'Audio']} onValueChange={() => undefined} disabled />
      <TagsInput value={['Podcast', 'Audio']} onValueChange={() => undefined} readOnly />
    </div>
  ),
};
export const FormIntegration: Story = { render: () => <FormExample /> };
