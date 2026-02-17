import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Command } from 'lucide-react';

import { Kbd, KbdGroup } from './Kbd';

function BasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to copy
      </p>
      <p className="text-sm">
        Press <Kbd>Enter</Kbd> to submit
      </p>
    </div>
  );
}

function WithIconDemo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Press{' '}
        <Kbd>
          <Command className="size-3" /> K
        </Kbd>{' '}
        to search
      </p>
      <p className="text-sm">
        Use{' '}
        <Kbd>
          <Command className="size-3" /> ⇧ P
        </Kbd>{' '}
        to open command palette
      </p>
    </div>
  );
}

function KbdGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>Shift</Kbd>
          <span>+</span>
          <Kbd>P</Kbd>
        </KbdGroup>
      </p>
      <p className="text-sm">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <span>+</span>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
    </div>
  );
}

function SingleKeysDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>⏎</Kbd>
      <Kbd>⌫</Kbd>
      <Kbd>⎋</Kbd>
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  );
}

function TextKeysDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Kbd>A</Kbd>
      <Kbd>B</Kbd>
      <Kbd>C</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  );
}

const meta: Meta<typeof Kbd> = {
  component: Kbd,
  subcomponents: { KbdGroup },
};

export default meta;

type Story = StoryObj<typeof Kbd>;

export const Demo: Story = {
  render: BasicDemo,
};

export const WithIcon: Story = {
  render: WithIconDemo,
};

export const GroupedKeys: Story = {
  render: KbdGroupDemo,
};

export const SingleKeys: Story = {
  render: SingleKeysDemo,
};

export const TextKeys: Story = {
  render: TextKeysDemo,
};
