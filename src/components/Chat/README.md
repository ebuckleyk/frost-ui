# Chat integration and VibeCore handoff

Chat is an opt-in set of Frost components connected to an application-owned assistant-ui runtime. Existing Bubble, Message, and MessageScroller components are unchanged.

## Installation

```sh
npm install @ebuckleyk/frost-ui @assistant-ui/react@0.15.23 react@^19 react-dom@^19 @radix-ui/react-slot @radix-ui/react-label class-variance-authority clsx tailwind-merge lucide-react
```

Frost tests against **@assistant-ui/react 0.15.23** and declares the optional peer range `>=0.15.23 <0.16.0`. Use the exact tested version initially. React/React DOM retain Frost's React 19 requirement. Install the additional peers for any Card, Collapsible, Sheet, or other components your application composes.

Import Chat only from `@ebuckleyk/frost-ui/components/Chat`. It is intentionally absent from the root barrel. Assistant-ui remains an external peer: the provider and the Frost components must resolve the same installed copy. Check `npm ls @assistant-ui/react @assistant-ui/core @assistant-ui/store react` if context errors occur; do not bundle or alias a private second runtime.

The upstream dependency tree includes `assistant-cloud`. No cloud client or hosted runtime is created by Frost; no cloud account, configuration, API key, or service call is required. Use `useExternalStoreRuntime`, not a hosted runtime adapter.

Keep your existing Frost CSS setup. Tailwind v4 applications import `@ebuckleyk/frost-ui/tailwind.css` and register their application sources; compiled-CSS consumers import `@ebuckleyk/frost-ui/styles.css`. Do not import both. Chat's utility classes are included through the existing CSS pipeline.

## Minimal application-owned integration

This example accepts application state and callbacks. Completed snapshots and progress updates work without token streaming. The application is responsible for appending the user message, setting running state, delivering the completed assistant message, and handling failures.

```tsx
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type AppendMessage,
  type ThreadMessageLike,
} from '@assistant-ui/react';
import {
  Chat,
  ChatComposer,
  ChatComposerInput,
  ChatComposerSend,
  ChatComposerStop,
  ChatEmpty,
  ChatError,
  ChatMessages,
  ChatPending,
  ChatScrollToLatest,
  ChatViewport,
} from '@ebuckleyk/frost-ui/components/Chat';

const convertMessage = (message: ThreadMessageLike) => message;

type AssistantPanelProps = {
  messages: readonly ThreadMessageLike[];
  isRunning: boolean;
  disabled?: boolean;
  progress?: string;
  error?: string;
  onSend: (message: AppendMessage) => Promise<void>;
  onStopDelivery?: () => Promise<void>;
  onRetry?: () => void;
};

export function AssistantPanel(props: AssistantPanelProps) {
  const runtime = useExternalStoreRuntime({
    messages: props.messages,
    convertMessage,
    isRunning: props.isRunning,
    isDisabled: props.disabled,
    onNew: props.onSend,
    onCancel: props.onStopDelivery,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Chat className="h-[40rem]">
        <header className="shrink-0 border-b p-4">Amavi</header>
        <ChatViewport aria-label="Conversation with Amavi">
          <ChatEmpty>What would you like to work on?</ChatEmpty>
          <ChatMessages />
          <ChatPending label="Working…">{props.progress}</ChatPending>
          {props.error ? (
            <ChatError onRetry={props.onRetry} retryDisabled={props.isRunning}>
              {props.error}
            </ChatError>
          ) : null}
          <ChatScrollToLatest />
        </ChatViewport>
        <ChatComposer>
          <ChatComposerInput label="Message Amavi" placeholder="What would you like to do?" />
          <ChatComposerSend label="Send message" />
          <ChatComposerStop label="Stop response" />
        </ChatComposer>
      </Chat>
    </AssistantRuntimeProvider>
  );
}
```

`onSend` receives assistant-ui's `AppendMessage`, not a string. Extract the text parts or translate the message inside your application adapter. Use stable message IDs and immutable message updates. For an application-specific message format, provide `convertMessage` instead of copying messages into a second UI store. The application should catch request errors and publish its error state; Chat does not invent a retry or persistence policy.

Stopping invokes the application's `onCancel` through the runtime. The app must settle `isRunning` and decide how to ignore late deliveries. This does not promise that an external publishing, scheduling, or other backend operation was cancelled or undone. Omit `onCancel` to omit Stop. No editing, regeneration, attachments, or tool-execution controls are mounted automatically.

## Custom message composition

`ChatMessages` accepts the current assistant-ui render function, with message context already established. Use regular React components and existing Frost parts. No tool-card schema is required.

