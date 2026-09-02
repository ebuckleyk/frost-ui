import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { TagsInput, type TagsInputProps } from './TagsInput';

function ControlledTagsInput(props: Partial<TagsInputProps> = {}) {
  const [value, setValue] = React.useState(props.value ?? []);
  return <TagsInput {...props} value={value} onValueChange={setValue} />;
}

describe('TagsInput', () => {
  it('adds freeform tags with Enter and comma', () => {
    render(<ControlledTagsInput />);
    const input = screen.getByRole('combobox', { name: 'Tags' });

    fireEvent.change(input, { target: { value: 'Podcast' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Podcast')).toBeVisible();

    fireEvent.change(input, { target: { value: 'Audio' } });
    fireEvent.keyDown(input, { key: ',' });
    expect(screen.getByText('Audio')).toBeVisible();
  });

  it('removes tags with the chip button and empty-input Backspace', () => {
    render(<ControlledTagsInput value={['Podcast', 'Audio']} />);
    const input = screen.getByRole('combobox', { name: 'Tags' });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Podcast' }));
    expect(screen.queryByText('Podcast')).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(screen.queryByText('Audio')).not.toBeInTheDocument();
  });

  it('normalizes before preventing duplicates', () => {
    const rejected = vi.fn();
    render(
      <ControlledTagsInput
        value={['podcast']}
        normalizeTag={(tag) => tag.trim().toLowerCase()}
        onTagRejected={rejected}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tags' });
    fireEvent.change(input, { target: { value: ' Podcast ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getAllByText('podcast')).toHaveLength(1);
    expect(rejected).toHaveBeenCalledWith({ value: 'podcast', reason: 'duplicate', message: undefined });
  });

  it('rejects invalid tags and reports validation feedback', () => {
    const rejected = vi.fn();
    render(
      <ControlledTagsInput
        validateTag={(tag) => (tag.length >= 3 ? true : 'Use at least three characters.')}
        onTagRejected={rejected}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Tags' });
    fireEvent.change(input, { target: { value: 'UI' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.queryByText('UI')).not.toBeInTheDocument();
    expect(rejected).toHaveBeenCalledWith({
      value: 'UI',
      reason: 'invalid',
      message: 'Use at least three characters.',
    });
  });

  it('enforces maxTags without discarding existing tags', () => {
    const rejected = vi.fn();
    render(<ControlledTagsInput value={['One']} maxTags={1} onTagRejected={rejected} />);
    const input = screen.getByRole('combobox', { name: 'Tags' });
    fireEvent.change(input, { target: { value: 'Two' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('One')).toBeVisible();
    expect(screen.queryByText('Two')).not.toBeInTheDocument();
    expect(rejected).toHaveBeenCalledWith({ value: 'Two', reason: 'max-tags', message: undefined });
  });

  it('adds multiple pasted comma and newline-delimited values', () => {
    render(<ControlledTagsInput />);
    const input = screen.getByRole('combobox', { name: 'Tags' });
    fireEvent.paste(input, { clipboardData: { getData: () => 'Podcast,Audio\nNews' } });

    expect(screen.getByText('Podcast')).toBeVisible();
    expect(screen.getByText('Audio')).toBeVisible();
    expect(screen.getByText('News')).toBeVisible();
  });

  it('supports suggestions while preserving freeform entry', async () => {
    render(<ControlledTagsInput suggestions={['Podcast', 'Music']} />);
    const input = screen.getByRole('combobox', { name: 'Tags' });
    fireEvent.change(input, { target: { value: 'Pod' } });
    expect(await screen.findByRole('option', { name: 'Podcast' })).toBeVisible();
    fireEvent.click(screen.getByRole('option', { name: 'Podcast' }));
    expect(screen.getByText('Podcast')).toBeVisible();

    fireEvent.change(input, { target: { value: 'Original' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Original')).toBeVisible();
  });

  it('honors disabled and read-only behavior', () => {
    const { rerender } = render(<ControlledTagsInput value={['Podcast']} disabled />);
    expect(screen.getByRole('combobox', { name: 'Tags' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Remove Podcast' })).not.toBeInTheDocument();

    rerender(<ControlledTagsInput value={['Podcast']} readOnly />);
    expect(screen.getByRole('combobox', { name: 'Tags' })).toHaveAttribute('aria-readonly', 'true');
    expect(screen.queryByRole('button', { name: 'Remove Podcast' })).not.toBeInTheDocument();
  });

  it('reflects controlled external value changes', () => {
    const { rerender } = render(<TagsInput value={['First']} onValueChange={vi.fn()} />);
    expect(screen.getByText('First')).toBeVisible();
    rerender(<TagsInput value={['Replacement']} onValueChange={vi.fn()} />);
    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.getByText('Replacement')).toBeVisible();
  });
});
