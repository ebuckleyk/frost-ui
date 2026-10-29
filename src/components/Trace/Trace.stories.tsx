import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon, SearchIcon, TerminalIcon } from 'lucide-react';

import { CodeBlock, CodeBlockContent } from '../CodeBlock';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';

const meta: Meta<typeof Trace> = { component: Trace };
export default meta;
type Story = StoryObj<typeof Trace>;

export const Demo: Story = {
  render: () => (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <CheckIcon />
        </TraceIcon>
        <TraceTitle>Read project configuration</TraceTitle>
        <TraceDescription>0.2s</TraceDescription>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Ran build</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap>{'$ npm run build\nBuild completed successfully.'}</CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceLine status="running">
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Checking output</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceTitle>Prepare release</TraceTitle>
      </TraceLine>
    </Trace>
  ),
};

export const Error: Story = {
  render: () => (
    <Trace>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>Build failed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap>Missing module: install dependencies and try again.</CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  ),
};