```tsx
import { Button } from '@ebuckleyk/frost-ui/components/Button';
import { Card, CardContent } from '@ebuckleyk/frost-ui/components/Card';
import { ChatMessage, ChatMessages, ChatMessageText } from '@ebuckleyk/frost-ui/components/Chat';

<ChatMessages>
  {({ message }) =>
    message.role === 'system' ? null : (
      <ChatMessage>
        <ChatMessageText />
        {message.role === 'assistant' && resultsByMessageId[message.id] ? (
          <Card>
            <CardContent>
              <p>{resultsByMessageId[message.id].title}</p>
              <Button onClick={() => openResult(message.id)}>Review result</Button>
            </CardContent>
          </Card>
        ) : null}
      </ChatMessage>
    )
  }
</ChatMessages>;
```

Here `resultsByMessageId` and `openResult` belong to the application. Progress disclosures, evidence links, thumbnails, approval authority, routes, logos, and account selectors remain application concerns. Use existing MessageHeader/MessageFooter as children for names and timestamps. `ChatMessageText` renders only text parts, escaped by React; non-text parts require explicit consumer rendering. Pass its `variant` prop to select an existing Bubble treatment. Default user bubbles are tinted and right-aligned; assistant bubbles are muted and left-aligned.

## Layout and accessibility contract

- Supply a bounded height through the containing page, panel, or Sheet. Keep header and composer siblings of ChatViewport so only the transcript scrolls. Flex ancestors must permit shrinking with `min-h-0`.
- Put ChatScrollToLatest **inside** ChatViewport; it uses the viewport's context. It appears while reading older content. Initial history scrolls to the bottom; incoming content follows only while already at the bottom. Run start does not force a jump.
- ChatComposerInput requires `label`; `hideLabel` keeps it available to assistive technology. Input text belongs to the runtime. Do not control it with a second state variable. Starter buttons can call `runtime.thread.composer.setText(...)`.
- Enter submits; Shift+Enter inserts a newline. Touch-primary Enter inserts a newline, with the explicit Send button available. `submitMode` can override keyboard submission. IME composition is not submitted.
- Automatic input focus and Escape cancellation are off by default. Sheet/Dialog owns its focus trap, initial focus, close controls, and Escape behavior. Do not put ChatComposer inside another HTML form.
- Buttons have localizable `label` props and support custom children. Empty content and error text are supplied as children. ChatError's retry button is absent without `onRetry`.
- Keep ChatPending's `label` stable (for example, “Working…”); put frequent progress changes in its children, which are outside the polite status announcement. The transcript is not an assertive live region.
- Long text and URLs wrap; preformatted content scrolls locally. Consumers must also constrain custom media and tables. Controls retain Frost focus styles and respect reduced motion.

## Examples and limitations

Storybook's Components/Chat stories use only local, deterministic application state. The example controls let you update progress, finish a response, or show an error; sending begins pending work. They demonstrate completed, empty, disabled, error/retry, cancellable/non-cancellable, custom content, long content, dark, mobile, and Sheet compositions. No live AI calls occur.

There is no backend adapter, token-stream requirement, Markdown renderer, history virtualization, automatic tool execution, or product approval workflow in this entrypoint. There is no migration for existing Bubble/Message users. Apps already using a different assistant-ui minor should align versions before adoption rather than installing a second copy. Browser checks and automated accessibility checks do not establish full accessibility compliance.

## Branding, styling, and message motion

"Frost assistant" is example header content, not a component default. Supply any header, logo, and copy (such as "Amavi Insights"). Presentation components accept `className` and their underlying Frost props; use Frost semantic theme tokens for app-wide styling. `ChatMessageText` accepts Bubble `variant` and `className`. `ChatMessages` has no DOM wrapper; style its message children or viewport instead.

```tsx
<Chat className="h-full rounded-xl border border-border">
  <header className="shrink-0 p-4 font-semibold">Amavi Insights</header>
  <ChatViewport aria-label="Conversation with Amavi Insights">
    <ChatMessages />
  </ChatViewport>
  <ChatComposer>
    <ChatComposerInput label="Message Amavi Insights" />
    <ChatComposerSend label="Send to Amavi Insights" />
  </ChatComposer>
</Chat>
```

Newly appended messages receive a subtle 200ms fade and upward entrance. Initial history, prepended history, and content/progress updates do not replay it. Empty optimistic assistant messages wait for text, another content part, or custom metadata. For content stored entirely outside the runtime, supply custom metadata to mark the message ready, or manage that content's animation in the app. Reduced-motion preferences disable the entrance. Motion uses opacity/translation and leaves assistant-ui in control of scrolling.

Use `<ChatMessages animate={false} />` to disable entrances, or `<ChatMessage animate={false}>` in a custom renderer to disable a particular message. Pass `isLoading` to the application's external-store adapter while fetching history, so asynchronous history is not treated as a new arrival. If reusing one runtime for different application conversations, key `ChatMessages` by the application's conversation ID. Use stable message IDs. The Custom Branding and Without Animation stories demonstrate these options; send a message and use Finish response to exercise arrivals.
