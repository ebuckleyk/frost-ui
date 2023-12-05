import * as React from 'react';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { Toggle } from './Toggle';

function ToggleDemo() {
  return (
    <Card className="p-5">
      <Toggle aria-label="Toggle italic">
        <FontBoldIcon className="h-4 w-4" />
      </Toggle>
    </Card>
  );
}

function ToggleOutlineDemo() {
  return (
    <Card className="p-5">
      <Toggle variant="outline" aria-label="Toggle italic">
        <FontItalicIcon className="h-4 w-4" />
      </Toggle>
    </Card>
  );
}

function ToggleWithTextDemo() {
  return (
    <Card className="p-5">
      <Toggle aria-label="Toggle italic">
        <FontItalicIcon className="mr-2 h-4 w-4" />
        Italic
      </Toggle>
    </Card>
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
