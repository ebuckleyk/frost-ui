import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { useHighlightedCode } from '../../hooks/useHighlightedCode';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from './CodeBlock';

const meta: Meta<typeof CodeBlock> = { component: CodeBlock };
export default meta;
type Story = StoryObj<typeof CodeBlock>;
const code = 'export function greet(name: string) {\n  return `Hello, ${name}!`;\n}\n';

export const Demo: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>greet.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
      <CodeBlockFooter>TypeScript</CodeBlockFooter>
    </CodeBlock>
  ),
};

function HighlightedExample() {
  const lines = useHighlightedCode(code, 'typescript');
  return (
    <CodeBlock>
      <CodeBlockActions>
        <CodeBlockCopyButton value={code} />
      </CodeBlockActions>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

export const SyntaxHighlighting: Story = { render: () => <HighlightedExample /> };
export const Diff: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent lineNumbers startLine={12}>
        <CodeBlockLine>function greeting() {'{'}</CodeBlockLine>
        <CodeBlockLine variant="removed"> return 'Hi';</CodeBlockLine>
        <CodeBlockLine variant="added"> return 'Hello';</CodeBlockLine>
        <CodeBlockLine>{'}'}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  ),
};
export const WrappedError: Story = {
  render: () => (
    <CodeBlock size="sm" variant="destructive">
      <CodeBlockHeader>
        <CodeBlockTitle>Build failed</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent wrap className="max-h-40">
        {'Error: Cannot resolve the requested module. Check the import path and install the missing dependency.\n'.repeat(
          10,
        )}
      </CodeBlockContent>
    </CodeBlock>
  ),
};
