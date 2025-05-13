import * as React from 'react';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';

import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

function ToggleGroupDemo() {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <FontBoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <FontItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function OutlineToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <FontBoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <FontItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
type ComponentType = React.ComponentProps<typeof ToggleGroup>;
const meta: Meta<ComponentType> = {
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {
  render: ToggleGroupDemo,
};

export const OutlineToggleGroup: Story = {
  render: OutlineToggleGroupDemo,
};
