import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { FileDrop, FileDropArea, FileDropAreaText, FileDropFileArea, type FileWithServerId } from './FileDrop';

type ControlledFileDropProps = {
  accept?: React.ComponentProps<typeof FileDrop>['accept'];
  disabled?: boolean;
  initialFiles?: FileWithServerId[];
  onChange?: (files: FileWithServerId[]) => void;
  onDropRejected?: React.ComponentProps<typeof FileDrop>['onDropRejected'];
};

function ControlledFileDrop({
  accept,
  disabled,
  initialFiles = [],
  onChange = () => undefined,
  onDropRejected,
}: ControlledFileDropProps) {
  const [files, setFiles] = React.useState<FileWithServerId[]>(initialFiles);

  const handleChange = React.useCallback(
    (nextFiles: FileWithServerId[]) => {
      onChange(nextFiles);
      setFiles(nextFiles);
    },
    [onChange],
  );

  return (
    <FileDrop accept={accept} disabled={disabled} files={files} onChange={handleChange} onDropRejected={onDropRejected}>
      <FileDropArea>
        <FileDropAreaText className="cursor-pointer text-slate-700/30 underline">Browse</FileDropAreaText>
      </FileDropArea>
      <FileDropFileArea />
    </FileDrop>
  );
}

describe('FileDrop', () => {
  it('adds accepted files through the controlled api', async () => {
    const onChange = vi.fn();
    const file = new File(['hello'], 'report.txt', { type: 'text/plain' });
    const { container } = render(<ControlledFileDrop onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([file]));
    expect(screen.queryByText('report.txt')).not.toBeNull();
    expect(screen.queryByText('text/plain')).not.toBeNull();
  });

  it('removes files through the controlled api', async () => {
    const onChange = vi.fn();
    const file = new File(['hello'], 'report.txt', { type: 'text/plain' });

    render(<ControlledFileDrop initialFiles={[file]} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /remove report\.txt/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([]));
    expect(screen.queryByText('report.txt')).toBeNull();
  });

  it('calls onDropRejected without mutating the controlled value', async () => {
    const onChange = vi.fn();
    const onDropRejected = vi.fn();
    const file = new File(['hello'], 'report.png', { type: 'image/png' });
    const { container } = render(
      <ControlledFileDrop accept={{ 'text/plain': ['.txt'] }} onChange={onChange} onDropRejected={onDropRejected} />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(onDropRejected).toHaveBeenCalled());
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText('report.png')).toBeNull();
  });

  it('keeps the input and remove action disabled when disabled', () => {
    const onChange = vi.fn();
    const file = new File(['hello'], 'report.txt', { type: 'text/plain' });
    const { container } = render(<ControlledFileDrop disabled initialFiles={[file]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const removeButton = screen.getByRole('button', { name: /remove report\.txt/i }) as HTMLButtonElement;

    expect(input.disabled).toBe(true);
    expect(removeButton.disabled).toBe(true);

    fireEvent.click(removeButton);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText('report.txt')).not.toBeNull();
  });
});
