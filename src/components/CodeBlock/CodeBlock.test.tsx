import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodeBlock, CodeBlockContent, CodeBlockCopyButton } from './CodeBlock';

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
afterEach(() => {
  vi.restoreAllMocks();
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe('CodeBlock', () => {
  it('preserves blank lines, escapes code, and numbers from the requested line', () => {
    const { container } = render(
      <CodeBlock>
        <CodeBlockContent lineNumbers startLine={42} wrap>
          {'<script>\n\nend\n'}
        </CodeBlockContent>
      </CodeBlock>,
    );
    const pre = container.querySelector('pre');
    expect(pre).toHaveAttribute('dir', 'ltr');
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).toHaveStyle({ counterReset: 'line 41' });
    expect(container.querySelectorAll('[data-slot=code-block-line]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-slot=code-block-line-content]')[1].textContent).toBe('\n');
    expect(container.querySelector('script')).toBeNull();
  });

  it('copies the original value and announces success without submitting a form', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const submit = vi.fn();
    render(
      <form onSubmit={submit}>
        <CodeBlockCopyButton value={'hello\n\nworld'} />
      </form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith('hello\n\nworld');
    expect(submit).not.toHaveBeenCalled();
  });

  it('respects cancellation', () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<CodeBlockCopyButton value="hello" onClick={(event) => event.preventDefault()} />);
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Copy' }))).not.toThrow();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('handles unavailable clipboard APIs without reporting success', () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    render(<CodeBlockCopyButton value="hello" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('does not report success when clipboard permission is denied', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<CodeBlockCopyButton value="hello" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });
});
