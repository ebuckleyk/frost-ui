import * as React from 'react';
import { AssistantRuntimeProvider, useExternalStoreRuntime, type ThreadMessageLike } from '@assistant-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../Dialog';
import { EmptyDescription, EmptyTitle } from '../Empty';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../Sheet';
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
  ChatScrollToLatest,
  ChatViewport,
} from './Chat';

const completed: ThreadMessageLike[] = [
  { id: 'user-1', role: 'user', content: 'Prepare a few ideas from my field notes.' },
  {
    id: 'assistant-1',
    role: 'assistant',
    content: 'Your drafts are ready. I prepared three ideas from your field notes, ready for your review.',
    metadata: { custom: { result: true } },
  },
];

function ResultContent() {
  const [decision, setDecision] = React.useState<string>();
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="secondary" className="w-full justify-between">
            3 steps completed <span aria-hidden="true">⌄</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ol className="list-inside list-decimal space-y-2 p-3 text-sm">
            <li>Read the field notes</li>
            <li>Selected three themes</li>
            <li>Prepared drafts for review</li>
          </ol>
        </CollapsibleContent>
      </Collapsible>
      <Card>
        <CardHeader>
          <p className="text-xs font-medium text-primary">DRAFT COLLECTION</p>
          <CardTitle>Weekend field notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Three ideas for your next adventure.</p>
          <Button variant="outline" onClick={() => setDecision('Draft collection opened in this example.')}>
            Review drafts
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-2 text-sm">
        <h3 className="font-medium">Sources</h3>
        <a
          className="block text-primary underline underline-offset-4"
          href="#field-notes"
          onClick={(event) => {
            event.preventDefault();
            setDecision('Field notes selected in this example.');
          }}
        >
          Weekend field notes
        </a>
      </div>
      <Card className="border-primary/20 bg-primary/10">
        <CardHeader>
          <CardTitle>Ready for review?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Review the drafts or keep them for later.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setDecision('Review requested.')}>
              Request review
            </Button>
            <Button variant="outline" onClick={() => setDecision('Kept as drafts.')}>
              Keep as drafts
            </Button>
          </div>
          {decision ? (
            <p role="status" className="text-sm">
              {decision}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

type DemoProps = {
  fillContainer?: boolean;
  title?: string;
  animate?: boolean;
  empty?: boolean;
  pending?: boolean;
  stoppable?: boolean;
  error?: boolean;
  disabled?: boolean;
  structured?: boolean;
  long?: boolean;
};

/** Example-only application state. No model adapter, cloud client, or network calls. */
function ChatDemo({
  fillContainer = false,
  title = 'Frost assistant',
  animate = true,
  empty = false,
  pending = false,
  stoppable = true,
  error = false,
  disabled = false,
  structured = false,
  long = false,
}: DemoProps) {
  const [messages, setMessages] = React.useState<ThreadMessageLike[]>(() =>
    long
      ? [
          ...Array.from(
            { length: 24 },
            (_, index): ThreadMessageLike => ({
              id: `history-${index}`,
              role: index % 2 ? 'assistant' : 'user',
              content: `Field note ${index + 1}: A quieter route offers space to notice the changing light. `.repeat(3),
            }),
          ),
          {
            id: 'long-text',
            role: 'assistant',
            content: `Long link: https://example.test/${'unbroken-path-'.repeat(35)}\n\n${'A long response should wrap inside the conversation. '.repeat(30)}`,
          },
        ]
      : empty
        ? []
        : completed,
  );
  const [isRunning, setIsRunning] = React.useState(pending);
  const [hasError, setHasError] = React.useState(error);
  const [progress, setProgress] = React.useState(0);
  const nextId = React.useRef(0);
  const finish = () => {
    setMessages((current) => [
      ...current,
      {
        id: `reply-${++nextId.current}`,
        role: 'assistant',
        content: 'The response is ready for your review.',
        metadata: { custom: { result: true } },
      },
    ]);
    setIsRunning(false);
    setHasError(false);
  };
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    convertMessage: (message) => message,
    isRunning,
    isDisabled: disabled,
    onNew: async (message) => {
      setMessages((current) => [
        ...current,
        { id: `sent-${++nextId.current}`, role: 'user', content: message.content },
      ]);
      setHasError(false);
      setProgress(0);
      setIsRunning(true);
    },
    onCancel: stoppable
      ? async () => {
          setIsRunning(false);
        }
      : undefined,
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className={cn('flex w-full min-w-0 flex-col gap-3', fillContainer && 'h-full min-h-0')}>
        <div aria-label="Example controls" className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsRunning(true);
              setProgress((value) => value + 1);
            }}
          >
            Update progress
          </Button>
          <Button variant="outline" size="sm" onClick={finish}>
            Finish response
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsRunning(false);
              setHasError(true);
            }}
          >
            Show error
          </Button>
        </div>
        <Chat className={cn('glass-card w-full rounded-xl', fillContainer ? 'h-auto flex-1' : 'h-[min(42rem,80dvh)]')}>
          <header className="shrink-0 space-y-1 border-b border-border p-4">
            <h2 className="font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">Your workspace · Field notes</p>
          </header>
          <ChatViewport aria-label="Conversation">
            <ChatEmpty>
              <EmptyTitle>What would you like to explore?</EmptyTitle>
              <EmptyDescription>Start with a question or choose an idea.</EmptyDescription>
              <Button variant="outline" onClick={() => runtime.thread.composer.setText('Help me organize my notes')}>
                Organize my notes
              </Button>
            </ChatEmpty>
            <ChatMessages animate={animate}>
              {({ message }) =>
                message.role === 'system' ? null : (
                  <ChatMessage>
                    <ChatMessageText />
                    {structured && message.metadata.custom?.result ? <ResultContent /> : null}
                    {long && message.id === 'long-text' ? (
                      <pre className="rounded-lg bg-muted p-3 text-xs">
                        <code>{'const fieldNotes = '.repeat(35)}</code>
                      </pre>
                    ) : null}
                  </ChatMessage>
                )
              }
            </ChatMessages>
            <ChatPending>{progress > 0 ? <span>{progress} steps completed</span> : null}</ChatPending>
            {hasError ? (
              <ChatError
                onRetry={() => {
                  setHasError(false);
                  setIsRunning(true);
                }}
              >
                The response could not be completed. Your conversation is still here.
              </ChatError>
            ) : null}
            <ChatScrollToLatest />
          </ChatViewport>
          <ChatComposer>
            <ChatComposerInput label="Message assistant" placeholder="What would you like to do?" />
            <ChatComposerSend />
            <ChatComposerStop />
          </ChatComposer>
        </Chat>
      </div>
    </AssistantRuntimeProvider>
  );
}

