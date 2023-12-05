import * as React from 'react';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';
import { Meta, StoryObj } from '@storybook/react';

import { Card } from '../Card';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

function ToggleGroupDemo() {
  return (
    <Card className="p-10">
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <FontBoldIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <FontItalicIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
          <UnderlineIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </Card>
  );
}

function OutlineToggleGroupDemo() {
  return (
    <Card className="p-10">
      <ToggleGroup type="multiple" variant="outline">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <FontBoldIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <FontItalicIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
          <UnderlineIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </Card>
  );
}
type ComponentType = React.ComponentProps<typeof ToggleGroup>;
const meta: Meta<ComponentType> = {
  component: ToggleGroup,
  render: ToggleGroupDemo,
};

export default meta;

type Story = StoryObj<ComponentType>;
export const Demo: Story = {};

export const OutlineToggleGroup: Story = {
  render: OutlineToggleGroupDemo,
};
