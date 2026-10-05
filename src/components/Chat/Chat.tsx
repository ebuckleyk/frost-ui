'use client';

import * as React from 'react';
import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  useThreadViewport,
} from '@assistant-ui/react';
import { ArrowDownIcon, ArrowUpIcon, SquareIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Alert, AlertDescription } from '../Alert';
import { Bubble, BubbleContent } from '../Bubble';
import { Button } from '../Button';
import { Empty } from '../Empty';
import { Label } from '../Label';
import { Message, MessageContent } from '../Message';
import { Spinner } from '../Spinner';
import { Textarea } from '../Textarea';

function Chat({ className, ...props }: React.ComponentProps<typeof ThreadPrimitive.Root>) {
  return (
    <ThreadPrimitive.Root
      data-slot="chat"
      className={cn('relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden', className)}
      {...props}
    />
  );
}

type ChatViewportProps = React.ComponentProps<typeof ThreadPrimitive.Viewport> & { 'aria-label': string };

function ChatViewport({ className, children, ...props }: ChatViewportProps) {
  return (
    <ThreadPrimitive.Viewport
      data-slot="chat-viewport"
      role="region"
      tabIndex={0}
      scrollToBottomOnRunStart={false}
      className={cn(
        'relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4 focus-visible:outline-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      <div className="flex min-h-full min-w-0 flex-col gap-4">{children}</div>
    </ThreadPrimitive.Viewport>
  );
}

type ChatMessagesProps = {
  children?: Extract<React.ComponentProps<typeof ThreadPrimitive.Messages>, { children: unknown }>['children'];
  /** Animate new arrivals only; loaded history is never animated. */
  animate?: boolean;
};

const ArrivalContext = React.createContext<{
  ids: ReadonlySet<string>;
  finish: (id: string) => void;
}>({ ids: new Set(), finish: () => {} });

function ChatMessages({ children, animate = true }: ChatMessagesProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const enabled = animate && !reducedMotion;
  const threadId = useAuiState((s) => s.threadListItem.id);
  const loading = useAuiState((s) => s.thread.isLoading);
  // Track identities only. Empty optimistic responses become eligible when content arrives.
  const signature = useAuiState((s) =>
    JSON.stringify(
      s.thread.messages
        .filter(
          (message) =>
            message.role !== 'system' &&
            (message.content.some((part) => part.type !== 'text' || part.text.length > 0) ||
              Object.keys(message.metadata.custom).length > 0),
        )
        .map((message) => message.id),
    ),
  );
  const [snapshot, setSnapshot] = React.useState(() => ({
    signature,
    threadId,
    loading,
    enabled,
    seen: new Set<string>(JSON.parse(signature)),
    arrivals: new Set<string>(),
  }));
  if (
    snapshot.signature !== signature ||
    snapshot.threadId !== threadId ||
    snapshot.loading !== loading ||
    snapshot.enabled !== enabled
  ) {
    const ids: string[] = JSON.parse(signature);
    const previous: string[] = JSON.parse(snapshot.signature);
    const tail = previous.length ? ids.indexOf(previous[previous.length - 1]) : -1;
    const reset =
      threadId !== snapshot.threadId ||
      loading ||
      snapshot.loading ||
      enabled !== snapshot.enabled ||
      (previous.length > 0 && tail === -1);
    const arrivals = new Set(reset ? [] : [...snapshot.arrivals].filter((id) => ids.includes(id)));
    if (!reset && enabled) {
      ids.slice(tail + 1).forEach((id) => {
        if (!snapshot.seen.has(id)) arrivals.add(id);
      });
    }
    setSnapshot({
      signature,
      threadId,
      loading,
      enabled,
      arrivals,
      seen: new Set(reset ? ids : [...snapshot.seen, ...ids]),
    });
  }
  const finish = React.useCallback((id: string) => {
    setSnapshot((current) => {
      if (!current.arrivals.has(id)) return current;
      const arrivals = new Set(current.arrivals);
      arrivals.delete(id);
      return { ...current, arrivals };
    });
  }, []);
  const arrivals = React.useMemo(() => ({ ids: snapshot.arrivals, finish }), [snapshot.arrivals, finish]);
  return (
    <ArrivalContext.Provider value={arrivals}>
      <ThreadPrimitive.Messages>
        {children ??
          (({ message }) =>
            message.role === 'system' ? null : (
              <ChatMessage>
                <ChatMessageText />
              </ChatMessage>
            ))}
      </ThreadPrimitive.Messages>
    </ArrivalContext.Provider>
  );
}

type ChatMessageProps = React.ComponentProps<typeof Message> & { animate?: boolean };

function ChatMessage({ children, className, animate = true, onAnimationEnd, ...props }: ChatMessageProps) {
  const isUser = useAuiState((s) => s.message.role === 'user');
  const id = useAuiState((s) => s.message.id);
  const arrivals = React.useContext(ArrivalContext);
  return (
    <MessagePrimitive.Root asChild>
      <Message
        align={isUser ? 'end' : 'start'}
        className={cn(
          'wrap-anywhere [&_pre]:max-w-full [&_pre]:overflow-x-auto',
          animate &&
            arrivals.ids.has(id) &&
            'animate-in duration-200 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none',
          className,
        )}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) arrivals.finish(id);
          onAnimationEnd?.(event);
        }}
        {...props}
      >
        <MessageContent>{children}</MessageContent>
      </Message>
    </MessagePrimitive.Root>
  );
}