const meta = {
  title: 'Components/Chat',
  component: ChatDemo,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChatDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Completed: Story = {};
export const EmptyConversation: Story = { args: { empty: true } };
export const Pending: Story = { args: { pending: true } };
export const PendingWithoutStop: Story = { args: { pending: true, stoppable: false } };
export const ErrorAndRetry: Story = { args: { error: true } };
export const Disabled: Story = { args: { disabled: true } };
export const StructuredContent: Story = { args: { structured: true } };
export const LongContent: Story = { args: { long: true } };
export const Dark: Story = {
  args: { structured: true },
  parameters: { theme: 'dark' },
  globals: { backgrounds: { value: 'frost-ambient-dark' } },
};
export const Mobile: Story = {
  args: { structured: true },
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
};
export const InSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open assistant</Button>
      </SheetTrigger>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Workspace assistant</SheetTitle>
          <SheetDescription>A conversation inside a Frost Sheet.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 p-3">
          <ChatDemo structured />
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const InDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open assistant dialog</Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(50rem,95dvh)] flex-col gap-3 p-4">
        <DialogHeader className="shrink-0">
          <DialogTitle>Workspace assistant</DialogTitle>
          <DialogDescription>A conversation inside a Frost Dialog.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatDemo fillContainer />
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const CustomBranding: Story = { render: () => <ChatDemo title="Amavi Insights" structured /> };
export const WithoutAnimation: Story = { render: () => <ChatDemo animate={false} /> };
