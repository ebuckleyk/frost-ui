import * as React from 'react';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';

import { Toggle } from './Toggle';

function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <FontBoldIcon className="size-4" />
    </Toggle>
  );
}

function ToggleOutlineDemo() {
  return (
    <Toggle variant="outline" aria-label="Toggle italic">
      <FontItalicIcon className="size-4" />
    </Toggle>
  );
}

function ToggleWithTextDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <FontItalicIcon className="mr-2 size-4" />
      Italic
    </Toggle>
  );
}
type ComponentType = React.ComponentProps<typeof Toggle>;
const meta: Meta<ComponentType> = {
  component: Toggle,
  render: ToggleDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const ToggleOutline: Story = {
  render: ToggleOutlineDemo,
};

export const ToggleWithText: Story = {
  render: ToggleWithTextDemo,
};
