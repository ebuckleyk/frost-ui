import * as React from 'react';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './Toggle';

function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle italic">
      <FontBoldIcon className="size-4" />
    </Toggle>
  );
}

function ToggleStateGallery() {
  return (
    <div className="grid w-fit grid-cols-[auto_repeat(4,auto)] items-center gap-3 text-sm">
      <span className="text-muted-foreground">Default</span>
      <Toggle aria-label="Default unselected">
        <FontBoldIcon className="size-4" />
      </Toggle>
      <Toggle pressed aria-label="Default selected">
        <FontBoldIcon className="size-4" />
      </Toggle>
      <Toggle disabled aria-label="Default disabled">
        <FontBoldIcon className="size-4" />
      </Toggle>
      <Toggle pressed disabled aria-label="Default selected and disabled">
        <FontBoldIcon className="size-4" />
      </Toggle>
      <span className="text-muted-foreground">Outline</span>
      <Toggle variant="outline" aria-label="Outline unselected">
        <FontItalicIcon className="size-4" />
      </Toggle>
      <Toggle variant="outline" pressed aria-label="Outline selected">
        <FontItalicIcon className="size-4" />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Outline disabled">
        <FontItalicIcon className="size-4" />
      </Toggle>
      <Toggle variant="outline" pressed disabled aria-label="Outline selected and disabled">
        <FontItalicIcon className="size-4" />
      </Toggle>
    </div>
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

export const States: Story = {
  render: ToggleStateGallery,
};

export const StatesDark: Story = {
  render: ToggleStateGallery,
  parameters: { theme: 'dark' },
};
