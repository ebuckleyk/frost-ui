import * as React from 'react';
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from '@assistant-ui/react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../Sheet';
import {
  Chat,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  ChatComposerStop,
  ChatEmpty,
  ChatError,
  ChatMessage,
  ChatMessages,
  ChatMessageText,
  ChatPending,
  ChatViewport,
} from './Chat';

const initial: ThreadMessageLike[] = [{ id: 'a1', role: 'assistant', content: 'A completed response.' }];
const convertMessage = (message: ThreadMessageLike) => message;
type HarnessProps = {
  messages?: ThreadMessageLike[];
  loading?: boolean;
  running?: boolean;
  disabled?: boolean;
  onNew?: (message: AppendMessage) => Promise<void>;
  onCancel?: () => Promise<void>;
  children?: React.ReactNode;
};
function Harness({
  messages = initial,
  loading = false,
  running = false,
  disabled = false,
  onNew = async () => {},
  onCancel,
  children,
}: HarnessProps) {
  const runtime = useExternalStoreRuntime({
    messages,
    convertMessage,
    isLoading: loading,
    isRunning: running,
    isDisabled: disabled,
    onNew,
    onCancel,
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Chat>
        <ChatViewport aria-label="Conversation">
          <ChatEmpty>Start a conversation</ChatEmpty>
          {children ?? <ChatMessages />}
          <ChatPending label="Preparing response">Live progress</ChatPending>
        </ChatViewport>
        <ChatComposer>
          <ChatComposerInput label="Message assistant" />
          <ChatComposerSend />
          <ChatComposerStop />
        </ChatComposer>
      </Chat>
    </AssistantRuntimeProvider>
  );
}

beforeEach(() => {
  vi.mocked(window.matchMedia).mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() });
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Chat', () => {
  it('uses the application provider and existing Message/Bubble presentation', () => {
    const { container } = render(<Harness messages={[{ id: 'u', role: 'user', content: 'Hello' }, ...initial]} />);
    expect(screen.getByText('Hello').closest('[data-slot="message"]')).toHaveAttribute('data-align', 'end');
    expect(screen.getByText('Hello').closest('[data-slot="bubble"]')).toHaveAttribute('data-variant', 'tinted');
    expect(screen.getByText('A completed response.').closest('[data-slot="bubble"]')).toHaveAttribute(
      'data-variant',
      'muted',
    );
    expect(container.querySelector('[data-slot="chat-viewport"]')).not.toContainElement(
      container.querySelector('[data-slot="chat-composer"]'),
    );
    expect(screen.queryByText('Start a conversation')).not.toBeInTheDocument();
  });

  it('shows the empty content, labels the input, and disables empty sending', () => {
    render(<Harness messages={[]} />);
    expect(screen.getByText('Start a conversation')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Message assistant' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Stop response' })).not.toBeInTheDocument();
  });

  it.each(['button', 'enter'])('submits once through the runtime using %s', async (method) => {
    const onNew = vi.fn<(message: AppendMessage) => Promise<void>>(async () => {});
    render(<Harness onNew={onNew} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A new question' } });
    if (method === 'button') fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    else fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(onNew).toHaveBeenCalledTimes(1));
    expect(onNew.mock.calls[0][0].content).toEqual([{ type: 'text', text: 'A new question' }]);
    expect(input).toHaveValue('');
  });

  it('preserves Shift+Enter and prevents sending during IME composition', () => {
    const onNew = vi.fn<(message: AppendMessage) => Promise<void>>(async () => {});
    render(<Harness onNew={onNew} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Draft' } });
    expect(fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })).toBe(true);
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
    fireEvent.compositionEnd(input);
    expect(onNew).not.toHaveBeenCalled();
    expect(input).toHaveValue('Draft');
  });

  it('uses newline behavior for Enter on touch-primary devices', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const onNew = vi.fn<(message: AppendMessage) => Promise<void>>(async () => {});
    render(<Harness onNew={onNew} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Touch draft' } });
    expect(fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })).toBe(true);
    expect(onNew).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(onNew).toHaveBeenCalledTimes(1));
  });

  it('gates stop on capability, invokes cancellation once, and does not cancel on Escape', async () => {
    const onCancel = vi.fn(async () => {});
    const view = render(<Harness running />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Stop response' })).not.toBeInTheDocument();
    view.rerender(<Harness running onCancel={onCancel} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Stop response' }));
    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1));
    expect(screen.getByText('A completed response.')).toBeVisible();
  });

  it('respects app disabled state for keyboard and buttons', () => {
    const onNew = vi.fn<(message: AppendMessage) => Promise<void>>(async () => {});
    render(<Harness disabled onNew={onNew} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onNew).not.toHaveBeenCalled();
  });

  it('updates completed messages without streaming and keeps progress outside the live status', () => {
    const view = render(<Harness running />);
    expect(screen.getByRole('status')).toHaveTextContent('Preparing response');
    expect(screen.getByRole('status')).not.toHaveTextContent('Live progress');
    view.rerender(<Harness messages={[...initial, { id: 'a2', role: 'assistant', content: 'Finished.' }]} />);
    expect(screen.getByText('Finished.')).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders text safely and allows app-owned controls inside messages', () => {
    const onApprove = vi.fn();
    const { container } = render(
      <Harness messages={[{ id: 'safe', role: 'assistant', content: '<img src=x onerror=alert(1)>' }]}>
        <ChatMessages>
          {() => (
            <ChatMessage>
              <ChatMessageText />
              <button onClick={onApprove}>Approve draft</button>
              <a href="#source">Source notes</a>
            </ChatMessage>
          )}
        </ChatMessages>
      </Harness>,
    );
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeVisible();
    expect(container.querySelector('img')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Approve draft' }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it('only shows retry when supplied and localizes its label', () => {
    const retry = vi.fn();
    const view = render(<ChatError>Could not complete.</ChatError>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    view.rerender(
      <ChatError onRetry={retry} retryLabel="Retry response">
        Could not complete.
      </ChatError>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry response' }));
    expect(retry).toHaveBeenCalledTimes(1);
    view.rerender(
      <ChatError onRetry={retry} retryDisabled>
        Could not complete.
      </ChatError>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('lets a surrounding Sheet handle Escape without cancelling a response', async () => {
    const onCancel = vi.fn(async () => {});
    function InSheet() {
      const [open, setOpen] = React.useState(true);
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetTitle>Assistant</SheetTitle>
            <SheetDescription>Conversation</SheetDescription>
            <Harness running onCancel={onCancel} />
          </SheetContent>
        </Sheet>
      );
    }
    render(<InSheet />);
    await act(async () => {
      screen.getByRole('textbox').focus();
    });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onCancel).not.toHaveBeenCalled();
  });
});

describe('Chat arrival motion', () => {
  const next: ThreadMessageLike = { id: 'a2', role: 'assistant', content: 'New response' };
  const message = (text: string) => screen.getByText(text).closest('[data-slot="message"]')!;

  it('animates appended content once, without animating history or replaying updates', () => {
    const { rerender } = render(<Harness />);
    expect(message('A completed response.')).not.toHaveClass('animate-in');
    rerender(<Harness messages={[...initial, next]} />);
    expect(message('New response')).toHaveClass('animate-in');
    fireEvent.animationEnd(message('New response'));
    rerender(<Harness messages={[...initial, { ...next, content: 'Updated response' }]} />);
    expect(message('Updated response')).not.toHaveClass('animate-in');
    rerender(<Harness messages={[{ id: 'older', role: 'user', content: 'Older history' }, ...initial, next]} />);
    expect(message('Older history')).not.toHaveClass('animate-in');
  });

  it('waits for empty optimistic messages to receive content', () => {
    const { rerender } = render(<Harness />);
    rerender(<Harness messages={[...initial, { ...next, content: '' }]} running />);
    rerender(<Harness messages={[...initial, next]} />);
    expect(message('New response')).toHaveClass('animate-in');
  });

  it('baselines asynchronous history and conversation replacement', () => {
    const { rerender } = render(<Harness messages={[]} loading />);
    rerender(<Harness messages={initial} />);
    expect(message('A completed response.')).not.toHaveClass('animate-in');
    rerender(<Harness messages={[next]} />);
    expect(message('New response')).not.toHaveClass('animate-in');
  });

  it('supports opting out for the entire transcript or a custom message', () => {
    const { rerender } = render(
      <Harness>
        <ChatMessages animate={false} />
      </Harness>,
    );
    rerender(
      <Harness messages={[...initial, next]}>
        <ChatMessages animate={false} />
      </Harness>,
    );
    expect(message('New response')).not.toHaveClass('animate-in');
    rerender(
      <Harness>
        <ChatMessages>
          {() => (
            <ChatMessage animate={false}>
              <ChatMessageText />
            </ChatMessage>
          )}
        </ChatMessages>
      </Harness>,
    );
    rerender(
      <Harness messages={[...initial, next]}>
        <ChatMessages>
          {() => (
            <ChatMessage animate={false}>
              <ChatMessageText />
            </ChatMessage>
          )}
        </ChatMessages>
      </Harness>,
    );
    expect(message('New response')).not.toHaveClass('animate-in');
  });

  it('respects reduced motion', () => {
    const original = window.matchMedia;
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { rerender } = render(<Harness />);
    rerender(<Harness messages={[...initial, next]} />);
    expect(message('New response')).not.toHaveClass('animate-in');
    window.matchMedia = original;
  });
});
