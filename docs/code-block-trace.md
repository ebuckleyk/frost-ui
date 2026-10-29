# Code Block and Trace

Based on the shadcn [Code Block](https://ui.shadcn.com/docs/components/radix/code-block) and [Trace](https://ui.shadcn.com/docs/components/radix/trace) components, using Frost colors and existing Radix primitives.

Import either family from `@ebuckleyk/frost-ui` or its dedicated `@ebuckleyk/frost-ui/components/CodeBlock` / `@ebuckleyk/frost-ui/components/Trace` entrypoint. Include the normal Frost stylesheet.

```tsx
import {
  CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions,
  CodeBlockCopyButton, CodeBlockContent,
} from '@ebuckleyk/frost-ui/components/CodeBlock';

<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>Terminal</CodeBlockTitle>
    <CodeBlockActions><CodeBlockCopyButton value={output} /></CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent lineNumbers wrap>{output}</CodeBlockContent>
</CodeBlock>
```

`CodeBlockContent` accepts plain text or composed `CodeBlockLine` children. Lines support `default`, `added`, `removed`, and `highlighted` variants. Use `startLine` to offset numbering, `size="sm"` for compact tool output, and `variant="destructive"` for errors. `CodeBlockFooter` accepts custom controls. The copy button copies its explicit `value`, excluding visual line numbers and diff markers. Clipboard access requires a secure browser context.

For optional syntax highlighting, install the `shiki` peer dependency and import `useHighlightedCode` from `@ebuckleyk/frost-ui/hooks/useHighlightedCode`. Map its returned React nodes into `CodeBlockLine` children. The hook loads the highlighter and languages on demand; unsupported languages or loading errors keep plain text visible. It supports Bash, CSS, diff, HTML, JavaScript, JSON, JSX, Markdown, Python, SQL, TSX, TypeScript, YAML, and ANSI output.

Compose a `Trace` with `TraceLine`, `TraceIcon`, `TraceTitle`, and `TraceDescription`. Line statuses are `running`, `pending`, and `error`; omit status for completed lines. Icons are decorative, so titles should explain the action or failure. Running titles honor reduced-motion preferences.

For expandable output, place a line inside `TraceCollapsibleTrigger` within `TraceCollapsible`, followed by `TraceCollapsibleContent`. Put a compact CodeBlock inside the content. Use `defaultOpen` for uncontrolled state, or supply both `open` and `onOpenChange` for controlled state. Triggers retain Radix keyboard behavior and expanded-state semantics.