/** Text only. Structured parts are deliberately left to the consumer's message renderer. */
function ChatMessageText({ variant, ...props }: Omit<React.ComponentProps<typeof Bubble>, 'children'>) {
  const isUser = useAuiState((s) => s.message.role === 'user');
  const text = useAuiState((s) =>
    s.message.content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n'),
  );
  if (!text) return null;
  return (
    <Bubble variant={variant ?? (isUser ? 'tinted' : 'muted')} align={isUser ? 'end' : 'start'} {...props}>
      <BubbleContent className="wrap-anywhere whitespace-pre-wrap">{text}</BubbleContent>
    </Bubble>
  );
}

function ChatComposer({ className, ...props }: React.ComponentProps<typeof ComposerPrimitive.Root>) {
  return (
    <ComposerPrimitive.Root
      data-slot="chat-composer"
      className={cn('flex shrink-0 items-end gap-2 border-t border-border p-4', className)}
      {...props}
    />
  );
}

type ChatComposerInputProps = Omit<
  React.ComponentProps<typeof ComposerPrimitive.Input>,
  'asChild' | 'render' | 'children' | 'value' | 'defaultValue' | 'submitOnEnter'
> & {
  label: string;
  hideLabel?: boolean;
};

function ChatComposerInput({ label, hideLabel = false, id, className, ...props }: ChatComposerInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Label htmlFor={inputId} className={hideLabel ? 'sr-only' : undefined}>
        {label}
      </Label>
      <ComposerPrimitive.Input
        asChild
        id={inputId}
        submitMode="enter"
        cancelOnEscape={false}
        autoFocus={false}
        unstable_focusOnRunStart={false}
        unstable_focusOnScrollToBottom={false}
        unstable_focusOnThreadSwitched={false}
        unstable_insertNewlineOnTouchEnter
        addAttachmentOnPaste={false}
        {...props}
      >
        <Textarea
          className={cn('max-h-40 min-h-11 resize-none overflow-y-auto motion-reduce:transition-none', className)}
        />
      </ComposerPrimitive.Input>
    </div>
  );
}

type ChatActionProps = Omit<React.ComponentProps<typeof Button>, 'asChild'> & { label?: string };

function ChatComposerSend({ label = 'Send message', children, className, ...props }: ChatActionProps) {
  return (
    <ComposerPrimitive.Send asChild>
      <Button
        type="button"
        size="icon"
        aria-label={label}
        className={cn('size-11 shrink-0 rounded-full motion-reduce:transition-none', className)}
        {...props}
      >
        {children ?? <ArrowUpIcon aria-hidden="true" />}
      </Button>
    </ComposerPrimitive.Send>
  );
}

function ChatComposerStop({ label = 'Stop response', children, className, ...props }: ChatActionProps) {
  const canStop = useAuiState((s) => s.thread.isRunning && s.thread.capabilities.cancel && s.composer.canCancel);
  if (!canStop) return null;
  return (
    <ComposerPrimitive.Cancel asChild>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={label}
        className={cn('size-11 shrink-0 rounded-full motion-reduce:transition-none', className)}
        {...props}
      >
        {children ?? <SquareIcon aria-hidden="true" />}
      </Button>
    </ComposerPrimitive.Cancel>
  );
}

/** Place inside ChatViewport so the upstream viewport context is available. */
function ChatScrollToLatest({ label = 'Scroll to latest message', children, className, ...props }: ChatActionProps) {
  const isAtBottom = useThreadViewport((s) => s.isAtBottom);
  if (isAtBottom) return null;
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={label}
        className={cn(
          'sticky bottom-0 z-10 size-11 shrink-0 self-center rounded-full motion-reduce:transition-none',
          className,
        )}
        {...props}
      >
        {children ?? <ArrowDownIcon aria-hidden="true" />}
      </Button>
    </ThreadPrimitive.ScrollToBottom>
  );
}

function ChatEmpty(props: React.ComponentProps<typeof Empty>) {
  const isEmpty = useAuiState((s) => s.thread.isEmpty && !s.thread.isRunning);
  return isEmpty ? <Empty {...props} /> : null;
}

type ChatPendingProps = React.ComponentProps<'div'> & { label?: string };

function ChatPending({ label = 'Working…', children, className, ...props }: ChatPendingProps) {
  const isRunning = useAuiState((s) => s.thread.isRunning);
  if (!isRunning) return null;
  return (
    <div
      data-slot="chat-pending"
      className={cn('flex min-w-0 items-center gap-2 text-sm text-muted-foreground', className)}
      {...props}
    >
      <Spinner
        role="presentation"
        aria-hidden="true"
        aria-label={undefined}
        className="shrink-0 motion-reduce:animate-none"
      />
      <span role="status" aria-live="polite">
        {label}
      </span>
      {children ? <div aria-live="off">{children}</div> : null}
    </div>
  );
}

type ChatErrorProps = React.ComponentProps<typeof Alert> & {
  onRetry?: React.MouseEventHandler<HTMLButtonElement>;
  retryLabel?: string;
  retryDisabled?: boolean;
};

/** The consumer decides when an error exists and what retry means. */
function ChatError({ children, onRetry, retryLabel = 'Try again', retryDisabled, ...props }: ChatErrorProps) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertDescription>
        {children}
        {onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry} disabled={retryDisabled}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

export {
  Chat,
  ChatViewport,
  ChatMessages,
  ChatMessage,
  ChatMessageText,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  ChatComposerStop,
  ChatScrollToLatest,
  ChatEmpty,
  ChatPending,
  ChatError,
};
export type {
  ChatViewportProps,
  ChatMessagesProps,
  ChatMessageProps,
  ChatComposerInputProps,
  ChatActionProps,
  ChatPendingProps,
  ChatErrorProps,
};
